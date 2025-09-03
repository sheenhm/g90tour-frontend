"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import axios from "axios"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Menu, User as UserIcon, Search, Phone, LogOut, UserCircle, Building2 } from "lucide-react"
import { authApi } from "@/lib/api"
import type { User } from "@/lib/api"

const navigation = [
    { name: "호텔", href: "/hotels" },
    { name: "골프", href: "/golf" },
    { name: "패키지", href: "/tours" },
    { name: "스파", href: "/spa" },
    { name: "액티비티", href: "/activities" },
    { name: "차량", href: "/vehicles" },
    { name: "고객센터", href: "/support" },
]

// 검색 모달 컴포넌트
function SearchModal({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>통합 검색</DialogTitle>
                    <DialogDescription>
                        찾고 싶은 호텔, 골프장, 투어 등을 검색해 보세요.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="relative">
                        <Input
                            id="search"
                            placeholder="예: 다낭, 멜리아 호텔"
                            className="pl-10"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
                <Button type="submit">검색하기</Button>
            </DialogContent>
        </Dialog>
    )
}

// AuthLinks (모바일 및 비로그인 Top Bar 처리)
function AuthLinks({
                       user,
                       logout,
                       isMobile = false,
                       closeMenu,
                   }: {
    user: User | null
    logout: () => void
    isMobile?: boolean
    closeMenu?: () => void
}) {
    if (isMobile) {
        if (user) {
            return (
                <>
                    <Link
                        href="/mypage"
                        className="block text-lg py-2 hover:text-primary flex items-center gap-2"
                        onClick={closeMenu}
                    >
                        <UserCircle className="w-5 h-5" /> 마이페이지
                    </Link>
                    {user.role === "ADMIN" && (
                        <Link
                            href="/admin"
                            className="block text-lg py-2 font-semibold text-primary hover:text-primary/90 flex items-center gap-2"
                            onClick={closeMenu}
                        >
                            <Building2 className="w-5 h-5" /> 관리자 페이지
                        </Link>
                    )}
                    <button
                        onClick={() => {
                            logout()
                            closeMenu?.()
                        }}
                        className="block text-lg py-2 text-left w-full hover:text-primary flex items-center gap-2"
                    >
                        <LogOut className="w-5 h-5" /> 로그아웃
                    </button>
                </>
            )
        }
        return (
            <>
                <Link href="/login" className="block text-lg py-2" onClick={closeMenu}>
                    로그인
                </Link>
                <Link href="/signup" className="block text-lg py-2" onClick={closeMenu}>
                    회원가입
                </Link>
            </>
        )
    }

    if (!user) {
        return (
            <div className="flex items-center gap-4">
                <Link href="/login" className="text-gray-600 hover:text-primary">로그인</Link>
                <Link href="/signup" className="text-gray-600 hover:text-primary">회원가입</Link>
            </div>
        )
    }

    return null
}

// Header 컴포넌트
export default function Header() {
    const { user, isAuthenticated, isLoading, logout } = useAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    return (
        <>
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/80 sticky top-0 z-40">
                <div className="container mx-auto px-4">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between py-2 text-sm border-b">
                        <div className="flex items-center gap-4 text-gray-600">
                            <div className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                <span>02-2662-2110</span>
                            </div>
                            <span className="hidden sm:block">평일 09:00-18:00 (한국시간 기준)</span>
                        </div>
                        {!isLoading && (
                            <div className="hidden md:flex">
                                <AuthLinks user={user} logout={logout} />
                            </div>
                        )}
                    </div>

                    {/* Main Header */}
                    <div className="flex items-center justify-between py-4">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/logo.png"
                                alt="G90 Entertainment Tour"
                                width={120}
                                height={60}
                                className="h-12 w-auto"
                                priority
                            />
                            <span className="text-xl font-bold text-gray-900 hidden sm:inline">지구공투어</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-700 hover:text-primary font-medium transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            <Button variant="ghost" size="icon" className="hidden md:flex" aria-label="검색" onClick={() => setIsSearchOpen(true)}>
                                <Search className="w-5 h-5" />
                            </Button>

                            {/* 데스크탑 유저 메뉴 */}
                            {!isLoading && (
                                <div className="hidden md:flex">
                                    {user ? (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" aria-label="사용자 메뉴">
                                                    <UserIcon className="w-5 h-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuLabel>안녕하세요, {user.name}님!</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link href="/mypage" className="cursor-pointer">마이페이지</Link>
                                                </DropdownMenuItem>
                                                {user.role === "ADMIN" && (
                                                    <DropdownMenuItem asChild>
                                                        <Link href="/admin" className="cursor-pointer font-semibold text-primary">관리자 페이지</Link>
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={logout} className="cursor-pointer">로그아웃</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    ) : (
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href="/login" aria-label="로그인">
                                                <UserIcon className="w-5 h-5" />
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            )}

                            {/* Mobile Menu */}
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="lg:hidden" aria-label="메뉴 열기">
                                        <Menu className="w-6 h-6" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-full max-w-sm">
                                    <div className="flex flex-col space-y-2 mt-8">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="text-lg font-medium text-gray-700 hover:text-primary py-2 px-2 rounded-md"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                        <div className="border-t pt-4 mt-4">
                                            <AuthLinks
                                                user={user}
                                                logout={logout}
                                                isMobile
                                                closeMenu={() => setIsMobileMenuOpen(false)}
                                            />
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>

            {/* 검색 모달 */}
            <SearchModal isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} />
        </>
    )
}