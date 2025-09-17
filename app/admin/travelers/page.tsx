"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { adminBookingApi, adminProductApi, adminTravelerApi, Booking, ManualBookingRequest } from "@/lib/admin"
import { Product } from "@/lib/product"
import { TravelerRequest, TravelerResponse } from "@/lib/api"
import { PlusCircle, Send, UserCheck, Loader2, Trash2, UserPlus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const initialTravelerState: TravelerRequest = {
    name: "", nameEngFirst: "", nameEngLast: "", gender: "MALE",
    birth: "", phone: "", passportNumber: "", passportUrl: ""
};

export default function AdminTravelersPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState({ bookings: true, products: true, form: false, travelers: false })
    const [newBooking, setNewBooking] = useState<Partial<ManualBookingRequest>>({})

    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
    const [travelers, setTravelers] = useState<TravelerResponse[]>([])

    const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
    const [requestPhone, setRequestPhone] = useState("")

    const [isAddTravelerOpen, setIsAddTravelerOpen] = useState(false)
    const [newTraveler, setNewTraveler] = useState<TravelerRequest>(initialTravelerState)

    const fetchInitialData = async () => {
        setIsLoading(p => ({ ...p, bookings: true, products: true }));
        try {
            const [bookingRes, productRes] = await Promise.all([
                adminBookingApi.search({ size: 100 }),
                adminProductApi.search({ size: 100 }),
            ])
            setBookings(bookingRes.content.sort((a,b) => b.bookingId.localeCompare(a.bookingId)))
            setProducts(productRes.content)
        } catch (error) {
            toast({ title: "오류", description: "데이터 로딩에 실패했습니다.", variant: "destructive" })
        } finally {
            setIsLoading(p => ({ ...p, bookings: false, products: false }));
        }
    }

    useEffect(() => {
        fetchInitialData()
    }, [])

    const handleSelectBooking = async (booking: Booking) => {
        setSelectedBooking(booking);
        setIsLoading(p => ({ ...p, travelers: true }));
        try {
            const travelerData = await adminTravelerApi.getTravelers(booking.bookingId);
            setTravelers(travelerData);
        } catch (error) {
            toast({ title: "오류", description: "여행자 정보 로딩에 실패했습니다.", variant: "destructive" });
            setTravelers([]);
        } finally {
            setIsLoading(p => ({ ...p, travelers: false }));
        }
    }

    const handleCreateBooking = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newBooking.productId || !newBooking.customerName || !newBooking.customerPhone || !newBooking.travelDate || !newBooking.counts) {
            toast({ title: "오류", description: "모든 필드를 입력해주세요.", variant: "destructive" })
            return
        }
        setIsLoading(p => ({ ...p, form: true }))
        try {
            await adminBookingApi.createManualBooking(newBooking as ManualBookingRequest)
            toast({ title: "성공", description: "새로운 예약이 생성되었습니다." })
            setNewBooking({})
            await fetchInitialData()
        } catch (error) {
            toast({ title: "오류", description: "예약 생성에 실패했습니다.", variant: "destructive" })
        } finally {
            setIsLoading(p => ({ ...p, form: false }))
        }
    }

    const handleRequestInfo = async () => {
        if (!selectedBooking || !requestPhone) {
            toast({ title: "오류", description: "예약과 연락처를 확인해주세요.", variant: "destructive" })
            return
        }
        try {
            // await adminBookingApi.requestTravelerInfo(selectedBooking.bookingId, requestPhone);
            alert(`[알림] ${requestPhone} 번호로 여행자 정보 입력 요청 알림톡이 발송되었습니다. (테스트 메시지)`)
            toast({ title: "성공", description: "정보 입력 요청이 발송되었습니다." })
            setIsRequestDialogOpen(false)
            setRequestPhone("")
        } catch (error) {
            toast({ title: "오류", description: "요청 발송에 실패했습니다.", variant: "destructive" })
        }
    }

    const handleAddTraveler = async () => {
        if (!selectedBooking) return;
        setIsLoading(p => ({...p, form: true}));
        try {
            await adminTravelerApi.addTraveler(selectedBooking.bookingId, newTraveler);
            toast({title: "성공", description: "여행자가 추가되었습니다."});
            setIsAddTravelerOpen(false);
            setNewTraveler(initialTravelerState);
            await handleSelectBooking(selectedBooking); // Refresh traveler list
        } catch (error) {
            toast({title: "오류", description: "여행자 추가에 실패했습니다.", variant: "destructive"});
        } finally {
            setIsLoading(p => ({...p, form: false}));
        }
    }

    const handleRemoveTraveler = async (travelerId: string) => {
        if (!selectedBooking || !confirm("정말로 이 여행자를 삭제하시겠습니까?")) return;
        try {
            await adminTravelerApi.removeTraveler(selectedBooking.bookingId, travelerId);
            toast({title: "성공", description: "여행자가 삭제되었습니다."});
            await handleSelectBooking(selectedBooking); // Refresh traveler list
        } catch (error) {
            toast({title: "오류", description: "여행자 삭제에 실패했습니다.", variant: "destructive"});
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-navy-900">여행자 정보 관리</h1>
                <p className="text-gray-600">수동으로 예약을 생성하거나, 기존 예약의 여행자 정보 입력을 요청합니다.</p>
            </div>

            <Accordion type="single" collapsible>
                <AccordionItem value="create-booking">
                    <AccordionTrigger>
                        <div className="flex items-center gap-2">
                            <PlusCircle className="w-5 h-5" />
                            <span className="font-semibold text-lg">신규 예약 생성</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <Card className="border-0 shadow-none">
                            <CardContent className="pt-4">
                                <form onSubmit={handleCreateBooking} className="space-y-4">
                                    {/* Form fields... */}
                                    <div><Label htmlFor="product">상품 선택</Label><Select onValueChange={(value) => setNewBooking(p => ({...p, productId: value}))}><SelectTrigger><SelectValue placeholder="상품을 선택하세요" /></SelectTrigger><SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select></div>
                                    <div><Label htmlFor="customerName">고객명</Label><Input id="customerName" onChange={e => setNewBooking(p => ({...p, customerName: e.target.value}))} /></div>
                                    <div><Label htmlFor="customerPhone">연락처</Label><Input id="customerPhone" onChange={e => setNewBooking(p => ({...p, customerPhone: e.target.value}))} /></div>
                                    <div><Label htmlFor="travelDate">여행일</Label><Input id="travelDate" type="date" onChange={e => setNewBooking(p => ({...p, travelDate: e.target.value}))} /></div>
                                    <div><Label htmlFor="counts">인원</Label><Input id="counts" type="number" onChange={e => setNewBooking(p => ({...p, counts: +e.target.value}))} /></div>
                                    <Button type="submit" className="w-full" disabled={isLoading.form}>{isLoading.form ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <PlusCircle className="mr-2 h-4 w-4" />} {isLoading.form ? "생성 중..." : "예약 생성"}</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Card>
                <CardHeader>
                    <CardTitle>예약 목록</CardTitle>
                    <CardDescription>여행자 정보를 관리할 예약을 선택하세요.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="max-h-[40vh] overflow-y-auto">
                        <Table>
                            <TableHeader><TableRow><TableHead>예약번호</TableHead><TableHead>상품명</TableHead><TableHead>고객명</TableHead><TableHead>여행일</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {isLoading.bookings ? ( <TableRow><TableCell colSpan={4} className="text-center">로딩 중...</TableCell></TableRow> ) : (
                                    bookings.map(booking => (
                                        <TableRow key={booking.bookingId} onClick={() => handleSelectBooking(booking)} className={`cursor-pointer ${selectedBooking?.bookingId === booking.bookingId ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                                            <TableCell>{booking.bookingId}</TableCell>
                                            <TableCell>{booking.productName}</TableCell>
                                            <TableCell>{booking.customerName}</TableCell>
                                            <TableCell>{booking.travelDate}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {selectedBooking && (
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>여행자 목록</CardTitle>
                                <CardDescription>예약번호: {selectedBooking.bookingId}</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => { setRequestPhone(selectedBooking.memoForAdmin || ""); setIsRequestDialogOpen(true); }}><Send className="mr-2 h-4 w-4" />정보 입력 요청</Button>
                                <Button onClick={() => setIsAddTravelerOpen(true)}><UserPlus className="mr-2 h-4 w-4" />여행자 추가</Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>이름</TableHead><TableHead>영문명</TableHead><TableHead>연락처</TableHead><TableHead>여권번호</TableHead><TableHead>작업</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {isLoading.travelers ? (
                                    <TableRow><TableCell colSpan={5} className="text-center">여행자 정보 로딩 중...</TableCell></TableRow>
                                ) : travelers.length > 0 ? (
                                    travelers.map(t => (
                                        <TableRow key={t.id}>
                                            <TableCell>{t.name}</TableCell>
                                            <TableCell>{`${t.nameEngLast}, ${t.nameEngFirst}`}</TableCell>
                                            <TableCell>{t.phone}</TableCell>
                                            <TableCell>{t.passportNumber}</TableCell>
                                            <TableCell><Button variant="destructive" size="sm" onClick={() => handleRemoveTraveler(t.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow><TableCell colSpan={5} className="text-center h-24">등록된 여행자가 없습니다.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* Dialogs */}
            <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>여행자 정보 입력 요청</DialogTitle><DialogDescription>알림톡을 발송할 대표 연락처를 입력해주세요. <br/>입력된 번호로 여행자 정보 입력 페이지 링크가 전송됩니다.</DialogDescription></DialogHeader>
                    <div className="py-4"><Label htmlFor="requestPhone">대표 연락처</Label><Input id="requestPhone" value={requestPhone} onChange={e => setRequestPhone(e.target.value)} placeholder="010-1234-5678" /></div>
                    <DialogFooter><Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>취소</Button><Button onClick={handleRequestInfo}><Send className="mr-2 h-4 w-4" />발송</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isAddTravelerOpen} onOpenChange={setIsAddTravelerOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>새 여행자 추가</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">이름</Label><Input className="col-span-3" value={newTraveler.name} onChange={e => setNewTraveler(p => ({...p, name: e.target.value}))}/></div>
                        <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">영문(성)</Label><Input className="col-span-3" value={newTraveler.nameEngLast} onChange={e => setNewTraveler(p => ({...p, nameEngLast: e.target.value.toUpperCase()}))}/></div>
                        <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">영문(이름)</Label><Input className="col-span-3" value={newTraveler.nameEngFirst} onChange={e => setNewTraveler(p => ({...p, nameEngFirst: e.target.value.toUpperCase()}))}/></div>
                        <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">연락처</Label><Input className="col-span-3" value={newTraveler.phone} onChange={e => setNewTraveler(p => ({...p, phone: e.target.value}))}/></div>
                        <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">생년월일</Label><Input type="date" className="col-span-3" value={newTraveler.birth} onChange={e => setNewTraveler(p => ({...p, birth: e.target.value}))}/></div>
                        <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">여권번호</Label><Input className="col-span-3" value={newTraveler.passportNumber} onChange={e => setNewTraveler(p => ({...p, passportNumber: e.target.value}))}/></div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddTravelerOpen(false)}>취소</Button>
                        <Button onClick={handleAddTraveler} disabled={isLoading.form}>
                            {isLoading.form ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <UserPlus className="mr-2 h-4 w-4" />}
                            {isLoading.form ? "추가 중..." : "추가"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}