"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Download, Mail, Phone, Calendar, Users, Ticket, Home, UserCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { bookingApi, BookingResponse } from "@/lib/api"
import Image from "next/image";

function BookingSuccessComponent() {
    const searchParams = useSearchParams()
    const bookingId = searchParams.get("bookingId")
    const [bookingDetails, setBookingDetails] = useState<BookingResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (bookingId) {
            // Let's assume a function `getBookingDetails` exists in your API library
            // You might need to add this: `getBookingDetails: (id: string) => apiClient.get<BookingResponse>(`/api/v1/bookings/${id}`)`
            // For now, we'll simulate the fetch.
            bookingApi.getPaymentPage(bookingId) // Using getPaymentPage as a stand-in
                .then((data) => {
                    // @ts-ignore
                    setBookingDetails({ ...data, id: data.bookingId, totalPrice: data.finalPrice, createdAt: new Date().toISOString() })
                })
                .catch(err => console.error("Failed to fetch booking details", err))
                .finally(() => setIsLoading(false))
        } else {
            setIsLoading(false)
        }
    }, [bookingId])

    const handleDownloadConfirmation = () => {
        alert("확인서 PDF 다운로드 기능이 구현될 예정입니다.")
    }

    const handleSendEmail = () => {
        alert("이메일 재발송 기능이 구현될 예정입니다.")
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-navy-600"/>
            </div>
        )
    }

    if (!bookingDetails) {
        return (
            <div className="flex h-screen items-center justify-center text-center">
                <Card className="p-8">
                    <CardTitle>예약 정보를 불러올 수 없습니다.</CardTitle>
                    <CardDescription className="mt-2">올바른 예약 번호인지 확인해주세요.</CardDescription>
                    <Button asChild className="mt-4"><Link href="/">홈으로</Link></Button>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <section className="bg-gradient-to-br from-teal-600 to-navy-800 text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold mb-2">결제가 완료되었습니다!</h1>
                    <p className="text-lg text-gray-200">예약이 성공적으로 확정되었습니다. 즐거운 여행 되세요!</p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Booking Confirmation Ticket */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-lg">
                            <CardHeader className="bg-gray-50 rounded-t-lg border-b">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="text-navy-900 flex items-center gap-2">
                                            <Ticket className="w-6 h-6 text-teal-600"/>
                                            예약 확정서
                                        </CardTitle>
                                        <CardDescription>예약번호: {bookingDetails.bookingId}</CardDescription>
                                    </div>
                                    <Image src="/logo.png" alt="Logo" width={80} height={40}/>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div>
                                    <h3 className="font-semibold text-navy-800 mb-3 border-b pb-2">예약자 정보</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div><span className="font-semibold">이름:</span> {bookingDetails.customerName}</div>
                                    </div>
                                </div>

                                <Separator/>

                                <div>
                                    <h3 className="font-semibold text-navy-800 mb-3 border-b pb-2">여행 정보</h3>
                                    <div className="space-y-3">
                                        <p className="text-lg font-bold text-teal-700">{bookingDetails.productName}</p>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-500" /><span>여행일: {bookingDetails.travelDate}</span></div>
                                            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-500" /><span>인원: {bookingDetails.counts}명</span></div>
                                        </div>
                                        {bookingDetails.specialRequests && (
                                            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                                                <strong>특별 요청:</strong> {bookingDetails.specialRequests}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Separator/>

                                <div>
                                    <h3 className="font-semibold text-navy-800 mb-3 border-b pb-2">결제 정보</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                        <div className="flex justify-between text-sm"><span className="text-gray-600">예약일:</span><span>{new Date(bookingDetails.createdAt).toLocaleDateString()}</span></div>
                                        <Separator/>
                                        <div className="flex justify-between items-center font-bold text-lg">
                                            <span>총 결제 금액:</span>
                                            <span className="text-navy-900 text-2xl">{bookingDetails.totalPrice.toLocaleString()}원</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Actions */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-28 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-navy-900">다음 단계</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button className="w-full bg-navy-600 hover:bg-navy-700" onClick={handleDownloadConfirmation}>
                                    <Download className="w-4 h-4 mr-2" />
                                    확인서 다운로드
                                </Button>
                                <Button variant="outline" className="w-full bg-transparent" onClick={handleSendEmail}>
                                    <Mail className="w-4 h-4 mr-2" />
                                    이메일로 재발송
                                </Button>
                                <Separator className="my-2"/>
                                <Button asChild variant="outline" className="w-full bg-transparent">
                                    <Link href="/mypage"><UserCircle className="w-4 h-4 mr-2"/> 마이페이지</Link>
                                </Button>
                                <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
                                    <Link href="/"><Home className="w-4 h-4 mr-2"/> 홈으로 돌아가기</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function BookingSuccessPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-navy-600"/>
            </div>
        }>
            <BookingSuccessComponent />
        </Suspense>
    )
}