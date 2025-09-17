"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Ticket, UserPlus, Trash2, Search } from "lucide-react"
import { User } from "@/lib/api"
import { adminCouponApi, adminUserApi, Coupon, CouponCreateRequest, UserCoupon } from "@/lib/admin"
import { toast } from "@/components/ui/use-toast"

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([])
    const [isLoading, setIsLoading] = useState({ coupons: true, users: true, userCoupons: false })
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isGrantDialogOpen, setIsGrantDialogOpen] = useState(false)
    const [newCoupon, setNewCoupon] = useState<CouponCreateRequest>({
        description: "",
        discountType: "FIXED_AMOUNT",
        expiryDate: ""
    })
    const [grantData, setGrantData] = useState({ userId: "", couponId: 0 })

    const fetchAllCoupons = async () => {
        setIsLoading(prev => ({ ...prev, coupons: true }))
        try {
            const data = await adminCouponApi.getAll()
            setCoupons(data.content)
        } catch (error) {
            toast({ title: "오류", description: "쿠폰 목록을 불러오는 데 실패했습니다.", variant: "destructive" })
        } finally {
            setIsLoading(prev => ({ ...prev, coupons: false }))
        }
    }

    const fetchUsers = async () => {
        setIsLoading(prev => ({ ...prev, users: true }))
        try {
            const data = await adminUserApi.getAll(0, 100) // Fetch up to 100 users for selection
            setUsers(data.content ?? [])
        } catch (error) {
            toast({ title: "오류", description: "회원 목록을 불러오는 데 실패했습니다.", variant: "destructive" })
        } finally {
            setIsLoading(prev => ({ ...prev, users: false }))
        }
    }

    useEffect(() => {
        fetchAllCoupons()
        fetchUsers()
    }, [])

    const handleCreateCoupon = async () => {
        try {
            await adminCouponApi.issue(newCoupon)
            toast({ title: "성공", description: "새로운 쿠폰이 발급되었습니다." })
            setIsDialogOpen(false)
            setNewCoupon({ description: "", discountType: "FIXED_AMOUNT", expiryDate: "" })
            fetchAllCoupons()
        } catch (error) {
            toast({ title: "오류", description: "쿠폰 발급에 실패했습니다.", variant: "destructive" })
        }
    }

    const handleRevokeCoupon = async (couponId: number) => {
        if (confirm("정말로 이 쿠폰을 비활성화하시겠습니까?")) {
            try {
                await adminCouponApi.revoke(couponId)
                toast({ title: "성공", description: "쿠폰이 비활성화되었습니다." })
                fetchAllCoupons()
            } catch (error) {
                toast({ title: "오류", description: "쿠폰 비활성화에 실패했습니다.", variant: "destructive" })
            }
        }
    }

    const handleSearchUserCoupons = async (userId: string) => {
        if (!userId) return
        setIsLoading(prev => ({...prev, userCoupons: true}))
        try {
            const data = await adminCouponApi.getUserCoupons(userId)
            setUserCoupons(data.content)
            setSelectedUser(users.find(u => u.id === userId) || null)
        } catch (error) {
            toast({ title: "오류", description: "회원의 쿠폰 목록을 불러오는 데 실패했습니다.", variant: "destructive" })
        } finally {
            setIsLoading(prev => ({...prev, userCoupons: false}))
        }
    }

    const handleGrantCoupon = async () => {
        if (!grantData.userId || !grantData.couponId) {
            toast({ title: "오류", description: "회원과 쿠폰을 모두 선택해주세요.", variant: "destructive" })
            return
        }
        try {
            await adminCouponApi.grantToUser(grantData.userId, grantData.couponId)
            toast({ title: "성공", description: "회원에게 쿠폰이 지급되었습니다." })
            setIsGrantDialogOpen(false)
            if (selectedUser?.id === grantData.userId) {
                handleSearchUserCoupons(grantData.userId)
            }
        } catch (error) {
            toast({ title: "오류", description: "쿠폰 지급에 실패했습니다.", variant: "destructive" })
        }
    }

    const handleRevokeUserCoupon = async (userCouponId: number) => {
        if (confirm("정말로 이 쿠폰을 회수하시겠습니까?")) {
            try {
                await adminCouponApi.revokeFromUser(userCouponId)
                toast({ title: "성공", description: "쿠폰이 회수되었습니다." })
                if (selectedUser) {
                    handleSearchUserCoupons(selectedUser.id)
                }
            } catch (error) {
                toast({ title: "오류", description: "쿠폰 회수에 실패했습니다.", variant: "destructive" })
            }
        }
    }

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-navy-900">쿠폰 관리</h1>
                    <p className="text-gray-600">쿠폰을 발급하고 회원에게 지급/회수합니다.</p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)}><PlusCircle className="w-4 h-4 mr-2"/>새 쿠폰 발급</Button>
            </div>

            <Tabs defaultValue="list">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="list"><Ticket className="w-4 h-4 mr-2"/>쿠폰 목록</TabsTrigger>
                    <TabsTrigger value="grant"><UserPlus className="w-4 h-4 mr-2"/>회원 쿠폰 관리</TabsTrigger>
                </TabsList>

                {/* Coupon List Tab */}
                <TabsContent value="list" className="mt-6">
                    <Card>
                        <CardHeader><CardTitle>전체 쿠폰 목록</CardTitle><CardDescription>발급된 모든 쿠폰 템플릿입니다.</CardDescription></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>설명</TableHead><TableHead>코드</TableHead><TableHead>타입</TableHead><TableHead>할인</TableHead><TableHead>상태</TableHead><TableHead>만료일</TableHead><TableHead>작업</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {isLoading.coupons ? <TableRow><TableCell colSpan={8} className="text-center">로딩 중...</TableCell></TableRow> :
                                        coupons.map(coupon => (
                                            <TableRow key={coupon.id}>
                                                <TableCell>{coupon.id}</TableCell>
                                                <TableCell>{coupon.description}</TableCell>
                                                <TableCell className="font-mono">{coupon.code}</TableCell>
                                                <TableCell>{coupon.discountType === 'FIXED_AMOUNT' ? '정액' : '정률'}</TableCell>
                                                <TableCell>{coupon.discountType === 'FIXED_AMOUNT' ? `${coupon.discountAmount?.toLocaleString()}원` : `${coupon.discountRate}%`}</TableCell>
                                                <TableCell><Badge variant={coupon.status === 'ACTIVE' ? 'default' : 'destructive'}>{coupon.status}</Badge></TableCell>
                                                <TableCell>{coupon.expiryDate}</TableCell>
                                                <TableCell><Button variant="destructive" size="sm" onClick={() => handleRevokeCoupon(coupon.id)} disabled={coupon.status !== 'ACTIVE'}>회수</Button></TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Grant/Manage User Coupons Tab */}
                <TabsContent value="grant" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader><CardTitle>쿠폰 지급</CardTitle><CardDescription>특정 회원에게 쿠폰을 지급합니다.</CardDescription></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2"><Label>회원 선택</Label><Select onValueChange={value => setGrantData(prev => ({...prev, userId: value}))}><SelectTrigger><SelectValue placeholder="회원 선택..."/></SelectTrigger><SelectContent>{users.map(user => <SelectItem key={user.id} value={user.id}>{user.name} ({user.email})</SelectItem>)}</SelectContent></Select></div>
                                    <div className="space-y-2"><Label>쿠폰 선택</Label><Select onValueChange={value => setGrantData(prev => ({...prev, couponId: Number(value)}))}><SelectTrigger><SelectValue placeholder="쿠폰 선택..."/></SelectTrigger><SelectContent>{coupons.filter(c => c.status === 'ACTIVE').map(coupon => <SelectItem key={coupon.id} value={String(coupon.id)}>{coupon.description}</SelectItem>)}</SelectContent></Select></div>
                                    <Button className="w-full" onClick={handleGrantCoupon}>쿠폰 지급</Button>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader><CardTitle>회원 쿠폰 조회</CardTitle><CardDescription>회원을 검색하여 보유 쿠폰을 확인합니다.</CardDescription></CardHeader>
                                <CardContent>
                                    <div className="flex gap-2 mb-4">
                                        <Select onValueChange={value => handleSearchUserCoupons(value)}>
                                            <SelectTrigger><SelectValue placeholder="회원 검색..."/></SelectTrigger>
                                            <SelectContent>{users.map(user => <SelectItem key={user.id} value={user.id}>{user.name} ({user.email})</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    {selectedUser && (
                                        <div>
                                            <h3 className="font-semibold mb-2">{selectedUser.name}님의 보유 쿠폰 ({userCoupons.length}개)</h3>
                                            <div className="max-h-96 overflow-y-auto space-y-2">
                                                {userCoupons.map(uc => (
                                                    <div key={uc.userCouponId} className="flex justify-between items-center p-3 border rounded-md bg-gray-50">
                                                        <div>
                                                            <p className="font-medium">{uc.description}</p>
                                                            <p className="text-xs text-gray-500">만료일: {uc.expiryDate}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant={uc.isUsed ? "secondary" : "default"}>{uc.isUsed ? '사용완료' : '미사용'}</Badge>
                                                            {!uc.isUsed && <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => handleRevokeUserCoupon(uc.userCouponId)}><Trash2 className="w-4 h-4"/></Button>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* New Coupon Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>새 쿠폰 발급</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2"><Label>쿠폰 설명</Label><Input value={newCoupon.description} onChange={e => setNewCoupon({...newCoupon, description: e.target.value})} placeholder="예: 신규 가입 10% 할인 쿠폰"/></div>
                        <div className="space-y-2"><Label>만료일</Label><Input type="date" value={newCoupon.expiryDate} onChange={e => setNewCoupon({...newCoupon, expiryDate: e.target.value})}/></div>
                        <div className="space-y-2"><Label>할인 타입</Label><Select value={newCoupon.discountType} onValueChange={(value: "FIXED_AMOUNT" | "PERCENTAGE") => setNewCoupon({...newCoupon, discountType: value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="FIXED_AMOUNT">정액</SelectItem><SelectItem value="PERCENTAGE">정률</SelectItem></SelectContent></Select></div>
                        {newCoupon.discountType === 'FIXED_AMOUNT' && <div className="space-y-2"><Label>할인 금액</Label><Input type="number" onChange={e => setNewCoupon({...newCoupon, discountAmount: Number(e.target.value)})} placeholder="10000"/></div>}
                        {newCoupon.discountType === 'PERCENTAGE' && (
                            <>
                                <div className="space-y-2"><Label>할인율 (%)</Label><Input type="number" onChange={e => setNewCoupon({...newCoupon, discountRate: Number(e.target.value)})} placeholder="10"/></div>
                                <div className="space-y-2"><Label>최대 할인 금액</Label><Input type="number" onChange={e => setNewCoupon({...newCoupon, maxDiscountAmount: Number(e.target.value)})} placeholder="50000"/></div>
                            </>
                        )}
                    </div>
                    <DialogFooter><Button onClick={handleCreateCoupon}>발급하기</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}