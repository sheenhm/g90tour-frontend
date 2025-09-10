"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Clock, CreditCard, Check, X, Eye, User, MapPin } from "lucide-react"
import { adminBookingApi, Booking } from "@/lib/admin"

// UI → API 상태 매핑
const uiToApiStatus: Record<string, Booking["status"]> = {
    "견적요청": "QUOTE_REQUESTED",
    "결제대기": "PAYMENT_PENDING",
    "결제완료": "PAYMENT_COMPLETED",
    "취소요청": "CANCEL_PENDING",
    "취소완료": "CANCELLED",
}

// API → UI 한글 표시
const apiToUiStatus: Record<Booking["status"], string> = {
    "QUOTE_REQUESTED": "견적요청",
    "PAYMENT_PENDING": "결제대기",
    "PAYMENT_COMPLETED": "결제완료",
    "CANCEL_PENDING": "취소요청",
    "CANCELLED": "취소완료",
    "TRAVEL_COMPLETED": "여행완료",
}

// 상태별 색상/아이콘
const statusMap: Record<Booking["status"], { color: string; icon: any }> = {
    "QUOTE_REQUESTED": { color: "bg-blue-600", icon: Clock },
    "PAYMENT_PENDING": { color: "bg-yellow-600", icon: CreditCard },
    "PAYMENT_COMPLETED": { color: "bg-green-600", icon: Check },
    "CANCEL_PENDING": { color: "bg-orange-600", icon: X },
    "CANCELLED": { color: "bg-gray-600", icon: X },
    "TRAVEL_COMPLETED": { color: "bg-purple-600", icon: Check },
}

const BookingCard = ({ booking }: { booking: Booking }) => {
    const { color: statusColor, icon: StatusIcon } = statusMap[booking.status] || { color: "bg-gray-600", icon: Clock }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{booking.id} - {booking.customerName}</CardTitle>
                        <CardDescription>{booking.productName}</CardDescription>
                    </div>
                    <Badge className={statusColor}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {apiToUiStatus[booking.status]}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <p>여행일: {booking.travelDate}</p>
                <p>인원: {booking.travelers}명</p>
                <p>금액: {booking.totalPrice.toLocaleString()}원</p>

                {booking.status === "QUOTE_REQUESTED" && (
                    <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => adminBookingApi.approve(booking.id)}
                    >
                        승인
                    </Button>
                )}
                {booking.status === "CANCEL_PENDING" && (
                    <Button
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={() => adminBookingApi.confirmCancellation(booking.id)}
                    >
                        취소 승인
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [searchTerm, setSearchTerm] = useState("")

    const fetchBookings = async () => {
        const data = await adminBookingApi.getRecent(0, 50)
        setBookings(data)
    }

    useEffect(() => {
        fetchBookings()
    }, [])

    const filteredBookings = (uiStatus: string) => {
        const apiStatus = uiToApiStatus[uiStatus]
        return bookings
            .filter(b => b.status === apiStatus)
            .filter(
                b =>
                    b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    b.productName.toLowerCase().includes(searchTerm.toLowerCase())
            )
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-navy-900">예약 관리</h1>
                <p className="text-gray-600">예약 상태별로 관리하고 처리하세요</p>
            </div>

            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="예약번호, 고객명, 상품명으로 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="견적요청" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    {Object.keys(uiToApiStatus).map((uiStatus) => (
                        <TabsTrigger key={uiStatus} value={uiStatus} className="flex items-center gap-2">
                            {uiStatus === "견적요청" && <Clock className="w-4 h-4" />}
                            {uiStatus === "결제대기" && <CreditCard className="w-4 h-4" />}
                            {uiStatus === "결제완료" && <Check className="w-4 h-4" />}
                            {uiStatus === "취소요청" && <X className="w-4 h-4" />}
                            {uiStatus === "취소완료" && <X className="w-4 h-4" />}
                            {uiStatus} ({filteredBookings(uiStatus).length})
                        </TabsTrigger>
                    ))}
                </TabsList>

                {Object.keys(uiToApiStatus).map((uiStatus) => (
                    <TabsContent key={uiStatus} value={uiStatus} className="mt-6">
                        <div className="space-y-4">
                            {filteredBookings(uiStatus).map((booking) => (
                                <BookingCard key={booking.id} booking={booking} />
                            ))}
                            {filteredBookings(uiStatus).length === 0 && (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <p className="text-gray-500">{uiStatus} 상태의 예약이 없습니다.</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}