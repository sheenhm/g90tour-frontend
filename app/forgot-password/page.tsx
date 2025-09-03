"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

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

    try {
      // 실제로는 API 호출로 인증코드 발송
      console.log("Sending verification code to:", email)

      // 시뮬레이션: 2초 후 성공
      await new Promise((resolve) => setTimeout(resolve, 2000))

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
      // 실제로는 API 호출로 인증코드 확인
      console.log("Verifying code:", verificationCode)

      // 시뮬레이션: 1초 후 성공
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (verificationCode === "123456") {
        // 데모용 코드
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
      // 실제로는 API 호출로 비밀번호 재설정
      console.log("Resetting password for:", email)

      // 시뮬레이션: 2초 후 성공
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setStep(4)
    } catch (err) {
      setError("비밀번호 재설정에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    setError("")

    try {
      // 실제로는 API 호출로 인증코드 재발송
      console.log("Resending verification code to:", email)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess("인증코드가 재발송되었습니다.")
    } catch (err) {
      setError("인증코드 재발송에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-navy-900">
            {step === 1 && "비밀번호 찾기"}
            {step === 2 && "인증코드 확인"}
            {step === 3 && "새 비밀번호 설정"}
            {step === 4 && "재설정 완료"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "가입하신 이메일 주소를 입력해주세요"}
            {step === 2 && "이메일로 발송된 인증코드를 입력해주세요"}
            {step === 3 && "새로운 비밀번호를 설정해주세요"}
            {step === 4 && "비밀번호가 성공적으로 재설정되었습니다"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* Step 1: 이메일 입력 */}
          {step === 1 && (
            <form onSubmit={handleSendVerificationCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일 주소</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="가입하신 이메일을 입력하세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-navy-600 hover:bg-navy-700" disabled={isLoading}>
                {isLoading ? "발송 중..." : "인증코드 발송"}
              </Button>
            </form>
          )}

          {/* Step 2: 인증코드 입력 */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">인증코드</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="6자리 인증코드를 입력하세요"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  required
                />
                <p className="text-sm text-gray-600">{email}로 인증코드를 발송했습니다.</p>
              </div>

              <Button type="submit" className="w-full bg-navy-600 hover:bg-navy-700" disabled={isLoading}>
                {isLoading ? "확인 중..." : "인증코드 확인"}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="text-teal-600 hover:text-teal-700"
                >
                  인증코드 재발송
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: 새 비밀번호 설정 */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">새 비밀번호</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="새 비밀번호를 입력하세요"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="text-sm text-gray-600">
                <p>비밀번호 조건:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>8자 이상</li>
                  <li>영문, 숫자 조합 권장</li>
                </ul>
              </div>

              <Button type="submit" className="w-full bg-navy-600 hover:bg-navy-700" disabled={isLoading}>
                {isLoading ? "설정 중..." : "비밀번호 재설정"}
              </Button>
            </form>
          )}

          {/* Step 4: 완료 */}
          {step === 4 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">재설정 완료!</h3>
                <p className="text-gray-600">
                  비밀번호가 성공적으로 변경되었습니다.
                  <br />
                  새로운 비밀번호로 로그인해주세요.
                </p>
              </div>

              <Button asChild className="w-full bg-navy-600 hover:bg-navy-700">
                <Link href="/login">로그인하기</Link>
              </Button>
            </div>
          )}

          {/* 뒤로가기 및 로그인 링크 */}
          {step < 4 && (
            <div className="flex items-center justify-between text-sm">
              {step > 1 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(step - 1)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  이전 단계
                </Button>
              ) : (
                <Link href="/login" className="text-gray-600 hover:text-gray-800 flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  로그인으로 돌아가기
                </Link>
              )}

              <Link href="/signup" className="text-teal-600 hover:underline">
                회원가입
              </Link>
            </div>
          )}

          {/* 도움말 */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <h4 className="font-semibold text-navy-900 mb-2">도움이 필요하신가요?</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>고객센터: 1588-0000</span>
                </div>
                <p>평일 09:00-18:00 운영</p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
