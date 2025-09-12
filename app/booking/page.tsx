"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {Calendar, Users, MapPin, Mail, Phone, ArrowRight, Send, CheckCircle, Loader2} from "lucide-react"
import { productApi, bookingApi } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import Image from "next/image"
import Link from "next/link"

const unitMap: Record<string, string> = {
    HOTEL: "투숙일수",
    GOLF: "인원",
    TOUR: "인원",
    SPA: "인원",
    ACTIVITY: "인원",
    VEHICLE: "사용일수",
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
    const router = useRouter()
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

    const [isLoading, setIsLoading] = useState(false)

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

    const handleQuoteRequest = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
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
                bookingId: response.bookingId,
            }))
            setStep(2)
        } catch (err: any) {
            console.error("견적 요청 실패:", err)
            alert("견적 요청 중 오류가 발생했습니다.")
        } finally {
            setIsLoading(false)
        }
    }

    const isQuoteFormValid =
        bookingData.name &&
        bookingData.email &&
        bookingData.phone &&
        bookingData.count > 0 &&
        bookingData.travelDate &&
        bookingData.agreeTerms

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
                                    <div className={`flex flex-col items-center ${step >= idx + 1 ? "text-white" : "text-gray-400"}`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= idx + 1 ? "bg-white text-navy-900 border-white" : "border-gray-500"}`}>
                                            {idx + 1}
                                        </div>
                                        <span className="mt-2 text-xs text-center font-semibold">{label}</span>
                                    </div>
                                    {idx < steps.length - 1 && <div className={`flex-1 h-1 mx-2 ${step >= idx + 2 ? "bg-white" : "bg-gray-500"}`}></div>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Product Info */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-28 shadow-lg">
                            <CardContent className="p-0">
                                <Image src={productInfo.image} alt={productInfo.name} width={400} height={250} className="w-full h-48 object-cover rounded-t-lg" />
                                <div className="p-6">
                                    <Badge className="mb-2 bg-teal-600">{productTypeMap[productInfo.type]}</Badge>
                                    <h3 className="text-xl font-bold text-navy-900">{productInfo.name}</h3>
                                    <div className="flex items-center gap-2 mt-2 text-gray-600">
                                        <MapPin className="w-4 h-4" />
                                        <span>{productInfo.description.split('\n')[0]}</span>
                                    </div>
                                    <Separator className="my-4" />
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>기본 가격</span>
                                                <span>{productInfo.price.toLocaleString()}원</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>{unitMap[productInfo.type]}</span>
                                                <span>× {bookingData.count}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between items-baseline font-bold text-navy-900">
                                                <span>예상 금액</span>
                                                <span className="text-2xl text-teal-600">
                                                    {(productInfo.price * bookingData.count).toLocaleString()}원
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">최종 금액은 매니저 확인 후 확정됩니다.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Form / Status */}
                    <div className="lg:col-span-2">
                        {step === 1 && (
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-navy-900">견적 요청</CardTitle>
                                    <CardDescription>정확한 견적을 위해 아래 정보를 입력해주세요.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleQuoteRequest} className="space-y-8">
                                        {/* Booker Info */}
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-lg text-navy-800 border-b pb-2">예약자 정보</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name" className="flex items-center gap-2"><Users className="w-4 h-4"/>이름 *</Label>
                                                    <Input id="name" value={bookingData.name} onChange={(e) => handleInputChange("name", e.target.value)} required disabled={isAuthenticated} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="w-4 h-4"/>연락처 *</Label>
                                                    <Input id="phone" type="tel" value={bookingData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} required disabled={isAuthenticated}/>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="flex items-center gap-2"><Mail className="w-4 h-4"/>이메일 *</Label>
                                                <Input id="email" type="email" value={bookingData.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
                                            </div>
                                        </div>

                                        {/* Booking Details */}
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-lg text-navy-800 border-b pb-2">예약 상세</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="travelDate" className="flex items-center gap-2"><Calendar className="w-4 h-4"/>희망 여행일 *</Label>
                                                    <Input id="travelDate" type="date" value={bookingData.travelDate} min={today} onChange={(e) => handleInputChange("travelDate", e.target.value)} required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="count" className="flex items-center gap-2"><Users className="w-4 h-4"/>{unitMap[productInfo.type]} *</Label>
                                                    <Input id="count" type="number" min={1} value={bookingData.count} onChange={(e) => handleInputChange("count", Number(e.target.value))} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="specialRequests">특별 요청사항</Label>
                                                <Textarea id="specialRequests" placeholder="요청사항을 입력해주세요 (예: 알러지 정보, 휠체어 필요 등)" value={bookingData.specialRequests} onChange={(e) => handleInputChange("specialRequests", e.target.value)} rows={4}/>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="agreeTerms" checked={bookingData.agreeTerms} onCheckedChange={(checked) => handleInputChange("agreeTerms", !!checked)} />
                                            <Label htmlFor="agreeTerms" className="text-sm">개인정보 수집 및 이용약관에 동의합니다 *</Label>
                                        </div>

                                        <Button type="submit" size="lg" className="w-full bg-teal-600 hover:bg-teal-700 text-lg" disabled={!isQuoteFormValid || isLoading}>
                                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                                            {isLoading ? "요청 중..." : "견적 요청하기"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        {step === 2 && (
                            <Card className="shadow-lg text-center">
                                <CardContent className="p-10">
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold text-navy-900">견적 요청이 완료되었습니다</h2>
                                    <p className="text-gray-600 mt-2 mb-6">
                                        담당 매니저가 확인 후 24시간 이내에 연락드릴 예정입니다.
                                        <br />
                                        카카오 알림톡으로도 예약 내역이 발송되었습니다.
                                    </p>
                                    <div className="flex justify-center gap-4">
                                        <Button asChild variant="outline">
                                            <Link href="/">홈으로 돌아가기</Link>
                                        </Button>
                                        <Button asChild className="bg-navy-600 hover:bg-navy-700">
                                            <Link href="/mypage">마이페이지에서 확인</Link>
                                        </Button>
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