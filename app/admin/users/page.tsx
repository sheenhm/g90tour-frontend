"use client"

import { useEffect, useMemo, useState } from "react"
import { LogIn, Mail, Phone, Search, UserPlus, Users } from "lucide-react"
import { adminUserApi, AdminUsersPageResponse } from "@/lib/admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { UserDetailDialog } from "./UserDetailDialog"

export default function AdminUsersPage() {
    const [usersPage, setUsersPage] = useState<AdminUsersPageResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(0)
    const pageSize = 20

    const fetchUsers = async (page: number = 0) => {
        setIsLoading(true)
        setError(null)
        try {
            const res: AdminUsersPageResponse = await adminUserApi.getAll(page, pageSize)
            setUsersPage(res)
            setCurrentPage(page)
        } catch (err) {
            setError("회원 정보를 불러오는 데 실패했습니다.")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers(0)
    }, [])

    const filteredUsers = useMemo(() => {
        if (!usersPage) return []
        return usersPage.content.filter((user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.includes(searchTerm)
        )
    }, [usersPage, searchTerm])

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="mb-4 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-navy-900">회원 관리</h1>
                <p className="text-gray-600 md:text-base">회원 정보를 조회하고 관리하세요</p>
            </div>

            {/* 상단 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
                {/* 전체 회원 */}
                <Card>
                    <CardContent className="p-4 md:p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm md:text-base text-gray-600">전체 회원</p>
                            {isLoading ? (
                                <Skeleton className="h-6 md:h-8 w-16 md:w-24" />
                            ) : (
                                <p className="text-xl md:text-2xl font-bold text-navy-900">{usersPage?.content.length || 0}명</p>
                            )}
                        </div>
                        <div className="w-8 h-8 bg-navy-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-navy-600" />
                        </div>
                    </CardContent>
                </Card>

                {/* 이번 달 가입 */}
                <Card>
                    <CardContent className="p-4 md:p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm md:text-base text-gray-600">이번 달 가입</p>
                            {isLoading ? (
                                <Skeleton className="h-6 md:h-8 w-16 md:w-24" />
                            ) : (
                                <p className="text-xl md:text-2xl font-bold text-teal-600">
                                    {usersPage?.content.filter(u => {
                                        const joinDate = new Date(u.createdAt)
                                        const today = new Date()
                                        return joinDate.getFullYear() === today.getFullYear() &&
                                            joinDate.getMonth() === today.getMonth()
                                    }).length || 0}명
                                </p>
                            )}
                        </div>
                        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                            <UserPlus className="w-4 h-4 text-teal-600" />
                        </div>
                    </CardContent>
                </Card>

                {/* 오늘 로그인 */}
                <Card>
                    <CardContent className="p-4 md:p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm md:text-base text-gray-600">오늘 로그인</p>
                            {isLoading ? (
                                <Skeleton className="h-6 md:h-8 w-16 md:w-24" />
                            ) : (
                                <p className="text-xl md:text-2xl font-bold text-purple-600">
                                    {usersPage?.content.filter(u => {
                                        if (!u.lastLoginAt) return false
                                        const loginDate = new Date(u.lastLoginAt)
                                        const today = new Date()
                                        return loginDate.getFullYear() === today.getFullYear() &&
                                            loginDate.getMonth() === today.getMonth() &&
                                            loginDate.getDate() === today.getDate()
                                    }).length || 0}명
                                </p>
                            )}
                        </div>
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <LogIn className="w-4 h-4 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 검색창 */}
            <Card className="mb-4 md:mb-6">
                <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="이름, 이메일, 연락처로 검색"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 회원 목록 */}
            <Card>
                <CardHeader>
                    <CardTitle>회원 목록</CardTitle>
                    <CardDescription>총 {filteredUsers.length}명의 회원</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg gap-3">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="w-12 h-12 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-48" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-right">
                                        <Skeleton className="h-3 w-24 ml-auto" />
                                        <Skeleton className="h-4 w-16 ml-auto" />
                                    </div>
                                </div>
                            ))
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <div key={user.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg gap-3">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-navy-100 rounded-full flex items-center justify-center">
                                            <span className="text-navy-600 font-semibold">{user.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-semibold text-navy-900 md:text-base">{user.name}</h3>
                                                <Badge className="bg-teal-600">{user.grade}</Badge>
                                                {user.role === "ADMIN" && <Badge className="bg-orange-500 md:text-sm">관리자</Badge>}
                                            </div>
                                            <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-sm text-gray-600 mt-1">
                                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{user.email}</span>
                                                <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{user.phone}</span>
                                                <span>가입: {user.createdAt}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 md:mt-0">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">최근 로그인: {user.lastLoginAt || "로그인 기록 없음"}</p>
                                            <p className="font-medium text-navy-900">{user.totalSpent.toLocaleString()}원</p>
                                        </div>
                                        <UserDetailDialog user={user} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500">검색 결과가 없습니다.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* 페이지네이션 */}
            <div className="flex justify-center gap-4 mt-4">
                <button
                    className="px-4 py-2 border rounded disabled:opacity-50"
                    disabled={currentPage === 0}
                    onClick={() => fetchUsers(currentPage - 1)}
                >
                    이전
                </button>
                <span className="px-2 py-2">{currentPage + 1} / {usersPage?.totalPages || 1}</span>
                <button
                    className="px-4 py-2 border rounded disabled:opacity-50"
                    disabled={currentPage === (usersPage?.totalPages || 1) - 1}
                    onClick={() => fetchUsers(currentPage + 1)}
                >
                    다음
                </button>
            </div>
        </div>
    )
}