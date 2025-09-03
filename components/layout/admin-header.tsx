"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, User as UserIcon, Settings, LogOut, Menu } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authApi, User as UserType } from "@/lib/api"

interface AdminHeaderProps {
    user?: UserType | null
}

export default function AdminHeader({ user }: AdminHeaderProps) {
    const router = useRouter()
    const [notifications] = useState([
        { id: 1, message: "새로운 예약이 접수되었습니다", time: "5분 전", unread: true },
        { id: 2, message: "고객 문의가 등록되었습니다", time: "1시간 전", unread: true },
        { id: 3, message: "결제가 완료되었습니다", time: "2시간 전", unread: false },
    ])
    const unreadCount = notifications.filter((n) => n.unread).length

    const handleLogout = () => {
        authApi.logout()
        router.push("/login")
    }

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="lg:hidden">
                        <Menu className="w-5 h-5" />
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    {/* 알림 */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="relative">
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-600 text-xs">
                                        {unreadCount}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <DropdownMenuLabel>알림</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {notifications.map((notification) => (
                                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
                                    <div className="flex items-center justify-between w-full">
                    <span className={`text-sm ${notification.unread ? "font-medium" : "text-gray-600"}`}>
                      {notification.message}
                    </span>
                                        {notification.unread && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1">{notification.time}</span>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/admin/notifications" className="text-center w-full">
                                    모든 알림 보기
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* 프로필 */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-navy-600 rounded-full flex items-center justify-center">
                                    <UserIcon className="w-4 h-4 text-white" />
                                </div>
                                <span className="hidden md:block">
                                    {user?.name ?? "관리자"}
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/admin/profile">
                                    <UserIcon className="w-4 h-4 mr-2" />
                                    프로필
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                                <LogOut className="w-4 h-4 mr-2" />
                                로그아웃
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}