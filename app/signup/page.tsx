"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, AlertCircle, User, Mail, Phone, Lock, Calendar, VenetianMask } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        phone: "",
        birth: "",
        gender: "" as "MALE" | "FEMALE" | "",
        agreeTerms: false,
        agreePrivacy: false,
        agreeMarketing: false,
    })

    const { signup } = useAuth()
    const router = useRouter()

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleAllAgreements = (checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            agreeTerms: checked,
            agreePrivacy: checked,
            agreeMarketing: checked
        }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        if (formData.password !== formData.confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.")
            setIsLoading(false)
            return
        }

        if (!formData.gender) {
            setError("성별을 선택해주세요.")
            setIsLoading(false)
            return
        }

        try {
            await signup({
                email: formData.email,
                password: formData.password,
                name: formData.name,
                phone: formData.phone,
                birth: formData.birth,
                gender: formData.gender,
            })
            router.push("/")
        } catch (error: any) {
            setError(error.message || "회원가입에 실패했습니다.")
        } finally {
            setIsLoading(false)
        }
    }

    const isFormValid =
        formData.email &&
        formData.password &&
        formData.confirmPassword &&
        formData.name &&
        formData.phone &&
        formData.birth &&
        formData.gender &&
        formData.agreeTerms &&
        formData.agreePrivacy

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[400px] gap-6">
                    <div className="grid gap-2 text-center">
                        <Image src="/logo.png" alt="G90 Tour Logo" width={80} height={80} className="mx-auto" />
                        <h1 className="text-3xl font-bold text-navy-900">새로운 여정의 시작</h1>
                        <p className="text-balance text-muted-foreground">
                            G90 Tour와 함께할 준비가 되셨나요?
                        </p>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">이름</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required disabled={isLoading} className="pl-10" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">연락처</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="phone" type="tel" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} required disabled={isLoading} className="pl-10"/>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="birth">생년월일</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="birth" type="date" value={formData.birth} onChange={(e) => handleInputChange("birth", e.target.value)} required disabled={isLoading} className="pl-10"/>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="gender">성별</Label>
                                <div className="relative">
                                    <VenetianMask className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)} disabled={isLoading}>
                                        <SelectTrigger className="pl-10"><SelectValue placeholder="성별 선택" /></SelectTrigger>
                                        <SelectContent><SelectItem value="MALE">남성</SelectItem><SelectItem value="FEMALE">여성</SelectItem></SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">이메일 (아이디)</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required disabled={isLoading} className="pl-10"/>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="password">비밀번호</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} required disabled={isLoading} className="pl-10"/>
                                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={(e) => handleInputChange("confirmPassword", e.target.value)} required disabled={isLoading} className="pl-10"/>
                                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="agreeAll" onCheckedChange={(checked) => handleAllAgreements(!!checked)} />
                                <Label htmlFor="agreeAll" className="text-sm font-semibold">전체 동의</Label>
                            </div>
                            <div className="pl-6 space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="agreeTerms" checked={formData.agreeTerms} onCheckedChange={(checked) => handleInputChange("agreeTerms", !!checked)} disabled={isLoading} />
                                    <Label htmlFor="agreeTerms" className="text-sm text-muted-foreground">이용약관 (필수) <Link href="/terms" className="text-teal-600 hover:underline">(보기)</Link></Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="agreePrivacy" checked={formData.agreePrivacy} onCheckedChange={(checked) => handleInputChange("agreePrivacy", !!checked)} disabled={isLoading} />
                                    <Label htmlFor="agreePrivacy" className="text-sm text-muted-foreground">개인정보처리방침 (필수) <Link href="/privacy" className="text-teal-600 hover:underline">(보기)</Link></Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="agreeMarketing" checked={formData.agreeMarketing} onCheckedChange={(checked) => handleInputChange("agreeMarketing", !!checked)} disabled={isLoading} />
                                    <Label htmlFor="agreeMarketing" className="text-sm text-muted-foreground">마케팅 정보 수신 (선택)</Label>
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-navy-600 hover:bg-navy-700 text-lg py-3 h-auto" disabled={!isFormValid || isLoading}>
                            {isLoading ? "가입 중..." : "회원가입"}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        이미 계정이 있으신가요?{" "}
                        <Link href="/login" className="underline text-teal-600 font-semibold">
                            로그인
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden lg:block relative">
                <Image
                    src="https://images.unsplash.com/photo-1528543606781-2f6e6857f318?q=80&w=1965&auto=format&fit=crop"
                    alt="Happy traveler background"
                    width="1920"
                    height="1080"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 to-transparent"></div>
            </div>
        </div>
    )
}