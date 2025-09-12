"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
    User,
    Calendar,
    CreditCard,
    Eye,
    X,
    Gift,
    AlertCircle,
    CheckCircle,
    Phone,
    Lock,
    UserX,
    Link as LinkIcon,
    Unlink,
    ChevronRight,
    Loader2,
    Crown
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { mypageApi, authApi, couponApi, bookingApi, type MyPageInfo, type MyCoupon, type BookingResponse } from "@/lib/api"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import {cn} from "@/lib/utils";

const statusConfig: { [key: string]: { color: string; text: string } } = {
    QUOTE_REQUESTED: { color: "bg-blue-500 border-blue-500", text: "견적 요청" },
    PAYMENT_PENDING: { color: "bg-yellow-500 border-yellow-500", text: "결제 대기" },
    PAYMENT_COMPLETED: { color: "bg-green-500 border-green-500", text: "결제 완료" },
    TRAVEL_COMPLETED: { color: "bg-gray-500 border-gray-500", text: "여행 완료" },
    CANCEL_PENDING: { color: "bg-orange-500 border-orange-500", text: "취소 요청" },
    CANCELLED: { color: "bg-red-500 border-red-500", text: "취소 완료" },
}

export default function MyPage() {
    const { user, isAuthenticated, logout } = useAuth()
    const [myPageInfo, setMyPageInfo] = useState<MyPageInfo | null>(null)
    const [myCoupons, setMyCoupons] = useState<MyCoupon[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [couponCode, setCouponCode] = useState("")

    const [editingPhone, setEditingPhone] = useState(false)
    const [phoneData, setPhoneData] = useState({ phone: "" })

    const [editingPassword, setEditingPassword] = useState(false)
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const [socialAccounts, setSocialAccounts] = useState({
        naver: false,
        kakao: false,
    })

    useEffect(() => {
        if (isAuthenticated) {
            fetchMyPageData()
            fetchMyCoupons()
        }
    }, [isAuthenticated])

    const fetchMyPageData = async () => {
        try {
            const data = await mypageApi.getInfo()
            setMyPageInfo(data)
            setPhoneData({ phone: data.phone })
        } catch (error: any) {
            setError("마이페이지 정보를 불러오는데 실패했습니다.")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchMyCoupons = async () => {
        try {
            const coupons = await couponApi.getMyCoupons()
            setMyCoupons(coupons)
        } catch (error: any) {
            console.error("Failed to fetch coupons:", error)
        }
    }

    const handlePhoneUpdate = async () => {
        setError("")
        setSuccess("")
        try {
            if (!user) return
            await authApi.updatePhone(user.id, phoneData.phone)
            setSuccess("연락처가 성공적으로 변경되었습니다.")
            setEditingPhone(false)
            await fetchMyPageData()
        } catch (error: any) {
            setError(error.message || "연락처 변경에 실패했습니다.")
        }
    }

    const handlePasswordUpdate = async () => {
        setError("")
        setSuccess("")
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("새 비밀번호가 일치하지 않습니다."); return;
        }
        try {
            if (!user) return
            await authApi.changePassword(user.id, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            })
            setSuccess("비밀번호가 성공적으로 변경되었습니다.")
            setEditingPassword(false)
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
        } catch (error: any) {
            setError(error.message || "비밀번호 변경에 실패했습니다.")
        }
    }

    const handleDeleteAccount = async () => {
        try {
            if (!user) return
            await authApi.deleteAccount(user.id)
            logout()
            window.location.href = "/"
        } catch (error: any) {
            setError(error.message || "회원탈퇴에 실패했습니다.")
        }
    }

    const handleCancelBooking = async (bookingId: string) => {
        if (confirm("정말로 이 예약을 취소하시겠습니까?")) {
            try {
                await bookingApi.cancel(bookingId)
                setSuccess("예약 취소 요청이 완료되었습니다.")
                await fetchMyPageData()
            } catch (error: any) {
                setError(error.message || "예약 취소에 실패했습니다.")
            }
        }
    }

    const handleRegisterCoupon = async () => {
        if (!couponCode.trim()) { setError("쿠폰 코드를 입력해주세요."); return; }
        try {
            await couponApi.registerCoupon(couponCode)
            setSuccess("쿠폰이 성공적으로 등록되었습니다.")
            setCouponCode("")
            await fetchMyCoupons()
        } catch (error: any) {
            setError(error.message || "쿠폰 등록에 실패했습니다.")
        }
    }

    const handleSocialConnect = (provider: "naver" | "kakao") => {
        setSocialAccounts((prev) => ({ ...prev, [provider]: true }))
        setSuccess(`${provider === "naver" ? "네이버" : "카카오"} 계정이 연동되었습니다.`)
    }

    const handleSocialDisconnect = (provider: "naver" | "kakao") => {
        setSocialAccounts((prev) => ({ ...prev, [provider]: false }))
        setSuccess(`${provider === "naver" ? "네이버" : "카카오"} 계정 연동이 해제되었습니다.`)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-navy-600 animate-spin mx-auto mb-4" />
                    <p>회원 정보를 불러오는 중입니다...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* User Profile Header */}
            <section className="bg-navy-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center text-4xl font-bold">
                            {myPageInfo?.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{myPageInfo?.name}님, 환영합니다!</h1>
                            <p className="text-lg text-gray-300">{myPageInfo?.email}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-center">
                        <div className="bg-white/10 p-4 rounded-lg">
                            <p className="text-sm text-gray-300">회원등급</p>
                            <p className="text-xl font-bold flex items-center justify-center gap-2"><Crown className="w-5 h-5 text-yellow-400"/>{myPageInfo?.grade}</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-lg">
                            <p className="text-sm text-gray-300">총 예약</p>
                            <p className="text-xl font-bold">{myPageInfo?.totalBookings}건</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-lg">
                            <p className="text-sm text-gray-300">총 결제액</p>
                            <p className="text-xl font-bold">{(myPageInfo?.totalSpent ?? 0).toLocaleString()}원</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-lg">
                            <p className="text-sm text-gray-300">보유 쿠폰</p>
                            <p className="text-xl font-bold">{myCoupons.filter(c => c.coupon.status === "ACTIVE").length}장</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {success && (
                    <Alert className="mb-6 border-green-500 text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}

                <Tabs defaultValue="bookings" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="bookings">예약내역</TabsTrigger>
                        <TabsTrigger value="coupons">쿠폰함</TabsTrigger>
                        <TabsTrigger value="profile">회원정보 수정</TabsTrigger>
                    </TabsList>

                    <TabsContent value="bookings" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-navy-900">예약내역</CardTitle>
                                <CardDescription>총 {myPageInfo?.bookingHistory.length}건의 예약내역이 있습니다.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {myPageInfo?.bookingHistory.map((booking: BookingResponse) => (
                                        <Card key={booking.bookingId} className="overflow-hidden">
                                            <div className={cn("h-2 w-full", statusConfig[booking.status]?.color || "bg-gray-500")}></div>
                                            <div className="p-6">
                                                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                                                    <div>
                                                        <Badge className={cn("mb-2", statusConfig[booking.status]?.color || "bg-gray-500")}>
                                                            {statusConfig[booking.status]?.text || booking.status}
                                                        </Badge>
                                                        <h3 className="text-lg font-semibold text-navy-900">{booking.productName}</h3>
                                                        <p className="text-sm text-gray-500">예약번호: {booking.bookingId}</p>
                                                    </div>
                                                    <div className="text-left md:text-right flex-shrink-0">
                                                        <p className="text-xl font-bold text-navy-900">{(booking.totalPrice ?? 0).toLocaleString()}원</p>
                                                        <p className="text-sm text-gray-600">{booking.counts}명 / {booking.travelDate}</p>
                                                    </div>
                                                </div>
                                                <Separator className="my-4"/>
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/products/${booking.productId}`}>
                                                            <Eye className="w-4 h-4 mr-1" /> 상품 보기
                                                        </Link>
                                                    </Button>
                                                    {(booking.status === "PAYMENT_COMPLETED" || booking.status === "PAYMENT_PENDING") && (
                                                        <Button variant="destructive" size="sm" onClick={() => handleCancelBooking(booking.bookingId)}>
                                                            <X className="w-4 h-4 mr-1" /> 취소요청
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                                {(!myPageInfo?.bookingHistory || myPageInfo.bookingHistory.length === 0) && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 mb-4">예약내역이 없습니다.</p>
                                        <Button asChild className="bg-teal-600 hover:bg-teal-700">
                                            <Link href="/">여행 상품 둘러보기</Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="coupons" className="mt-6">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-navy-900">쿠폰 등록</CardTitle>
                                    <CardDescription>쿠폰 코드를 입력하여 새로운 쿠폰을 등록하세요</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="쿠폰 코드를 입력하세요"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            className="flex-1"
                                        />
                                        <Button onClick={handleRegisterCoupon} className="bg-navy-600 hover:bg-navy-700">
                                            등록
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-navy-900">보유 쿠폰</CardTitle>
                                    <CardDescription>
                                        사용 가능한 쿠폰: {myCoupons.filter(c => c.coupon.status === "ACTIVE").length}장
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {myCoupons.map((userCoupon) => {
                                            const c = userCoupon.coupon
                                            const isExpired = new Date(c.expiryDate) < new Date();
                                            const isUsable = c.status === "ACTIVE" && !isExpired;
                                            return (
                                                <div key={userCoupon.userCouponId} className={cn("border-l-4 p-4 rounded-r-lg flex justify-between items-center", isUsable ? 'border-teal-500 bg-white' : 'border-gray-300 bg-gray-50 opacity-60')}>
                                                    <div>
                                                        <h4 className={cn("font-semibold text-lg", isUsable ? 'text-navy-900' : 'text-gray-500')}>{c.description}</h4>
                                                        <p className="text-sm text-gray-600">
                                                            {c.discountType === "FIXED_AMOUNT" ? `${c.discountAmount.toLocaleString()}원 할인` : `${c.discountRate}% 할인 (최대 ${c.maxDiscountAmount?.toLocaleString()}원)`}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">유효기간: ~{c.expiryDate}</p>
                                                    </div>
                                                    <Badge variant={isUsable ? "default" : "outline"} className={isUsable ? 'bg-teal-600' : ''}>
                                                        {isUsable ? "사용가능" : (isExpired ? "기간만료" : "사용불가")}
                                                    </Badge>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    {myCoupons.length === 0 && (
                                        <div className="text-center py-12">
                                            <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500 mb-2">보유한 쿠폰이 없습니다.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="profile" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-navy-900">회원정보 수정</CardTitle>
                                <CardDescription>회원님의 정보를 관리할 수 있습니다.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="phone">
                                        <AccordionTrigger>연락처 변경</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">새 연락처</Label>
                                                <Input id="phone" value={phoneData.phone} onChange={(e) => setPhoneData({ phone: e.target.value })}/>
                                            </div>
                                            <Button onClick={handlePhoneUpdate} className="mt-4 bg-navy-600 hover:bg-navy-700">변경사항 저장</Button>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="password">
                                        <AccordionTrigger>비밀번호 변경</AccordionTrigger>
                                        <AccordionContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="currentPassword">현재 비밀번호</Label>
                                                <Input id="currentPassword" type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}/>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="newPassword">새 비밀번호</Label>
                                                <Input id="newPassword" type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}/>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                                                <Input id="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}/>
                                            </div>
                                            <Button onClick={handlePasswordUpdate} className="mt-2 bg-navy-600 hover:bg-navy-700">비밀번호 변경</Button>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="social">
                                        <AccordionTrigger>소셜 계정 연동</AccordionTrigger>
                                        <AccordionContent className="space-y-4">
                                            {/* Naver */}
                                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center"><span className="text-white text-sm font-bold">N</span></div>
                                                    <p className="font-medium">네이버 {socialAccounts.naver ? "(연동됨)" : ""}</p>
                                                </div>
                                                {socialAccounts.naver ? <Button variant="outline" size="sm" onClick={() => handleSocialDisconnect("naver")}><Unlink className="w-4 h-4 mr-1" />연동 해제</Button> : <Button variant="outline" size="sm" onClick={() => handleSocialConnect("naver")}><LinkIcon className="w-4 h-4 mr-1" />연동하기</Button>}
                                            </div>
                                            {/* Kakao */}
                                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center"><span className="text-black text-sm font-bold">K</span></div>
                                                    <p className="font-medium">카카오 {socialAccounts.kakao ? "(연동됨)" : ""}</p>
                                                </div>
                                                {socialAccounts.kakao ? <Button variant="outline" size="sm" onClick={() => handleSocialDisconnect("kakao")}><Unlink className="w-4 h-4 mr-1" />연동 해제</Button> : <Button variant="outline" size="sm" onClick={() => handleSocialConnect("kakao")}><LinkIcon className="w-4 h-4 mr-1" />연동하기</Button>}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="delete-account" className="border-b-0">
                                        <AccordionTrigger className="text-red-600 hover:no-underline">회원탈퇴</AccordionTrigger>
                                        <AccordionContent>
                                            <p className="text-sm text-gray-600 mb-4">회원탈퇴 시 모든 개인정보 및 예약 내역, 쿠폰이 영구적으로 삭제되며 복구할 수 없습니다.</p>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive"><UserX className="w-4 h-4 mr-2" /> 회원탈퇴 진행</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>정말로 탈퇴하시겠습니까?</AlertDialogTitle>
                                                        <AlertDialogDescription>이 작업은 되돌릴 수 없습니다.</AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>취소</AlertDialogCancel>
                                                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">탈퇴하기</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}