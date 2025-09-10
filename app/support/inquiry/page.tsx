"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { MessageSquare, Phone, Mail } from "lucide-react"
import { supportApi, type InquiryRequest } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import { ToastProvider, Toast, ToastTitle, ToastDescription, ToastClose, ToastViewport } from "@/components/ui/toast"

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
    const [formData, setFormData] = useState<InquiryRequest>({
        category: "",
        title: "",
        content: "",
        nonMemberName: "",
        nonMemberEmail: "",
        nonMemberPhone: "",
    })
    const [agreePrivacy, setAgreePrivacy] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setSuccess("")

        try {
            await supportApi.submitInquiry(formData)
            setSuccess("문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.")
            setFormData({
                category: "",
                title: "",
                content: "",
                nonMemberName: isAuthenticated && user ? user.name : "",
                nonMemberEmail: isAuthenticated && user ? user.email : "",
                nonMemberPhone: isAuthenticated && user ? user.phone : "",
            })
            setAgreePrivacy(false)
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
        (isAuthenticated || agreePrivacy);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-navy-900 to-teal-800 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold mb-4">1:1 문의</h1>
                    <p className="text-xl text-gray-200">궁금한 점이나 도움이 필요한 사항을 문의해주세요</p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-navy-900">연락처 정보</CardTitle>
                                <CardDescription>빠른 상담이 필요하시면 직접 연락주세요</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-navy-600 rounded-full flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-navy-900">전화 상담</p>
                                        <p className="text-sm text-gray-600">02-2662-2110</p>
                                        <p className="text-xs text-gray-500">평일 09:00-18:00</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-navy-900">이메일</p>
                                        <p className="text-sm text-gray-600">help@g90tour.com</p>
                                        <p className="text-xs text-gray-500">24시간 접수</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Inquiry Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-navy-900">문의하기</CardTitle>
                                <CardDescription>
                                    자세한 정보를 입력해주시면 더 정확한 답변을 드릴 수 있습니다
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ToastProvider>
                                    <ToastViewport />
                                    {success && (
                                        <Toast open duration={3000} onOpenChange={() => setSuccess("")}>
                                            <ToastTitle>문의 접수 완료</ToastTitle>
                                            <ToastDescription>빠른 시일 내에 답변드리겠습니다:)</ToastDescription>
                                            <ToastClose />
                                        </Toast>
                                    )}
                                    {error && (
                                        <Toast open variant="destructive" duration={3000} onOpenChange={() => setError("")}>
                                            <ToastTitle>접수 실패</ToastTitle>
                                            <ToastDescription>{error}</ToastDescription>
                                            <ToastClose />
                                        </Toast>
                                    )}
                                </ToastProvider>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* 문의 유형 */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="category">문의 유형</Label>
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

                                        <div className="space-y-2">
                                            <Label htmlFor="name">이름</Label>
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
                                    </div>

                                    {/* 이메일 / 연락처 */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">이메일</Label>
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

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">연락처</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="연락처를 입력하세요"
                                                value={formData.nonMemberPhone}
                                                onChange={(e) => handleInputChange("nonMemberPhone", e.target.value)}
                                                disabled={isAuthenticated}
                                            />
                                        </div>
                                    </div>

                                    {/* 제목 / 내용 */}
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">제목</Label>
                                        <Input
                                            id="subject"
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
                                            rows={6}
                                            required
                                        />
                                    </div>

                                    {/* 개인정보 동의 */}
                                    {!isAuthenticated && (
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="agreePrivacy"
                                                checked={agreePrivacy}
                                                onCheckedChange={(checked) => setAgreePrivacy(checked as boolean)}
                                            />
                                            <Label htmlFor="agreePrivacy" className="text-sm">
                                                개인정보 수집 및 이용에 동의합니다
                                                <a href="/privacy" className="text-teal-600 hover:underline ml-1">
                                                    (개인정보처리방침 보기)
                                                </a>
                                            </Label>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full bg-navy-600 hover:bg-navy-700"
                                        disabled={!isFormValid || isLoading}
                                    >
                                        {isLoading ? "접수 중..." : "문의 접수"}
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