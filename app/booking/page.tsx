"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Users, MapPin, Clock, CreditCard, Building, Smartphone } from "lucide-react"
import { productApi, bookingApi } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

// 결제 방법 옵션
const paymentMethods = [
    { id: "bank", name: "무통장입금", icon: Building, description: "계좌이체로 결제" },
    { id: "card", name: "신용카드", icon: CreditCard, description: "신용카드로 결제" },
    { id: "kakao", name: "카카오페이", icon: Smartphone, description: "카카오페이로 간편결제" },
    { id: "naver", name: "네이버페이", icon: Smartphone, description: "네이버페이로 간편결제" },
]

// 단위 매핑
const unitMap: Record<string, string> = {
    HOTEL: "박",
    GOLF: "명",
    TOUR: "명",
    SPA: "명",
    ACTIVITY: "명",
    VEHICLE: "일",
}

const productTypeMap: Record<string, string> = {
    HOTEL: "호텔",
    GOLF: "골프",
    TOUR: "패키지",
    SPA: "스파",
    ACTIVITY: "액티비티",
    VEHICLE: "차량",
}

export default function BookingPage() {
    const searchParams = useSearchParams()
    const productId = searchParams.get("productId")
    const defaultDate = searchParams.get("date") || ""
    const defaultCount = searchParams.get("count") || "2"

    const { isAuthenticated, user } = useAuth()
    const today = new Date().toISOString().split("T")[0];

    const [step, setStep] = useState(1)
    const [bookingData, setBookingData] = useState({
        name: "",
        email: "",
        phone: "",
        count: Number(defaultCount),
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

    // 로그인 사용자 정보 자동 입력
    useEffect(() => {
        if (isAuthenticated && user) {
            setBookingData((prev) => ({
                ...prev,
                name: user.name,
                email: user.email,
                phone: user.phone,
            }))
        }
    }, [isAuthenticated, user])

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
                counts: bookingData.count,
                specialRequests: bookingData.specialRequests,
            })
            setBookingData((prev) => ({
                ...prev,
                finalPrice: response.totalPrice,
                bookingId: response.id,
            }))
            setStep(2)
        } catch (err: any) {
            console.error("견적 요청 실패:", err)
            alert("견적 요청 중 오류가 발생했습니다.")
        }
    }

    // 결제 처리 (추후 구현 예정)
    const handleFinalBooking = (e: React.FormEvent) => {
        e.preventDefault()
        alert("결제 모듈 연결 예정입니다.")
    }

    const isQuoteFormValid =
        bookingData.name &&
        bookingData.email &&
        bookingData.phone &&
        bookingData.count &&
        bookingData.travelDate &&
        bookingData.agreeTerms

    const isFinalFormValid = bookingData.paymentMethod

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center space-x-4">
                        {["견적 요청", "매니저 검토", "최종 확인 & 결제"].map((label, idx) => (
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
                                    <Badge className="mb-2 bg-teal-600">{productTypeMap[productInfo.type]}</Badge>
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
                                {step >= 1 && bookingData.count && (
                                    <div className="bg-navy-50 border border-navy-200 p-4 rounded-lg">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>기본 가격</span>
                                                <span>{productInfo.price.toLocaleString()}원</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>
                                                    {productInfo.type === "HOTEL" ? "투숙박수"
                                                        : productInfo.type === "VEHICLE" ? "렌트일수"
                                                            : "인원"} ({bookingData.count}{unitMap[productInfo.type]})
                                                </span>
                                                <span>× {bookingData.count}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between font-bold text-xl text-navy-900">
                                                <span>최종 결제 금액</span>
                                                <span className="text-teal-600">
                                                    {(productInfo.price * bookingData.count).toLocaleString()}원
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
                                                    disabled={isAuthenticated}
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
                                                    disabled={isAuthenticated}
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
                                                <Label htmlFor="count">
                                                    {unitMap[productInfo.type]} *
                                                </Label>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        type="button"
                                                        className="px-3 py-1 border rounded hover:bg-gray-100"
                                                        onClick={() => handleInputChange("count", Math.max(1, bookingData.count - 1))}
                                                    >
                                                        -
                                                    </Button>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        value={bookingData.count}
                                                        onChange={(e) => handleInputChange("count", Number(e.target.value))}
                                                        className="w-16 text-center"
                                                    />
                                                    <Button
                                                        type="button"
                                                        className="px-3 py-1 border rounded hover:bg-gray-100"
                                                        onClick={() => handleInputChange("count", bookingData.count + 1)}
                                                    >
                                                        +
                                                    </Button>
                                                    <span>{unitMap[productInfo.type]}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="travelDate">희망 여행일 *</Label>
                                                <Input
                                                    id="travelDate"
                                                    type="date"
                                                    value={bookingData.travelDate}
                                                    min={today}
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

                        {step === 2 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-navy-900">견적 요청 완료</CardTitle>
                                    <CardDescription>담당 매니저가 확인 후 24시간 이내 연락드리겠습니다.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl text-center">
                                        <div className="flex justify-center mb-4">
                                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                                <span className="text-white text-2xl">⌛</span>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-semibold text-navy-900">견적 요청이 접수되었습니다</h3>
                                        <p className="text-gray-600 mt-2">담당 매니저가 내용을 검토한 후 연락드릴 예정입니다.</p>
                                        <p className="text-gray-600 mt-1">카카오 알림톡으로도 예약 내역이 발송되었습니다.</p>
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