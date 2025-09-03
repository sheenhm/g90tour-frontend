"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Users, MapPin, Clock, CreditCard, Building, Smartphone } from "lucide-react"
import { productApi, bookingApi } from "@/lib/api"

// 결제 방법 옵션
const paymentMethods = [
    { id: "bank", name: "무통장입금", icon: Building, description: "계좌이체로 결제" },
    { id: "card", name: "신용카드", icon: CreditCard, description: "신용카드로 결제" },
    { id: "kakao", name: "카카오페이", icon: Smartphone, description: "카카오페이로 간편결제" },
    { id: "naver", name: "네이버페이", icon: Smartphone, description: "네이버페이로 간편결제" },
]

export default function BookingPage() {
    const searchParams = useSearchParams()
    const productId = searchParams.get("productId")
    const defaultDate = searchParams.get("date") || ""
    const defaultCount = searchParams.get("count") || "2"

    const [step, setStep] = useState(1)
    const [bookingData, setBookingData] = useState({
        name: "",
        email: "",
        phone: "",
        travelers: defaultCount,
        travelDate: defaultDate,
        specialRequests: "",
        agreeTerms: false,
        paymentMethod: "",
        finalPrice: 0,
        bookingId: "",
    })

    const [productInfo, setProductInfo] = useState<{
        name: string
        type: string
        price: number
        image: string
        description: string
        includes: string[]
    }>({
        name: "",
        type: "",
        price: 0,
        image: "/placeholder.svg?height=200&width=300",
        description: "",
        includes: [],
    })

    // 상품 정보 가져오기
    useEffect(() => {
        if (productId) {
            productApi.getById(productId).then((data) => {
                setProductInfo({
                    name: data.name,
                    type: data.category,
                    price: data.salePrice,
                    image: data.imageUrl || "/placeholder.svg",
                    description: data.description,
                    includes: data.includes,
                })
            })
        }
    }, [productId])

    const handleInputChange = (field: string, value: string | boolean | number) => {
        setBookingData((prev) => ({ ...prev, [field]: value }))
    }

    // 견적 요청
    const handleQuoteRequest = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await bookingApi.request({
                productId: productId!,
                travelDate: bookingData.travelDate,
                travelers: Number.parseInt(bookingData.travelers),
                specialRequests: bookingData.specialRequests,
            })
            setBookingData((prev) => ({
                ...prev,
                finalPrice: response.totalPrice,
                bookingId: response.id,
            }))
            setStep(3)
        } catch (err: any) {
            console.error("견적 요청 실패:", err)
            alert("견적 요청 중 오류가 발생했습니다.")
        }
    }

    // 결제 처리 (실제 API 연결 필요 시 확장 가능)
    const handleFinalBooking = (e: React.FormEvent) => {
        e.preventDefault()
        alert(`예약이 완료되었습니다! 결제 방법: ${bookingData.paymentMethod}`)
    }

    const isQuoteFormValid =
        bookingData.name &&
        bookingData.email &&
        bookingData.phone &&
        bookingData.travelers &&
        bookingData.travelDate &&
        bookingData.agreeTerms

    const isFinalFormValid = bookingData.paymentMethod

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center space-x-4">
                        {["견적 요청", "관리자 검토", "최종 확인 & 결제"].map((label, idx) => (
                            <React.Fragment key={idx}>
                                <div className={`flex items-center ${step >= idx + 1 ? "text-navy-600" : "text-gray-400"}`}>
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            step >= idx + 1 ? "bg-navy-600 text-white" : "bg-gray-300 text-gray-600"
                                        }`}
                                    >
                                        {idx + 1}
                                    </div>
                                    <span className="ml-2 font-medium">{label}</span>
                                </div>
                                {idx < 2 && <div className={`w-16 h-1 ${step >= idx + 2 ? "bg-navy-600" : "bg-gray-300"}`}></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 상품 정보 */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle className="text-navy-900">예약 상품</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <img src={productInfo.image} alt={productInfo.name} className="w-full h-48 object-cover rounded-lg" />
                                <div>
                                    <Badge className="mb-2 bg-teal-600">{productInfo.type}</Badge>
                                    <h3 className="text-lg font-semibold text-navy-900">{productInfo.name}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{productInfo.description}</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-medium text-navy-900">포함사항</h4>
                                    {productInfo.includes.map((item, index) => (
                                        <p key={index} className="text-sm text-gray-600">
                                            • {item}
                                        </p>
                                    ))}
                                </div>
                                <Separator />
                                {step >= 1 && bookingData.travelers && (
                                    <div className="bg-navy-50 border border-navy-200 p-4 rounded-lg">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>기본 가격</span>
                                                <span>{productInfo.price.toLocaleString()}원</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>인원 ({bookingData.travelers}명)</span>
                                                <span>× {bookingData.travelers}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between font-bold text-xl text-navy-900">
                                                <span>최종 결제 금액</span>
                                                <span className="text-teal-600">
                          {(productInfo.price * Number.parseInt(bookingData.travelers)).toLocaleString()}원
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* 예약 폼 */}
                    <div className="lg:col-span-2">
                        {step === 1 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-navy-900">견적 요청</CardTitle>
                                    <CardDescription>여행자 정보를 입력해주시면 맞춤 견적을 제공해드립니다</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleQuoteRequest} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">이름 *</Label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    placeholder="이름을 입력하세요"
                                                    value={bookingData.name}
                                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">연락처 *</Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="연락처를 입력하세요"
                                                    value={bookingData.phone}
                                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">이메일 *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="이메일을 입력하세요"
                                                value={bookingData.email}
                                                onChange={(e) => handleInputChange("email", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="travelers">여행 인원 *</Label>
                                                <Select value={bookingData.travelers} onValueChange={(value) => handleInputChange("travelers", value)}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {["1", "2", "3", "4", "5", "6+"].map((num) => (
                                                            <SelectItem key={num} value={num}>
                                                                {num}명
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="travelDate">희망 여행일 *</Label>
                                                <Input
                                                    id="travelDate"
                                                    type="date"
                                                    value={bookingData.travelDate}
                                                    onChange={(e) => handleInputChange("travelDate", e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="specialRequests">특별 요청사항</Label>
                                            <Textarea
                                                id="specialRequests"
                                                placeholder="특별한 요청사항이나 문의사항을 입력해주세요"
                                                value={bookingData.specialRequests}
                                                onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                                                rows={4}
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="agreeTerms"
                                                checked={bookingData.agreeTerms}
                                                onCheckedChange={(checked) => handleInputChange("agreeTerms", checked)}
                                            />
                                            <Label htmlFor="agreeTerms" className="text-sm">
                                                개인정보 수집 및 이용약관에 동의합니다 *
                                            </Label>
                                        </div>
                                        <Button type="submit" className="w-full bg-navy-600 hover:bg-navy-700" disabled={!isQuoteFormValid}>
                                            견적 요청하기
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        {step === 3 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-navy-900">최종 확인 및 결제</CardTitle>
                                    <CardDescription>견적이 승인되었습니다. 최종 정보를 확인하고 결제를 진행해주세요.</CardDescription>
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
                                            <p className="text-green-800 text-sm">관리자 검토가 완료되어 최종 견적이 확정되었습니다.</p>
                                        </div>

                                        {/* 최종 예약 정보 */}
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-navy-900 mb-3">예약 정보</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-teal-600" />
                                                    <span>
                            {bookingData.name} 외 {Number.parseInt(bookingData.travelers) - 1}명
                          </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-teal-600" />
                                                    <span>{bookingData.travelDate}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-teal-600" />
                                                    <span>{productInfo.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-teal-600" />
                                                    <span>총 {bookingData.finalPrice.toLocaleString()}원</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 결제 방법 선택 */}
                                        <form onSubmit={handleFinalBooking} className="space-y-6">
                                            <div className="space-y-3">
                                                <Label>결제 방법 선택 *</Label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {paymentMethods.map((method) => (
                                                        <div
                                                            key={method.id}
                                                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                                                bookingData.paymentMethod === method.id
                                                                    ? "border-navy-600 bg-navy-50"
                                                                    : "border-gray-200 hover:border-gray-300"
                                                            }`}
                                                            onClick={() => handleInputChange("paymentMethod", method.id)}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <input
                                                                    type="radio"
                                                                    name="paymentMethod"
                                                                    value={method.id}
                                                                    checked={bookingData.paymentMethod === method.id}
                                                                    onChange={() => handleInputChange("paymentMethod", method.id)}
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
                                                disabled={!isFinalFormValid}
                                            >
                                                {bookingData.finalPrice.toLocaleString()}원 결제하기
                                            </Button>
                                        </form>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}