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
import { PlusCircle, Ticket, UserPlus, Trash2, Search, Percent, Wallet, Gift, Frown, Users, CheckCircle, Grid } from "lucide-react"
import { User } from "@/lib/api"
import { adminCouponApi, adminUserApi, Coupon, CouponCreateRequest, UserCoupon } from "@/lib/admin"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

// Stat Card 컴포넌트
function StatCard({ title, value, icon: Icon, description, isLoading }: { title: string, value: string | number, icon: React.ElementType, description?: string, isLoading: boolean }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <>
                        <Skeleton className="h-8 w-16 mt-1" />
                        <Skeleton className="h-4 w-24 mt-2" />
                    </>
                ) : (
                    <>
                        <div className="text-2xl font-bold">{value}</div>
                        {description && <p className="text-xs text-muted-foreground">{description}</p>}
                    </>
                )}
            </CardContent>
        </Card>
    )
}

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([])
    const [isLoading, setIsLoading] = useState({ coupons: true, users: true, userCoupons: false })
    const [isDialogOpen, setIsDialogOpen] = useState(false)
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
            setCoupons(data.content || [])
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
        if (!userId) {
            setUserCoupons([]);
            setSelectedUser(null);
            return;
        }
        setIsLoading(prev => ({ ...prev, userCoupons: true }));
        try {
            const data: UserCoupon[] = await adminCouponApi.getUserCoupons(userId);
            setUserCoupons(data || []);
            setSelectedUser(users.find(u => u.id === userId) || null);
        } catch (error) {
            setUserCoupons([]);
            toast({ title: "오류", description: "회원의 쿠폰 목록을 불러오는 데 실패했습니다.", variant: "destructive" });
        } finally {
            setIsLoading(prev => ({ ...prev, userCoupons: false }));
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
            setGrantData({ userId: "", couponId: 0 }) // 폼 초기화
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

    const activeCoupons = coupons.filter(c => c.status === 'ACTIVE');

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-navy-900">쿠폰 관리</h1>
                    <p className="text-gray-600">쿠폰을 발급하고 회원에게 지급/회수합니다.</p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)}><PlusCircle className="w-4 h-4 mr-2" />새 쿠폰 발급</Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="총 쿠폰 종류" value={coupons.length} icon={Ticket} description={`활성: ${activeCoupons.length}개`} isLoading={isLoading.coupons} />
                <StatCard title="총 회원 수" value={users.length} icon={Users} description="쿠폰 지급 대상" isLoading={isLoading.users} />
            </div>

            <Tabs defaultValue="list">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="list"><Ticket className="w-4 h-4 mr-2" />쿠폰 목록</TabsTrigger>
                    <TabsTrigger value="grant"><UserPlus className="w-4 h-4 mr-2" />회원 쿠폰 관리</TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="mt-6">
                    <Card>
                        <CardHeader><CardTitle>전체 쿠폰 목록</CardTitle><CardDescription>발급된 모든 쿠폰 템플릿입니다.</CardDescription></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>설명</TableHead><TableHead>코드</TableHead><TableHead>타입</TableHead><TableHead>할인</TableHead><TableHead>상태</TableHead><TableHead>만료일</TableHead><TableHead>작업</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {isLoading.coupons ? Array.from({ length: 5 }).map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                                <TableCell><Skeleton className="h-8 w-16" /></TableCell>
                                            </TableRow>
                                        )) :
                                        coupons.map(coupon => (
                                            <TableRow key={coupon.id}>
                                                <TableCell className="font-mono text-xs">{coupon.id}</TableCell>
                                                <TableCell className="font-medium">{coupon.description}</TableCell>
                                                <TableCell className="font-mono text-gray-500">{coupon.code}</TableCell>
                                                <TableCell className="text-center">{coupon.discountType === 'FIXED_AMOUNT' ? <Wallet className="w-4 h-4 text-green-600" /> : <Percent className="w-4 h-4 text-blue-600" />}</TableCell>
                                                <TableCell>{coupon.discountType === 'FIXED_AMOUNT' ? `${coupon.discountAmount?.toLocaleString()}원` : `${coupon.discountRate}%`}</TableCell>
                                                <TableCell><Badge variant={coupon.status === 'ACTIVE' ? 'default' : 'destructive'} className={coupon.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>{coupon.status === 'ACTIVE' ? '활성' : '비활성'}</Badge></TableCell>
                                                <TableCell>{coupon.expiryDate}</TableCell>
                                                <TableCell><Button variant="destructive" size="sm" onClick={() => handleRevokeCoupon(coupon.id)} disabled={coupon.status !== 'ACTIVE'}>비활성화</Button></TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="grant" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>회원 쿠폰 관리</CardTitle>
                            <CardDescription>회원을 검색하여 보유 쿠폰을 확인하거나, 새로운 쿠폰을 지급합니다.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1 space-y-6">
                                <div className="space-y-2">
                                    <Label className="font-semibold">회원 검색</Label>
                                    <Select onValueChange={handleSearchUserCoupons}>
                                        <SelectTrigger><SelectValue placeholder="회원 검색..." /></SelectTrigger>
                                        <SelectContent>{users.map(user => <SelectItem key={user.id} value={user.id}>{user.name} ({user.email})</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <Separator />
                                <div className="space-y-4">
                                    <Label className="font-semibold">쿠폰 지급</Label>
                                    <div className="space-y-2"><Label className="text-sm text-gray-600">대상 회원</Label><Input value={selectedUser ? `${selectedUser.name} (${selectedUser.email})` : "회원을 선택하세요"} disabled /></div>
                                    <div className="space-y-2"><Label className="text-sm text-gray-600">지급할 쿠폰</Label><Select onValueChange={value => setGrantData({ userId: selectedUser?.id || "", couponId: Number(value) })}><SelectTrigger><SelectValue placeholder="쿠폰 선택..." /></SelectTrigger><SelectContent>{activeCoupons.map(coupon => <SelectItem key={coupon.id} value={String(coupon.id)}>{coupon.description}</SelectItem>)}</SelectContent></Select></div>
                                    <Button className="w-full bg-navy-600 hover:bg-navy-700" onClick={handleGrantCoupon} disabled={!selectedUser}>선택한 회원에게 쿠폰 지급</Button>
                                </div>
                            </div>
                            <div className="lg:col-span-2">
                                {selectedUser ? (
                                    <div>
                                        <h3 className="font-semibold mb-4 text-navy-900">{selectedUser.name}님의 보유 쿠폰 ({userCoupons.length}개)</h3>
                                        <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2">
                                            {isLoading.userCoupons
                                                ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
                                                : userCoupons.length > 0
                                                    ? userCoupons.map(uc => {
                                                        const c = uc.coupon; // convenience 변수
                                                        return (
                                                            <div key={uc.userCouponId} className="flex rounded-lg bg-white shadow-sm border overflow-hidden">
                                                                <div className={`p-4 border-r-2 border-dashed border-gray-300 flex flex-col justify-center items-center w-24 ${uc.isUsed ? 'bg-gray-100' : 'bg-teal-50'}`}>
                                                                    {c.discountType === 'FIXED_AMOUNT'
                                                                        ? <Wallet className={`w-6 h-6 ${uc.isUsed ? 'text-gray-400' : 'text-teal-600'}`} />
                                                                        : <Percent className={`w-6 h-6 ${uc.isUsed ? 'text-gray-400' : 'text-teal-600'}`} />}
                                                                    <p className={`font-bold text-lg mt-1 ${uc.isUsed ? 'text-gray-500' : 'text-teal-700'}`}>
                                                                        {c.discountType === 'FIXED_AMOUNT' ? `${((c.discountAmount ?? 0) / 10000).toFixed(1)}만원` : `${c.discountRate}%`}
                                                                    </p>
                                                                </div>
                                                                <div className={`p-4 flex-grow ${uc.isUsed ? 'opacity-50' : ''}`}>
                                                                    <p className="font-semibold text-navy-900">{c.description}</p>
                                                                    <p className="text-xs text-gray-500 mt-1">만료일: {c.expiryDate}</p>
                                                                </div>
                                                                <div className="p-4 flex flex-col items-center justify-center gap-2">
                                                                    <Badge variant={uc.isUsed ? "secondary" : "default"} className={uc.isUsed ? '' : 'bg-teal-600'}>
                                                                        {uc.isUsed ? '사용완료' : '미사용'}
                                                                    </Badge>
                                                                    {!uc.isUsed && (
                                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:bg-red-100" onClick={() => handleRevokeUserCoupon(uc.userCouponId)}>
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                    : (
                                                        <div className="text-center py-12 text-gray-500">
                                                            <Gift className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                                                            <p>보유한 쿠폰이 없습니다.</p>
                                                        </div>
                                                    )
                                            }
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500 h-full flex flex-col justify-center items-center bg-gray-50 rounded-lg">
                                        <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                                        <p>회원을 먼저 검색해주세요.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>새 쿠폰 발급</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2"><Label>쿠폰 설명</Label><Input value={newCoupon.description} onChange={e => setNewCoupon({ ...newCoupon, description: e.target.value })} placeholder="예: 신규 가입 10% 할인 쿠폰" /></div>
                        <div className="space-y-2"><Label>만료일</Label><Input type="date" value={newCoupon.expiryDate} onChange={e => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })} /></div>
                        <div className="space-y-2"><Label>할인 타입</Label><Select value={newCoupon.discountType} onValueChange={(value: "FIXED_AMOUNT" | "PERCENTAGE") => setNewCoupon({ ...newCoupon, discountType: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="FIXED_AMOUNT">정액</SelectItem><SelectItem value="PERCENTAGE">정률</SelectItem></SelectContent></Select></div>
                        {newCoupon.discountType === 'FIXED_AMOUNT' && <div className="space-y-2"><Label>할인 금액 (원)</Label><Input type="number" onChange={e => setNewCoupon({ ...newCoupon, discountAmount: Number(e.target.value) })} placeholder="10000" /></div>}
                        {newCoupon.discountType === 'PERCENTAGE' && (
                            <>
                                <div className="space-y-2"><Label>할인율 (%)</Label><Input type="number" onChange={e => setNewCoupon({ ...newCoupon, discountRate: Number(e.target.value) })} placeholder="10" /></div>
                                <div className="space-y-2"><Label>최대 할인 금액 (원)</Label><Input type="number" onChange={e => setNewCoupon({ ...newCoupon, maxDiscountAmount: Number(e.target.value) })} placeholder="50000" /></div>
                            </>
                        )}
                    </div>
                    <DialogFooter><Button onClick={handleCreateCoupon}>발급하기</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}