"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User as UserIcon, Mail, Phone, Cake, Calendar, LogIn, Crown, Wallet, AlertTriangle } from "lucide-react"
import { User } from "@/lib/api"
import { adminUserApi } from "@/lib/admin"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"

// 정보 항목을 렌더링하기 위한 헬퍼 컴포넌트
function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
    return (
        <div className="flex items-center gap-4 text-sm">
            <div className="flex-shrink-0 text-gray-500">{icon}</div>
            <div className="flex-1">
                <p className="font-medium text-gray-700">{label}</p>
                <p className="text-gray-900">{value}</p>
            </div>
        </div>
    )
}

export function UserDetailDialog({ user }: { user: User }) {
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false) // Dialog open state

    const handleDeactivate = async () => {
        try {
            setIsLoading(true)
            await adminUserApi.deactivate(user.id)
            // 성공 시 Toast 등으로 알림 후, 부모 컴포넌트에서 목록을 새로고침하도록 유도하는 것이 좋습니다.
            // 여기서는 간단히 alert 후 창을 닫습니다.
            alert("회원이 비활성화되었습니다.")
            setIsOpen(false)
            window.location.reload(); // 목록을 새로고침하기 위해 페이지 리로드
        } catch (err) {
            console.error(err)
            alert("비활성화 실패. 다시 시도해주세요.")
        } finally {
            setIsLoading(false)
        }
    }

    // 등급에 따른 뱃지 색상
    const getGradeBadgeVariant = (grade: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (grade) {
            case 'GOLD': return "default"
            case 'SILVER': return "secondary"
            case 'BRONZE':
            default: return "outline"
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    상세보기
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl p-0">
                <DialogHeader className="p-6 pb-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-3 rounded-full">
                            <UserIcon className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-gray-800">{user.name}</DialogTitle>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                    </div>
                </DialogHeader>
                <Separator />
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                    {/* 기본 정보 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">기본 정보</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <InfoItem icon={<Mail size={18} />} label="이메일" value={user.email} />
                            <InfoItem icon={<Phone size={18} />} label="전화번호" value={user.phone} />
                            <InfoItem icon={<Cake size={18} />} label="생년월일" value={user.birth || "미입력"} />
                        </CardContent>
                    </Card>

                    {/* 활동 정보 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">활동 정보</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <InfoItem icon={<Calendar size={18} />} label="가입일" value={new Date(user.createdAt).toLocaleDateString()} />
                            <InfoItem icon={<LogIn size={18} />} label="최근 로그인" value={user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "기록 없음"} />
                        </CardContent>
                    </Card>

                    {/* 회원 등급 및 결제 정보 */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">멤버십 정보</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <Crown className="w-8 h-8 text-yellow-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">회원 등급</p>
                                    <Badge variant={getGradeBadgeVariant(user.grade)} className="text-base">{user.grade}</Badge>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <Wallet className="w-8 h-8 text-green-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">총 결제액</p>
                                    <p className="text-xl font-semibold">{user.totalSpent.toLocaleString()}원</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Separator />
                <div className="p-6 flex justify-between items-center bg-gray-50">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={isLoading}>
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                {isLoading ? "처리중..." : "회원 비활성화"}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>정말 비활성화하시겠습니까?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    이 작업은 되돌릴 수 없습니다. {user.name} 회원의 계정이 비활성화되며, 더 이상 로그인할 수 없게 됩니다.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>취소</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeactivate} className="bg-red-600 hover:bg-red-700">
                                    비활성화
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <DialogClose asChild>
                        <Button variant="outline">닫기</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}