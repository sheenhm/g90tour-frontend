"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Users, Calendar, MapPin, Tag, CreditCard, Building, Smartphone, CheckCircle, Wallet } from "lucide-react"
import { bookingApi, PaymentPageResponse } from "@/lib/api"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const paymentMethods = [
    { id: "bank", name: "무통장입금", icon: Building },
    { id: "card", name: "신용카드", icon: CreditCard },
    { id: "kakao", name: "카카오페이", icon: Smartphone },
    { id: "naver", name: "네이버페이", icon: Smartphone },
]

export default function BookingPaymentPage() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [paymentData, setPaymentData] = useState<PaymentPageResponse | null>(null)
    const [paymentMethod, setPaymentMethod] = useState("")

    useEffect(() => {
        if (!id) return
        bookingApi
            .getPaymentPage(id)
            .then((res) => {
                setPaymentData(res)
            })
            .catch(() => {
                alert("결제 가능한 예약이 아닙니다.")
                router.push("/mypage")
            })
            .finally(() => setLoading(false))
    }, [id, router])

    const handleFinalBooking = async (e: React.FormEvent) => {
        e.preventDefault()
        // 실제 결제 모듈 연동 후, 성공 시 아래 로직 수행
        router.push(`/booking/success?bookingId=${id}`)
    }

    if (loading) return <div className="flex h-screen items-center justify-center">로딩중...</div>
    if (!paymentData) return <div className="flex h-screen items-center justify-center">결제 정보를 불러올 수 없습니다.</div>

    const steps = ["견적 요청", "매니저 검토", "최종 확인 & 결제"]

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <section className="bg-navy-900 text-white py-10">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-center">예약하기</h1>
                    {/* Progress Steps */}
                    <div className="max-w-2xl mx-auto mt-6">
                        <div className="flex items-center justify-between">
                            {steps.map((label, idx) => (
                                <React.Fragment key={idx}>
                                    <div className="flex flex-col items-center text-white">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white text-navy-900 border-white">
                                            {idx + 1}
                                        </div>
                                        <span className="mt-2 text-xs text-center font-semibold">{label}</span>
                                    </div>
                                    {idx < steps.length - 1 && <div className="flex-1 h-1 mx-2 bg-white"></div>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Final Booking Info */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-28 shadow-lg">
                            <CardHeader className="bg-navy-800 text-white rounded-t-lg">
                                <CardTitle>최종 예약 정보</CardTitle>
                                <CardDescription className="text-gray-300">예약이 확정되었습니다.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-8 h-8 text-green-500"/>
                                    <div>
                                        <h3 className="font-semibold text-green-700">견적 승인 완료</h3>
                                        <p className="text-sm text-gray-600">매니저 검토가 완료되었습니다.</p>
                                    </div>
                                </div>
                                <Separator/>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-3"><Users className="w-4 h-4 text-gray-500" /><span>{paymentData.name} 님</span></div>
                                    <div className="flex items-center gap-3"><Tag className="w-4 h-4 text-gray-500" /><span>{paymentData.productName}</span></div>
                                    <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-gray-500" /><span>{paymentData.travelDate}</span></div>
                                </div>
                                <Separator/>
                                <div className="bg-gray-100 p-4 rounded-lg">
                                    <div className="flex justify-between items-baseline font-bold text-navy-900">
                                        <span>최종 결제 금액</span>
                                        <span className="text-2xl text-teal-600">
                                            {paymentData.finalPrice.toLocaleString()}원
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Payment Selection */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl text-navy-900">결제</CardTitle>
                                <CardDescription>결제 방법을 선택하고 예약을 완료해주세요.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleFinalBooking} className="space-y-6">
                                    <div>
                                        <Label className="text-lg font-semibold text-navy-800">결제 방법 선택 *</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            {paymentMethods.map((method) => (
                                                <div
                                                    key={method.id}
                                                    className={cn(
                                                        "border rounded-lg p-4 cursor-pointer transition-all flex items-center gap-4",
                                                        paymentMethod === method.id
                                                            ? "border-teal-500 bg-teal-50 ring-2 ring-teal-500"
                                                            : "border-gray-200 hover:border-gray-400"
                                                    )}
                                                    onClick={() => setPaymentMethod(method.id)}
                                                >
                                                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", paymentMethod === method.id ? 'bg-teal-500' : 'bg-gray-100')}>
                                                        <method.icon className={cn("w-5 h-5", paymentMethod === method.id ? 'text-white' : 'text-gray-600')} />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-navy-900">{method.name}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full bg-teal-600 hover:bg-teal-700 text-lg py-4 h-auto"
                                        disabled={!paymentMethod || loading}
                                    >
                                        <Wallet className="w-5 h-5 mr-2" />
                                        {paymentData.finalPrice.toLocaleString()}원 결제하기
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}