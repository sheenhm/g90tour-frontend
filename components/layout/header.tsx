"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Menu,
    User as UserIcon,
    Search,
    Phone,
    LogOut,
    UserCircle,
    Building2,
} from "lucide-react"
import type { User } from "@/lib/api"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
    { name: "호텔", href: "/hotels" },
    { name: "골프", href: "/golf" },
    { name: "패키지", href: "/tours" },
    { name: "스파", href: "/spa" },
    { name: "액티비티", href: "/activities" },
    { name: "차량", href: "/vehicles" },
    { name: "고객센터", href: "/support" },
]

function SearchModal({
                         isOpen,
                         onOpenChange,
                     }: {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}) {
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
        return (
            <div className="border-t pt-4 mt-4 space-y-2">
                {user ? (
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
                ) : (
                    <>
                        <Link href="/login" className="block text-lg py-2" onClick={closeMenu}>
                            로그인
                        </Link>
                        <Link href="/signup" className="block text-lg py-2" onClick={closeMenu}>
                            회원가입
                        </Link>
                    </>
                )}
                <div className="flex items-center gap-2 text-gray-600 pt-4 border-t">
                    <Phone className="w-4 h-4" />
                    <span>02-2662-2110</span>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <Button asChild variant="ghost" className="text-inherit">
                    <Link href="/login">로그인</Link>
                </Button>
                <Button asChild className="bg-teal-600 hover:bg-teal-700">
                    <Link href="/signup">회원가입</Link>
                </Button>
            </div>
        )
    }

    return null
}

export default function Header() {
    const { user, isLoading, logout } = useAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const pathname = usePathname()

    const headerClasses = cn(
        "sticky top-0 z-50 transition-all duration-300", "bg-white/95 shadow-md backdrop-blur-sm"
    )

    const linkClasses = cn(
        "font-medium transition-colors", "text-gray-700 hover:text-primary"
    )

    const iconButtonClasses = cn(
        "text-gray-700 hover:text-primary"
    )

    return (
        <>
            <header className={headerClasses}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src="/logo.png"
                                alt="G90 TOUR"
                                height={48}
                                className="h-12 w-auto"
                                priority
                            />
                            <span
                                className={cn(
                                    "text-xl font-bold hidden sm:inline transition-colors", "text-gray-900"
                                )}
                            >
                                지구공투어
                            </span>
                        </Link>

                        <nav className="hidden lg:flex items-center space-x-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        linkClasses,
                                        "relative group",
                                        pathname === item.href && "font-semibold",
                                    )}
                                >
                                    {item.name}
                                    <span className={cn(
                                        "absolute bottom-0 left-0 h-0.5 bg-teal-500 w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300",
                                        pathname === item.href && "scale-x-100",
                                    )} />
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn("hidden md:flex", iconButtonClasses)}
                                aria-label="검색"
                                onClick={() => setIsSearchOpen(true)}
                            >
                                <Search className="w-5 h-5" />
                            </Button>

                            {!isLoading && (
                                <div className="hidden md:flex">
                                    {user ? (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={iconButtonClasses}
                                                    aria-label="사용자 메뉴"
                                                >
                                                    <UserIcon className="w-5 h-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuLabel>
                                                    안녕하세요, {user.name}님!
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link href="/mypage">마이페이지</Link>
                                                </DropdownMenuItem>
                                                {user.role === "ADMIN" && (
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href="/admin"
                                                            className="font-semibold text-primary"
                                                        >
                                                            관리자 페이지
                                                        </Link>
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={logout}>
                                                    로그아웃
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    ) : (
                                        <AuthLinks user={null} logout={() => {}} />
                                    )}
                                </div>
                            )}

                            <Sheet
                                open={isMobileMenuOpen}
                                onOpenChange={setIsMobileMenuOpen}
                            >
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn("lg:hidden", iconButtonClasses)}
                                        aria-label="메뉴 열기"
                                    >
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
                                        <AuthLinks
                                            user={user}
                                            logout={logout}
                                            isMobile
                                            closeMenu={() => setIsMobileMenuOpen(false)}
                                        />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>

            <SearchModal isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} />
        </>
    )
}