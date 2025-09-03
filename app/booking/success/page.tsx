"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Download, Mail, Phone, Calendar, Users } from "lucide-react"
import Link from "next/link"

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId") || "B001"

  const [bookingDetails] = useState({
    id: bookingId,
    customerName: "김철수",
    email: "kim@example.com",
    phone: "010-1234-5678",
    productName: "제주 신라호텔 3박 4일",
    productCategory: "호텔",
    travelers: 2,
    travelDate: "2024-03-15",
    totalAmount: 598000,
    paymentMethod: "신용카드",
    paymentDate: new Date().toISOString().split("T")[0],
    confirmationNumber: "G90-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    includes: ["항공료", "숙박", "조식", "공항픽업"],
    specialRequests: "바다뷰 객실 요청",
  })

  const handleDownloadConfirmation = () => {
    console.log("Downloading confirmation...")
    // 실제로는 PDF 다운로드 기능 구현
  }

  const handleSendEmail = () => {
    console.log("Sending confirmation email...")
    // 실제로는 이메일 발송 기능 구현
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-navy-900 mb-2">결제가 완료되었습니다!</h1>
          <p className="text-gray-600">예약이 성공적으로 접수되었습니다. 확인서를 확인해주세요.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Confirmation */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-navy-900">예약 확정서</CardTitle>
                <CardDescription>예약번호: {bookingDetails.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold text-navy-900 mb-3">예약자 정보</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">이름:</span>
                      <span>{bookingDetails.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">이메일:</span>
                      <span>{bookingDetails.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">연락처:</span>
                      <span>{bookingDetails.phone}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Travel Info */}
                <div>
                  <h3 className="font-semibold text-navy-900 mb-3">여행 정보</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-teal-600">{bookingDetails.productCategory}</Badge>
                      <span className="font-medium">{bookingDetails.productName}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-teal-600" />
                        <span>여행일: {bookingDetails.travelDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-teal-600" />
                        <span>인원: {bookingDetails.travelers}명</span>
                      </div>
                    </div>
                    {bookingDetails.specialRequests && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>특별 요청:</strong> {bookingDetails.specialRequests}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Includes */}
                <div>
                  <h3 className="font-semibold text-navy-900 mb-3">포함사항</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {bookingDetails.includes.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Payment Info */}
                <div>
                  <h3 className="font-semibold text-navy-900 mb-3">결제 정보</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">결제 방법:</span>
                      <span>{bookingDetails.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">결제일:</span>
                      <span>{bookingDetails.paymentDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">확인번호:</span>
                      <span className="font-mono text-sm">{bookingDetails.confirmationNumber}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>총 결제 금액:</span>
                      <span className="text-navy-900">{bookingDetails.totalAmount.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Notice */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-800">중요 안내사항</CardTitle>
              </CardHeader>
              <CardContent className="text-yellow-800">
                <ul className="space-y-2 text-sm">
                  <li>• 여행 출발 3일 전까지 최종 일정표를 이메일로 발송해드립니다.</li>
                  <li>• 여권 유효기간이 6개월 이상 남아있는지 확인해주세요.</li>
                  <li>• 취소 시 약관에 따라 취소 수수료가 발생할 수 있습니다.</li>
                  <li>• 문의사항은 고객센터(1588-0000)로 연락주세요.</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-navy-900">다음 단계</CardTitle>
                <CardDescription>예약 완료 후 필요한 작업들</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-navy-600 hover:bg-navy-700" onClick={handleDownloadConfirmation}>
                  <Download className="w-4 h-4 mr-2" />
                  확인서 다운로드
                </Button>

                <Button variant="outline" className="w-full bg-transparent" onClick={handleSendEmail}>
                  <Mail className="w-4 h-4 mr-2" />
                  이메일로 재발송
                </Button>

                <Separator />

                <div className="space-y-2">
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/mypage">마이페이지</Link>
                  </Button>

                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/support">고객센터</Link>
                  </Button>

                  <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
                    <Link href="/">홈으로 돌아가기</Link>
                  </Button>
                </div>

                <Separator />

                <div className="bg-navy-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-navy-900 mb-2">연락처</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-navy-600" />
                      <span>1588-0000</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-navy-600" />
                      <span>info@g90tour.com</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      평일 09:00-18:00
                      <br />
                      24시간 응급 연락 가능
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
