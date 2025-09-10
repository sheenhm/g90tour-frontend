"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Users, Calendar, MapPin, Clock, CreditCard, Building, Smartphone } from "lucide-react"
import { bookingApi } from "@/lib/api"

// 결제 방법 옵션
const paymentMethods = [
    { id: "bank", name: "무통장입금", icon: Building, description: "계좌이체로 결제" },
    { id: "card", name: "신용카드", icon: CreditCard, description: "신용카드로 결제" },
    { id: "kakao", name: "카카오페이", icon: Smartphone, description: "카카오페이로 간편결제" },
    { id: "naver", name: "네이버페이", icon: Smartphone, description: "네이버페이로 간편결제" },
]

export default function BookingPaymentPage() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [paymentData, setPaymentData] = useState<any>(null)
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
                router.push("/booking")
            })
            .finally(() => setLoading(false))
    }, [id, router])

    const handleFinalBooking = async (e: React.FormEvent) => {
        e.preventDefault()
        alert(`${paymentMethod} 방식으로 결제 모듈 연결 예정`)
    }

    if (loading) return <p className="p-6">로딩중...</p>
    if (!paymentData) return <p className="p-6">결제 정보를 불러올 수 없습니다.</p>

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-navy-900">최종 확인 및 결제</CardTitle>
                        <CardDescription>예약이 확약되었습니다. 최종 정보를 확인하고 결제를 진행해주세요.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* 승인된 견적 정보 */}
                            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm">✓</span>
                                    </div>
                                    <h4 className="font-semibold text-green-900">견적 승인 완료</h4>
                                </div>
                                <p className="text-green-800 text-sm">매니저 검토가 완료되어 최종 견적이 확정되었습니다.</p>
                            </div>

                            {/* 예약 정보 */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-navy-900 mb-3">예약 정보</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-teal-600" />
                                        <span>{paymentData.name} 님</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-teal-600" />
                                        <span>{paymentData.travelDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-teal-600" />
                                        <span>{paymentData.productName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-teal-600" />
                                        <span>총 {paymentData.finalPrice.toLocaleString()}원</span>
                                    </div>
                                </div>
                            </div>

                            {/* 결제 방법 선택 */}
                            <form onSubmit={handleFinalBooking} className="space-y-6 mt-6">
                                <div className="space-y-3">
                                    <Label>결제 방법 선택 *</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {paymentMethods.map((method) => (
                                            <div
                                                key={method.id}
                                                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                                    paymentMethod === method.id
                                                        ? "border-navy-600 bg-navy-50"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                                onClick={() => setPaymentMethod(method.id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="paymentMethod"
                                                        value={method.id}
                                                        checked={paymentMethod === method.id}
                                                        onChange={() => setPaymentMethod(method.id)}
                                                        className="text-navy-600"
                                                    />
                                                    <method.icon className="w-5 h-5 text-gray-600" />
                                                    <div>
                                                        <p className="font-medium text-navy-900">{method.name}</p>
                                                        <p className="text-xs text-gray-600">{method.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-teal-600 hover:bg-teal-700 text-lg py-3"
                                    disabled={!paymentMethod}
                                >
                                    {paymentData.finalPrice.toLocaleString()}원 결제하기
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}