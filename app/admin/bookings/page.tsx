"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Eye, Check, X, Clock, CreditCard, User, MapPin, Phone, Mail } from "lucide-react"

const bookings = [
  {
    id: "B001",
    customerName: "김철수",
    email: "kim@example.com",
    phone: "010-1234-5678",
    productName: "제주 신라호텔 3박 4일",
    productCategory: "호텔",
    travelers: 2,
    travelDate: "2024-03-15",
    totalAmount: 598000,
    status: "견적요청",
    requestDate: "2024-02-15",
    specialRequests: "바다뷰 객실 요청",
    travelerDetails: [
      { name: "김철수", gender: "남", birth: "1985-05-15", passport: "M12345678" },
      { name: "김영희", gender: "여", birth: "1987-08-20", passport: "M87654321" },
    ],
  },
  {
    id: "B002",
    customerName: "이영희",
    email: "lee@example.com",
    phone: "010-2345-6789",
    productName: "태국 푸켓 골프 패키지",
    productCategory: "골프",
    travelers: 4,
    travelDate: "2024-03-20",
    totalAmount: 5196000,
    status: "결제대기",
    requestDate: "2024-02-10",
    approvedDate: "2024-02-12",
    specialRequests: "",
    travelerDetails: [
      { name: "이영희", gender: "여", birth: "1980-03-10", passport: "M11111111" },
      { name: "이철수", gender: "남", birth: "1978-12-05", passport: "M22222222" },
      { name: "이민수", gender: "남", birth: "2010-07-15", passport: "M33333333" },
      { name: "이수진", gender: "여", birth: "2012-09-20", passport: "M44444444" },
    ],
  },
]

const statusConfig = {
  견적요청: { color: "bg-blue-600", icon: Clock },
  결제대기: { color: "bg-yellow-600", icon: CreditCard },
  결제완료: { color: "bg-green-600", icon: Check },
  취소요청: { color: "bg-orange-600", icon: X },
  취소완료: { color: "bg-gray-600", icon: X },
}

export default function AdminBookingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [adminNote, setAdminNote] = useState("")

  const getBookingsByStatus = (status) => {
    return bookings.filter((booking) => booking.status === status)
  }

  const filteredBookings = (status) => {
    return getBookingsByStatus(status).filter(
      (booking) =>
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.productName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  const handleApproveQuote = (bookingId) => {
    console.log("Approving quote:", bookingId)
  }

  const handleRejectQuote = (bookingId) => {
    console.log("Rejecting quote:", bookingId)
  }

  const handleApproveCancellation = (bookingId) => {
    console.log("Approving cancellation:", bookingId)
  }

  const BookingDetailDialog = ({ booking }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
          <Eye className="w-4 h-4 mr-1" />
          상세보기
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>예약 상세 정보</DialogTitle>
          <DialogDescription>예약 ID: {booking.id}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  고객 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">이름:</span>
                  <span className="font-medium">{booking.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">이메일:</span>
                  <span className="font-medium">{booking.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">연락처:</span>
                  <span className="font-medium">{booking.phone}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  예약 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">상품:</span>
                  <span className="font-medium">{booking.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">여행일:</span>
                  <span className="font-medium">{booking.travelDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">인원:</span>
                  <span className="font-medium">{booking.travelers}명</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">금액:</span>
                  <span className="font-medium text-navy-900">{booking.totalAmount.toLocaleString()}원</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 여행자 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">여행자 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">이름</th>
                      <th className="text-left p-2">성별</th>
                      <th className="text-left p-2">생년월일</th>
                      <th className="text-left p-2">여권번호</th>
                    </tr>
                  </thead>
                  <tbody>
                    {booking.travelerDetails?.map((traveler, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{traveler.name}</td>
                        <td className="p-2">{traveler.gender}</td>
                        <td className="p-2">{traveler.birth}</td>
                        <td className="p-2 font-mono">{traveler.passport}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 특별 요청사항 */}
          {booking.specialRequests && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">특별 요청사항</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="bg-gray-50 p-3 rounded">{booking.specialRequests}</p>
              </CardContent>
            </Card>
          )}

          {/* 취소 사유 */}
          {booking.cancelReason && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">취소 사유</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="bg-red-50 p-3 rounded text-red-800">{booking.cancelReason}</p>
              </CardContent>
            </Card>
          )}

          {/* 관리자 메모 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">관리자 메모</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="관리자 메모를 입력하세요..."
                rows={3}
              />
              <Button className="mt-2 bg-navy-600 hover:bg-navy-700" size="sm">
                메모 저장
              </Button>
            </CardContent>
          </Card>

          {/* 연락 정보 */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">빠른 연락</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button size="sm" variant="outline" className="bg-white">
                <Phone className="w-4 h-4 mr-1" />
                전화걸기
              </Button>
              <Button size="sm" variant="outline" className="bg-white">
                <Mail className="w-4 h-4 mr-1" />
                이메일 발송
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )

  const BookingCard = ({ booking }) => {
    const StatusIcon = statusConfig[booking.status]?.icon || Clock
    const statusColor = statusConfig[booking.status]?.color || "bg-gray-600"

    return (
      <Card className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg text-navy-900">
                {booking.id} - {booking.customerName}
              </CardTitle>
              <CardDescription>{booking.productName}</CardDescription>
            </div>
            <Badge className={statusColor}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {booking.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">여행일</p>
              <p className="font-medium">{booking.travelDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">인원</p>
              <p className="font-medium">{booking.travelers}명</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">총 금액</p>
              <p className="font-medium text-navy-900">{booking.totalAmount.toLocaleString()}원</p>
            </div>
          </div>
          <div className="flex gap-2">
            <BookingDetailDialog booking={booking} />

            {booking.status === "견적요청" && (
              <>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleApproveQuote(booking.id)}
                >
                  <Check className="w-4 h-4 mr-1" />
                  승인
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700 bg-transparent"
                  onClick={() => handleRejectQuote(booking.id)}
                >
                  <X className="w-4 h-4 mr-1" />
                  거절
                </Button>
              </>
            )}

            {booking.status === "취소요청" && (
              <Button
                size="sm"
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => handleApproveCancellation(booking.id)}
              >
                <Check className="w-4 h-4 mr-1" />
                취소 승인
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900">예약 관리</h1>
        <p className="text-gray-600">예약 상태별로 관리하고 처리하세요</p>
      </div>

      {/* Search */}
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

      {/* Status Tabs */}
      <Tabs defaultValue="견적요청" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="견적요청" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            견적요청 ({getBookingsByStatus("견적요청").length})
          </TabsTrigger>
          <TabsTrigger value="결제대기" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            결제대기 ({getBookingsByStatus("결제대기").length})
          </TabsTrigger>
          <TabsTrigger value="결제완료" className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            결제완료 ({getBookingsByStatus("결제완료").length})
          </TabsTrigger>
          <TabsTrigger value="취소요청" className="flex items-center gap-2">
            <X className="w-4 h-4" />
            취소요청 ({getBookingsByStatus("취소요청").length})
          </TabsTrigger>
          <TabsTrigger value="취소완료" className="flex items-center gap-2">
            <X className="w-4 h-4" />
            취소완료 ({getBookingsByStatus("취소완료").length})
          </TabsTrigger>
        </TabsList>

        {["견적요청", "결제대기", "결제완료", "취소요청", "취소완료"].map((status) => (
          <TabsContent key={status} value={status} className="mt-6">
            <div className="space-y-4">
              {filteredBookings(status).map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
              {filteredBookings(status).length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-500">{status} 상태의 예약이 없습니다.</p>
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
