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
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
  LinkIcon,
  Unlink,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { mypageApi, authApi, couponApi, bookingApi, type MyPageInfo, type MyCoupon } from "@/lib/api"

const statusConfig = {
    QUOTE_REQUESTED: { color: "bg-blue-600", text: "견적 요청" },
    PAYMENT_PENDING: { color: "bg-yellow-600", text: "결제 대기" },
    PAYMENT_COMPLETED: { color: "bg-green-600", text: "결제 완료" },
    TRAVEL_COMPLETED: { color: "bg-gray-600", text: "여행 완료" },
    CANCEL_PENDING: { color: "bg-orange-600", text: "취소 요청" },
    CANCELLED: { color: "bg-red-600", text: "취소 완료" },
}

export default function MyPage() {
  const { user, isAuthenticated, logout } = useAuth()
  const [myPageInfo, setMyPageInfo] = useState<MyPageInfo | null>(null)
  const [myCoupons, setMyCoupons] = useState<MyCoupon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [couponCode, setCouponCode] = useState("")

  // 연락처 변경 상태
  const [editingPhone, setEditingPhone] = useState(false)
  const [phoneData, setPhoneData] = useState({ phone: "" })

  // 비밀번호 변경 상태
  const [editingPassword, setEditingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // 소셜 계정 연동 상태 (더미 데이터)
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
      setError("새 비밀번호가 일치하지 않습니다.")
      return
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
    if (!couponCode.trim()) {
      setError("쿠폰 코드를 입력해주세요.")
      return
    }

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
    // 실제로는 소셜 로그인 연동 API 호출
    setSocialAccounts((prev) => ({ ...prev, [provider]: true }))
    setSuccess(`${provider === "naver" ? "네이버" : "카카오"} 계정이 연동되었습니다.`)
  }

  const handleSocialDisconnect = (provider: "naver" | "kakao") => {
    // 실제로는 소셜 로그인 연동 해제 API 호출
    setSocialAccounts((prev) => ({ ...prev, [provider]: false }))
    setSuccess(`${provider === "naver" ? "네이버" : "카카오"} 계정 연동이 해제되었습니다.`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600 mx-auto mb-4"></div>
          <p>로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900">마이페이지</h1>
          <p className="text-gray-600">회원정보와 예약내역을 관리하세요</p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <User className="w-6 h-6 text-navy-600" />
              </div>
              <p className="text-sm text-gray-600">회원등급</p>
              <p className="text-lg font-bold text-navy-900">{myPageInfo?.grade}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-6 h-6 text-teal-600" />
              </div>
              <p className="text-sm text-gray-600">총 예약</p>
              <p className="text-lg font-bold text-navy-900">{myPageInfo?.totalBookings}건</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">총 결제</p>
              <p className="text-lg font-bold text-navy-900">{(myPageInfo?.totalSpent ?? 0).toLocaleString()}원</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Gift className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">보유 쿠폰</p>
              <p className="text-lg font-bold text-navy-900">{myCoupons.filter(c => c.coupon.status === "ACTIVE").length}장</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">회원정보</TabsTrigger>
            <TabsTrigger value="bookings">예약내역</TabsTrigger>
            <TabsTrigger value="coupons">쿠폰함</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <div className="space-y-6">
              {/* 기본 정보 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy-900">기본 정보</CardTitle>
                  <CardDescription>{myPageInfo?.name} 님의 기본 정보입니다</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-600">이름</Label>
                      <p className="text-lg font-medium text-navy-900">{myPageInfo?.name}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">생년월일</Label>
                      <p className="text-lg font-medium text-navy-900">{myPageInfo?.birth}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">연락처</Label>
                      <p className="text-lg font-medium text-navy-900">{myPageInfo?.phone}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">이메일</Label>
                      <p className="text-lg font-medium text-navy-900">{myPageInfo?.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 연락처 변경 */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-navy-900 flex items-center gap-2">
                        <Phone className="w-5 h-5" />
                        연락처 변경
                      </CardTitle>
                    </div>
                    <Button variant="outline" onClick={() => setEditingPhone(!editingPhone)}>
                      {editingPhone ? "취소" : "변경"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {!editingPhone ? (
                    <div>
                      <Label className="text-gray-600">현재 연락처</Label>
                      <p className="text-lg font-medium text-navy-900">{myPageInfo?.phone}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">새 연락처</Label>
                        <Input
                          id="phone"
                          value={phoneData.phone}
                          onChange={(e) => setPhoneData({ phone: e.target.value })}
                          placeholder="새 연락처를 입력하세요"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handlePhoneUpdate} className="bg-navy-600 hover:bg-navy-700">
                          변경 완료
                        </Button>
                        <Button variant="outline" onClick={() => setEditingPhone(false)}>
                          취소
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 비밀번호 변경 */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-navy-900 flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        비밀번호 변경
                      </CardTitle>
                      <CardDescription>계정 보안을 위해 정기적으로 비밀번호를 변경하세요</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setEditingPassword(!editingPassword)}>
                      {editingPassword ? "취소" : "변경"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {!editingPassword ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        비밀번호를 변경하려면 '변경' 버튼을 클릭하세요.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">현재 비밀번호</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          placeholder="현재 비밀번호를 입력하세요"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">새 비밀번호</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            placeholder="새 비밀번호를 입력하세요"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            placeholder="새 비밀번호를 다시 입력하세요"
                          />
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                        <p className="font-medium mb-1">비밀번호 조건:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>10자 이상</li>
                          <li>영문, 숫자 특수문자 포함</li>
                        </ul>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handlePasswordUpdate} className="bg-navy-600 hover:bg-navy-700">
                          변경 완료
                        </Button>
                        <Button variant="outline" onClick={() => setEditingPassword(false)}>
                          취소
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 소셜 계정 연동 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy-900 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5" />
                    소셜 계정 연동
                  </CardTitle>
                  <CardDescription>소셜 계정을 연동하여 간편하게 로그인하세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                          <span className="text-white text-sm font-bold">N</span>
                        </div>
                        <div>
                          <p className="font-medium">네이버</p>
                          <p className="text-sm text-gray-600">{socialAccounts.naver ? "연동됨" : "연동되지 않음"}</p>
                        </div>
                      </div>
                      {socialAccounts.naver ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSocialDisconnect("naver")}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Unlink className="w-4 h-4 mr-1" />
                          연동 해제
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSocialConnect("naver")}
                          className="text-green-600 hover:text-green-700"
                        >
                          <LinkIcon className="w-4 h-4 mr-1" />
                          연동하기
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
                          <span className="text-black text-sm font-bold">K</span>
                        </div>
                        <div>
                          <p className="font-medium">카카오</p>
                          <p className="text-sm text-gray-600">{socialAccounts.kakao ? "연동됨" : "연동되지 않음"}</p>
                        </div>
                      </div>
                      {socialAccounts.kakao ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSocialDisconnect("kakao")}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Unlink className="w-4 h-4 mr-1" />
                          연동 해제
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSocialConnect("kakao")}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          <LinkIcon className="w-4 h-4 mr-1" />
                          연동하기
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 회원탈퇴 */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <UserX className="w-5 h-5" />
                    회원탈퇴
                  </CardTitle>
                  <CardDescription>계정을 영구적으로 삭제합니다</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
                    <p className="text-sm text-red-800">
                      <strong>주의사항:</strong>
                      <br />• 회원탈퇴 시 모든 개인정보가 삭제됩니다
                      <br />• 예약 내역 및 쿠폰은 복구할 수 없습니다
                      <br />• 진행 중인 예약이 있는 경우 탈퇴가 제한될 수 있습니다
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <UserX className="w-4 h-4 mr-2" />
                        회원탈퇴
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>정말로 탈퇴하시겠습니까?</AlertDialogTitle>
                        <AlertDialogDescription>
                          이 작업은 되돌릴 수 없습니다. 계정과 모든 데이터가 영구적으로 삭제됩니다.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                          탈퇴하기
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-navy-900">예약내역</CardTitle>
                <CardDescription>총 {myPageInfo?.bookingHistory.length}건의 예약내역</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myPageInfo?.bookingHistory.map((booking) => (
                    <Card key={booking.id} className="border-l-4 border-l-teal-600">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={statusConfig[booking.status]?.color || "bg-gray-600"}>
                                {statusConfig[booking.status]?.text || booking.status}
                              </Badge>
                            </div>
                            <h3 className="text-lg font-semibold text-navy-900">{booking.productName}</h3>
                            <p className="text-sm text-gray-600">예약번호: {booking.id}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-navy-900">{(booking.totalPrice ?? 0).toLocaleString()}원</p>
                            <p className="text-sm text-gray-600">{booking.counts}명</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">여행일</p>
                            <p className="font-medium">{booking.travelDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">예약일</p>
                            <p className="font-medium">{new Date(booking.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                상세보기
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>예약 상세정보</DialogTitle>
                                <DialogDescription>예약번호: {booking.id}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold text-navy-900 mb-2">예약 정보</h4>
                                    <p>상품: {booking.productName}</p>
                                    <p>여행일: {booking.travelDate}</p>
                                    <p>인원: {booking.counts}명</p>
                                    <p>금액: {(booking.totalPrice ?? 0).toLocaleString()}원</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-navy-900 mb-2">예약자 정보</h4>
                                    <p>이름: {myPageInfo?.name}</p>
                                    <p>이메일: {myPageInfo?.email}</p>
                                    <p>연락처: {myPageInfo?.phone}</p>
                                  </div>
                                </div>
                                {booking.specialRequests && (
                                  <div>
                                    <h4 className="font-semibold text-navy-900 mb-2">특별 요청사항</h4>
                                    <p className="bg-gray-50 p-3 rounded">{booking.specialRequests}</p>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>

                          {(booking.status === "PAYMENT_COMPLETED" || booking.status === "PAYMENT_PENDING") && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              <X className="w-4 h-4 mr-1" />
                              취소요청
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {(!myPageInfo?.bookingHistory || myPageInfo.bookingHistory.length === 0) && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">예약내역이 없습니다.</p>
                    <Button asChild className="bg-teal-600 hover:bg-teal-700">
                      <a href="/">여행 상품 둘러보기</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coupons" className="mt-6">
            <div className="space-y-6">
              {/* 쿠폰 등록 */}
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

              {/* 보유 쿠폰 목록 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy-900">보유 쿠폰</CardTitle>
                  <CardDescription>
                    총 {myCoupons.length}장의 쿠폰 (사용 가능: {myCoupons.filter(c => c.coupon.status === "ACTIVE").length}장)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                      {myCoupons.map((userCoupon) => {
                          const c = userCoupon.coupon
                          return (
                              <Card key={userCoupon.userCouponId} className={`${c.status === "USED" ? "opacity-50" : ""}`}>
                                  <CardContent className="p-4">
                                      <div className="flex justify-between items-start">
                                          <div className="flex-1">
                                              <div className="flex items-center gap-2 mb-2">
                                                  <Badge className={c.status === "ACTIVE" ? "bg-green-600" : "bg-gray-600"}>
                                                      {c.status === "ACTIVE" ? "사용가능" : "사용불가"}
                                                  </Badge>
                                              </div>
                                              <h4 className="font-semibold text-navy-900 mb-1">{c.description}</h4>
                                              <div className="text-sm text-gray-600">
                                                  {c.discountType === "FIXED_AMOUNT" ? (
                                                      <p>할인금액: {c.discountAmount.toLocaleString()}원</p>
                                                  ) : (
                                                      <p>할인율: {c.discountRate}% (최대 {(c.maxDiscountAmount ?? 0).toLocaleString()}원)</p>
                                                  )}
                                                  <p>유효기간: {c.expiryDate}</p>
                                              </div>
                                          </div>
                                          <div className="text-right">
                                              {c.discountType === "FIXED_AMOUNT" ? (
                                                  <p className="text-xl font-bold text-red-600">{(c.discountAmount ?? 0).toLocaleString()}원</p>
                                              ) : (
                                                  <p className="text-xl font-bold text-red-600">{c.discountRate}%</p>
                                              )}
                                          </div>
                                      </div>
                                  </CardContent>
                              </Card>
                          )
                      })}
                  </div>
                  {myCoupons.length === 0 && (
                    <div className="text-center py-12">
                      <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">보유한 쿠폰이 없습니다.</p>
                      <p className="text-sm text-gray-400">쿠폰 코드를 입력하여 새로운 쿠폰을 등록해보세요.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
