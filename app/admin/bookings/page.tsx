"use client"

import React, { useEffect, useState, useMemo } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Clock, CreditCard, Check, X, MoreHorizontal, Download, MessageSquare, AlertCircle, CheckCircle } from "lucide-react"
import { adminBookingApi, Booking, BookingSearchParams, adminQuotationApi } from "../../../lib/admin"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {Label} from "recharts";

// --- Constants & Type Definitions ---
const BOOKING_STATUSES = [
    { ui: "견적요청", api: "QUOTE_REQUESTED", color: "bg-blue-100 text-blue-800 border-blue-200", icon: MessageSquare },
    { ui: "결제대기", api: "PAYMENT_PENDING", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
    { ui: "결제완료", api: "PAYMENT_COMPLETED", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
    { ui: "취소요청", api: "CANCEL_PENDING", color: "bg-orange-100 text-orange-800 border-orange-200", icon: AlertCircle },
    { ui: "취소완료", api: "CANCELLED", color: "bg-red-100 text-red-800 border-red-200", icon: X },
    { ui: "여행완료", api: "TRAVEL_COMPLETED", color: "bg-gray-100 text-gray-800 border-gray-200", icon: CheckCircle },
] as const

type BookingApiStatus = typeof BOOKING_STATUSES[number]["api"]
type BookingUiStatus = typeof BOOKING_STATUSES[number]["ui"]

type BookingStatusConfig = {
    ui: string
    api?: BookingApiStatus
    color: string
    icon?: React.FC<any>
}

type BookingDetailDialogProps = {
    booking: Booking | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onRefresh: () => void
}

const uiToApiStatus = Object.fromEntries(BOOKING_STATUSES.map(s => [s.ui, s.api])) as Record<BookingUiStatus, BookingApiStatus>

// --- Helper Components ---
const BookingStatusBadge = ({ status }: { status: BookingApiStatus }) => {
    const config = BOOKING_STATUSES.find(s => s.api === status) || { ui: status, color: "bg-gray-100 text-gray-800" };
    return <Badge variant="outline" className={`font-medium ${config.color}`}>{config.ui}</Badge>
}

const BookingDetailDialog: React.FC<BookingDetailDialogProps> = ({ booking, isOpen, onOpenChange, onRefresh }) => {
    if (!booking) return null

    const handleApprove = async () => {
        await adminBookingApi.approve(booking.bookingId)
        onRefresh()
        onOpenChange(false)
    }

    const handleCancelApprove = async () => {
        await adminBookingApi.confirmCancellation(booking.bookingId)
        onRefresh()
        onOpenChange(false)
    }

    const handleDownloadPdf = async () => {
        const blob = await adminQuotationApi.downloadQuotationPdf(booking.bookingId)
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `quotation_${booking.bookingId}.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
    }

    const handleSendEmail = async () => {
        try {
            await adminQuotationApi.sendQuotationEmail(booking.bookingId)
            alert("견적서가 이메일로 발송되었습니다.")
        } catch (error) {
            alert("이메일 발송에 실패했습니다.")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>예약 상세 정보 #{booking.bookingId}</DialogTitle>
                    <DialogDescription>{booking.customerName}님의 예약 상세 내역입니다.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
                    <Card><CardContent className="p-4 grid grid-cols-2 gap-4">
                        <div><Label>상품명</Label><p>{booking.productName}</p></div>
                        <div><Label>여행일</Label><p>{booking.travelDate}</p></div>
                        <div><Label>인원</Label><p>{booking.counts}명</p></div>
                        <div><Label>예약일</Label><p>{new Date(booking.createdAt).toLocaleString()}</p></div>
                    </CardContent></Card>
                    <Card><CardContent className="p-4 space-y-2">
                        <div className="flex justify-between"><span>상품가</span><span>{booking.originalPrice.toLocaleString()}원</span></div>
                        <div className="flex justify-between text-red-600"><span>할인액</span><span>- {booking.discountedAmount.toLocaleString()}원</span></div>
                        <Separator/>
                        <div className="flex justify-between font-bold text-lg"><span>최종 금액</span><span>{booking.totalPrice.toLocaleString()}원</span></div>
                    </CardContent></Card>
                    {booking.specialRequests && <Card><CardContent className="p-4">
                        <Label>특별 요청사항</Label>
                        <p className="mt-1 text-sm bg-gray-50 p-3 rounded-md">{booking.specialRequests}</p>
                    </CardContent></Card>}
                    {booking.memoForAdmin && <Card><CardContent className="p-4">
                        <Label>관리자 메모</Label>
                        <p className="mt-1 text-sm bg-yellow-50 p-3 rounded-md">{booking.memoForAdmin}</p>
                    </CardContent></Card>}
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex gap-2">
                        {booking.status === "QUOTE_REQUESTED" && <Button onClick={handleApprove} className="bg-blue-600 hover:bg-blue-700">견적 승인</Button>}
                        {booking.status === "CANCEL_PENDING" && <Button onClick={handleCancelApprove} className="bg-orange-600 hover:bg-orange-700">취소 승인</Button>}
                        <Button onClick={handleDownloadPdf} variant="outline">견적서 PDF</Button>
                        <Button onClick={handleSendEmail} variant="outline">이메일 발송</Button>
                    </div>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>닫기</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// --- Main Page Component ---
export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState<BookingUiStatus>("견적요청")
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<Record<BookingApiStatus, number>>({} as any)
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)

    const fetchBookings = async (status: BookingUiStatus, query: string = "") => {
        setLoading(true)
        try {
            const params: BookingSearchParams = { status: uiToApiStatus[status], page: 0, size: 50 }
            if (query.trim()) params.query = query.trim()
            const res = await adminBookingApi.search(params)
            setBookings(res.content)
        } finally {
            setLoading(false)
        }
    }

    const fetchAllBookingStats = async () => {
        const allStatuses = BOOKING_STATUSES.map(s => s.api)
        const counts = await Promise.all(
            allStatuses.map(status => adminBookingApi.search({ status, size: 0 }).then(res => ({ [status]: res.totalElements })))
        )
        setStats(Object.assign({}, ...counts))
    }

    useEffect(() => {
        fetchBookings(activeTab, searchTerm)
    }, [activeTab, searchTerm])

    useEffect(() => {
        fetchAllBookingStats()
    }, [])

    const handleViewDetail = (booking: Booking) => {
        setSelectedBooking(booking)
        setIsDetailOpen(true)
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-navy-900">예약 관리</h1>
                    <p className="text-gray-600">예약 상태별로 관리하고 처리하세요.</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as BookingUiStatus)} className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                    {BOOKING_STATUSES.map((status) => (
                        <TabsTrigger key={status.ui} value={status.ui} className="flex items-center gap-2">
                            <status.icon className="w-4 h-4" />
                            {status.ui}
                            <Badge variant="secondary">{stats[status.api] ?? 0}</Badge>
                        </TabsTrigger>
                    ))}
                </TabsList>

                <Card className="mt-6">
                    <CardHeader>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="예약번호, 고객명, 상품명으로 검색..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>고객</TableHead>
                                    <TableHead className="hidden md:table-cell">상품</TableHead>
                                    <TableHead className="hidden sm:table-cell">여행일</TableHead>
                                    <TableHead className="hidden lg:table-cell">금액</TableHead>
                                    <TableHead>상태</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({length: 5}).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-5 w-24"/></TableCell>
                                            <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-40"/></TableCell>
                                            <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-28"/></TableCell>
                                            <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-20"/></TableCell>
                                            <TableCell><Skeleton className="h-6 w-24"/></TableCell>
                                            <TableCell><Skeleton className="h-8 w-8 rounded-md"/></TableCell>
                                        </TableRow>
                                    ))
                                ) : bookings.length > 0 ? (
                                    bookings.map((booking) => (
                                        <TableRow key={booking.bookingId}>
                                            <TableCell className="font-medium text-navy-900">{booking.customerName}</TableCell>
                                            <TableCell className="hidden md:table-cell">{booking.productName}</TableCell>
                                            <TableCell className="hidden sm:table-cell">{booking.travelDate}</TableCell>
                                            <TableCell className="hidden lg:table-cell">{booking.totalPrice.toLocaleString()}원</TableCell>
                                            <TableCell><BookingStatusBadge status={booking.status} /></TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4"/><span className="sr-only">Toggle menu</span></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleViewDetail(booking)}>상세보기</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow><TableCell colSpan={6} className="h-24 text-center">해당 상태의 예약이 없습니다.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Tabs>

            <BookingDetailDialog
                booking={selectedBooking}
                isOpen={isDetailOpen}
                onOpenChange={setIsDetailOpen}
                onRefresh={() => {
                    fetchBookings(activeTab, searchTerm);
                    fetchAllBookingStats();
                }}
            />
        </div>
    )
}