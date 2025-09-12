"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { MessageSquare, User, Mail, Phone, Edit, CheckCircle, Home, AlertCircle } from "lucide-react"
import { supportApi, type InquiryRequest } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

const inquiryCategories = [
    { value: "예약/결제", label: "예약/결제 문의" },
    { value: "여행 정보", label: "여행 정보 문의" },
    { value: "취소/환불", label: "취소/환불 문의" },
    { value: "불만/개선사항", label: "불만/개선사항" },
    { value: "칭찬/제안", label: "칭찬/제안" },
    { value: "기타", label: "기타 문의" },
]

export default function InquiryPage() {
    const { user, isAuthenticated } = useAuth()
    const initialFormState: InquiryRequest = {
        category: "",
        title: "",
        content: "",
        nonMemberName: "",
        nonMemberEmail: "",
        nonMemberPhone: "",
    }
    const [formData, setFormData] = useState<InquiryRequest>(initialFormState)
    const [agreePrivacy, setAgreePrivacy] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)

    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData((prev) => ({
                ...prev,
                nonMemberName: user.name,
                nonMemberEmail: user.email,
                nonMemberPhone: user.phone,
            }))
        }
    }, [isAuthenticated, user])

    const handleInputChange = (field: keyof InquiryRequest, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const resetForm = () => {
        setIsSubmitted(false)
        setFormData(initialFormState)
        setAgreePrivacy(false)
        if (isAuthenticated && user) {
            setFormData((prev) => ({ ...prev, nonMemberName: user.name, nonMemberEmail: user.email, nonMemberPhone: user.phone }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            await supportApi.submitInquiry(formData)
            setIsSubmitted(true)
        } catch (error: any) {
            setError(error.message || "문의 접수에 실패했습니다.")
        } finally {
            setIsLoading(false)
        }
    }

    const isFormValid =
        formData.category &&
        formData.title &&
        formData.content &&
        formData.nonMemberName &&
        formData.nonMemberEmail &&
        (isAuthenticated || agreePrivacy)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative h-[400px] w-full flex items-center justify-center">
                <Image
                    src="https://images.unsplash.com/photo-1516410529446-21e7e256564e?q=80&w=2070&auto=format&fit=crop"
                    alt="Contact us"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 container mx-auto px-4 text-center text-white">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">1:1 문의</h1>
                    <p className="text-lg md:text-xl text-gray-200">궁금한 점이나 도움이 필요한 사항을 문의해주세요</p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16">
                <Card className="max-w-4xl mx-auto shadow-lg">
                    {isSubmitted ? (
                        <CardContent className="p-10 text-center">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-navy-900 mb-2">문의가 성공적으로 접수되었습니다.</h2>
                            <p className="text-gray-600 mb-8">빠른 시일 내에 답변드리겠습니다. 감사합니다.</p>
                            <div className="flex justify-center gap-4">
                                <Button onClick={resetForm} variant="outline" className="bg-transparent">
                                    <Edit className="w-4 h-4 mr-2" /> 새 문의 작성하기
                                </Button>
                                <Button asChild className="bg-navy-600 hover:bg-navy-700">
                                    <Link href="/">
                                        <Home className="w-4 h-4 mr-2" /> 홈으로 돌아가기
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    ) : (
                        <>
                            <CardHeader>
                                <CardTitle className="text-2xl text-navy-900">문의 작성</CardTitle>
                                <CardDescription>
                                    자세한 정보를 입력해주시면 더 정확한 답변을 드릴 수 있습니다
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                {error && (
                                    <Alert variant="destructive" className="mb-6">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-navy-900 mb-4">문의 유형</h3>
                                        <div className="space-y-2">
                                            <Label htmlFor="category" className="sr-only">문의 유형</Label>
                                            <Select
                                                value={formData.category}
                                                onValueChange={(value) => handleInputChange("category", value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="문의 유형을 선택하세요" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {inquiryCategories.map((category) => (
                                                        <SelectItem key={category.value} value={category.value}>
                                                            {category.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <Separator/>

                                    <div>
                                        <h3 className="text-lg font-semibold text-navy-900 mb-4">문의 내용</h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="title">제목</Label>
                                                <Input
                                                    id="title"
                                                    type="text"
                                                    placeholder="문의 제목을 입력하세요"
                                                    value={formData.title}
                                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="content">문의 내용</Label>
                                                <Textarea
                                                    id="content"
                                                    placeholder="문의하실 내용을 자세히 입력해주세요"
                                                    value={formData.content}
                                                    onChange={(e) => handleInputChange("content", e.target.value)}
                                                    rows={8}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Separator/>

                                    <div>
                                        <h3 className="text-lg font-semibold text-navy-900 mb-4">답변 받으실 정보</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="flex items-center gap-2"><User className="w-4 h-4"/> 이름</Label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    placeholder="이름을 입력하세요"
                                                    value={formData.nonMemberName}
                                                    onChange={(e) => handleInputChange("nonMemberName", e.target.value)}
                                                    required
                                                    disabled={isAuthenticated}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="w-4 h-4"/> 연락처</Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="연락처를 입력하세요"
                                                    value={formData.nonMemberPhone}
                                                    onChange={(e) => handleInputChange("nonMemberPhone", e.target.value)}
                                                    disabled={isAuthenticated}
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <Label htmlFor="email" className="flex items-center gap-2"><Mail className="w-4 h-4"/> 이메일</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="답변받을 이메일을 입력하세요"
                                                    value={formData.nonMemberEmail}
                                                    onChange={(e) => handleInputChange("nonMemberEmail", e.target.value)}
                                                    required
                                                    disabled={isAuthenticated}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {!isAuthenticated && (
                                        <div className="flex items-start space-x-3 pt-4 border-t">
                                            <Checkbox
                                                id="agreePrivacy"
                                                checked={agreePrivacy}
                                                onCheckedChange={(checked) => setAgreePrivacy(checked as boolean)}
                                            />
                                            <div className="grid gap-1.5 leading-none">
                                                <Label htmlFor="agreePrivacy" className="text-sm font-medium">
                                                    개인정보 수집 및 이용에 동의합니다 (필수)
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    문의 처리를 위해 이름, 이메일, 연락처를 수집합니다.
                                                    <Link href="/privacy" className="text-teal-600 hover:underline ml-1">
                                                        자세히 보기
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full bg-navy-600 hover:bg-navy-700"
                                        disabled={!isFormValid || isLoading}
                                    >
                                        {isLoading ? "접수 중..." : "문의 접수하기"}
                                    </Button>
                                </form>
                            </CardContent>
                        </>
                    )}
                </Card>
            </div>
        </div>
    )
}