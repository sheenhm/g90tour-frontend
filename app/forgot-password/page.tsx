"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, ArrowLeft, CheckCircle, AlertCircle, KeyRound, Lock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1) // 1: 이메일 입력, 2: 인증코드 입력, 3: 새 비밀번호 설정, 4: 완료
    const [email, setEmail] = useState("")
    const [verificationCode, setVerificationCode] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleSendVerificationCode = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setSuccess("")

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500))
            setSuccess("인증코드가 이메일로 발송되었습니다.")
            setStep(2)
        } catch (err) {
            setError("인증코드 발송에 실패했습니다. 다시 시도해주세요.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            if (verificationCode === "123456") { // 데모용 코드
                setSuccess("인증이 완료되었습니다.")
                setStep(3)
            } else {
                setError("인증코드가 올바르지 않습니다.")
            }
        } catch (err) {
            setError("인증 확인에 실패했습니다. 다시 시도해주세요.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        if (newPassword !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.")
            setIsLoading(false)
            return
        }
        if (newPassword.length < 8) {
            setError("비밀번호는 8자 이상이어야 합니다.")
            setIsLoading(false)
            return
        }

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500))
            setStep(4)
        } catch (err) {
            setError("비밀번호 재설정에 실패했습니다. 다시 시도해주세요.")
        } finally {
            setIsLoading(false)
        }
    }

    const stepConfig = [
        { title: "비밀번호 찾기", description: "가입하신 이메일 주소를 입력해주세요." },
        { title: "인증코드 확인", description: "이메일로 발송된 인증코드를 입력해주세요." },
        { title: "새 비밀번호 설정", description: "새로운 비밀번호를 설정해주세요." },
        { title: "재설정 완료", description: "비밀번호가 성공적으로 재설정되었습니다." },
    ]

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[380px] gap-6">
                    <div className="grid gap-4 text-center">
                        <Image src="/logo.png" alt="G90 Tour Logo" width={80} height={80} className="mx-auto" />
                        <h1 className="text-3xl font-bold text-navy-900">{stepConfig[step - 1].title}</h1>
                        <p className="text-balance text-muted-foreground">{stepConfig[step - 1].description}</p>
                    </div>

                    <Progress value={(step / 4) * 100} className="w-full h-2" />

                    {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
                    {success && <Alert className="border-green-500 text-green-700"><CheckCircle className="h-4 w-4" /><AlertDescription>{success}</AlertDescription></Alert>}

                    {step === 1 && (
                        <form onSubmit={handleSendVerificationCode} className="grid gap-4">
                            <div className="grid gap-2"><Label htmlFor="email">이메일 주소</Label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10"/></div></div>
                            <Button type="submit" className="w-full bg-navy-600 hover:bg-navy-700" disabled={isLoading}>{isLoading ? "발송 중..." : "인증코드 발송"}</Button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyCode} className="grid gap-4">
                            <div className="grid gap-2"><Label htmlFor="code">인증코드</Label><div className="relative"><KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="code" type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} maxLength={6} required className="pl-10"/></div></div>
                            <Button type="submit" className="w-full bg-navy-600 hover:bg-navy-700" disabled={isLoading}>{isLoading ? "확인 중..." : "인증코드 확인"}</Button>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="grid gap-4">
                            <div className="grid gap-2"><Label htmlFor="newPassword">새 비밀번호</Label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="pl-10"/></div></div>
                            <div className="grid gap-2"><Label htmlFor="confirmPassword">비밀번호 확인</Label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="pl-10"/></div></div>
                            <Button type="submit" className="w-full bg-navy-600 hover:bg-navy-700" disabled={isLoading}>{isLoading ? "설정 중..." : "비밀번호 재설정"}</Button>
                        </form>
                    )}

                    {step === 4 && (
                        <div className="text-center space-y-4">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                            <Button asChild className="w-full bg-navy-600 hover:bg-navy-700"><Link href="/login">로그인하기</Link></Button>
                        </div>
                    )}

                    <div className="mt-4 text-center text-sm">
                        <Link href="/login" className="underline text-muted-foreground hover:text-primary flex items-center justify-center">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            로그인으로 돌아가기
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden lg:block relative">
                <Image
                    src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop"
                    alt="Path to recovery"
                    width="1920"
                    height="1080"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 to-transparent"></div>
            </div>
        </div>
    )
}