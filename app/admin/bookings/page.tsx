"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Clock, CreditCard, Check, X } from "lucide-react"
import { adminBookingApi, Booking, BookingSearchParams } from "@/lib/admin"
import { BookingCard } from "@/app/admin/bookings/BookingCard"
import { Skeleton } from "@/components/ui/skeleton"

// --- 상태 정의 ---
const BOOKING_STATUSES = [
    { ui: "견적요청", api: "QUOTE_REQUESTED", color: "bg-blue-600", icon: Clock },
    { ui: "결제대기", api: "PAYMENT_PENDING", color: "bg-yellow-600", icon: CreditCard },
    { ui: "결제완료", api: "PAYMENT_COMPLETED", color: "bg-green-600", icon: Check },
    { ui: "취소요청", api: "CANCEL_PENDING", color: "bg-orange-600", icon: X },
    { ui: "취소완료", api: "CANCELLED", color: "bg-gray-600", icon: X },
    { ui: "여행완료", api: "TRAVEL_COMPLETED", color: "bg-purple-600", icon: Check },
] as const

type BookingApiStatus = typeof BOOKING_STATUSES[number]["api"]
type BookingUiStatus = typeof BOOKING_STATUSES[number]["ui"]

const uiToApiStatus = Object.fromEntries(BOOKING_STATUSES.map(s => [s.ui, s.api])) as Record<BookingUiStatus, BookingApiStatus>
const apiToUiStatus = Object.fromEntries(BOOKING_STATUSES.map(s => [s.api, s.ui])) as Record<BookingApiStatus, BookingUiStatus>

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [activeStatus, setActiveStatus] = useState<BookingUiStatus>("견적요청")
    const [loading, setLoading] = useState(false)

    // --- 예약 데이터 가져오기 ---
    const fetchBookings = async (status: BookingUiStatus, query: string = "") => {
        setLoading(true)
        try {
            const params: BookingSearchParams = {
                status: uiToApiStatus[status],
                page: 0,
                size: 50,
            }
            if (query.trim()) (params as any).query = query.trim()
            const res = await adminBookingApi.search(params)
            setBookings(res.content)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBookings(activeStatus, searchTerm)
    }, [activeStatus, searchTerm])

    // --- 상태별 개수 계산 ---
    const countByStatus = (statusApi: BookingApiStatus) =>
        bookings.filter(b => b.status === statusApi).length

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-navy-900">예약 관리</h1>
                <p className="text-gray-600">예약 상태별로 관리하고 처리하세요</p>
            </div>

            {/* 검색 */}
            <Card className="mb-6">
                <CardContent className="p-6 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="예약번호, 고객명, 상품명으로 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </CardContent>
            </Card>

            {/* 상태별 탭 */}
            <Tabs value={activeStatus} onValueChange={(v) => setActiveStatus(v as BookingUiStatus)} className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                    {BOOKING_STATUSES.map((status) => (
                        <TabsTrigger key={status.ui} value={status.ui} className="flex items-center gap-2">
                            <status.icon className="w-4 h-4" />
                            {status.ui} ({countByStatus(status.api)})
                        </TabsTrigger>
                    ))}
                </TabsList>

                {BOOKING_STATUSES.map((status) => (
                    <TabsContent key={status.ui} value={status.ui} className="mt-6">
                        {loading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Skeleton key={i} className="h-32 w-full rounded-lg" />
                                ))}
                            </div>
                        ) : bookings.length > 0 ? (
                            <div className="space-y-4">
                                {bookings
                                    .filter(b => b.status === uiToApiStatus[status.ui])
                                    .map((booking) => (
                                        <BookingCard
                                            key={booking.bookingId}
                                            booking={booking}
                                            onRefresh={() => fetchBookings(activeStatus, searchTerm)}
                                        />
                                    ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <p className="text-gray-500">{status.ui} 상태의 예약이 없습니다.</p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}