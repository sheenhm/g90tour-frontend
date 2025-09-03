"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Bell, Calendar, Eye, ChevronRight } from "lucide-react"
import { supportApi, type Notice } from "@/lib/api"

const categories = [
    { id: "all", name: "전체" },
    { id: "이벤트", name: "이벤트" },
    { id: "시스템", name: "시스템" },
    { id: "서비스", name: "서비스" },
    { id: "운영", name: "운영" },
    { id: "정책", name: "정책" },
    { id: "예약", name: "예약" },
]

const categoryColors: { [key: string]: string } = {
    이벤트: "bg-red-600",
    시스템: "bg-blue-600",
    서비스: "bg-green-600",
    운영: "bg-yellow-600",
    정책: "bg-purple-600",
    예약: "bg-teal-600",
}

export default function NoticePage() {
    const [notices, setNotices] = useState<Notice[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                setIsLoading(true)
                const data = await supportApi.getNotices()
                setNotices(data)
            } catch (error) {
                console.error("Failed to fetch notices:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchNotices()
    }, [])

    const filteredNotices = notices.filter((notice) => {
        const matchesSearch =
            notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notice.content.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === "all" || notice.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const sortedNotices = filteredNotices.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    const totalPages = Math.ceil(sortedNotices.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedNotices = sortedNotices.slice(startIndex, startIndex + itemsPerPage)

    const handleViewNotice = (noticeId: number) => {
        console.log("Viewing notice:", noticeId)
    }

    const getCategoryCount = (category: string) => {
        if (category === 'all') return notices.length;
        return notices.filter(n => n.category === category).length;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-navy-900 to-teal-800 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <Bell className="w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold mb-4">공지사항</h1>
                    <p className="text-xl text-gray-200">G90의 최신 소식과 중요한 안내사항을 확인하세요</p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16">
                {/* Search */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                placeholder="공지사항을 검색해보세요..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Categories */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-navy-900">카테고리</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {categories.map((category) => (
                                    <Button
                                        key={category.id}
                                        variant={selectedCategory === category.id ? "default" : "ghost"}
                                        className={`w-full justify-between ${
                                            selectedCategory === category.id ? "bg-navy-600 hover:bg-navy-700" : "hover:bg-gray-100"
                                        }`}
                                        onClick={() => {
                                            setSelectedCategory(category.id)
                                            setCurrentPage(1)
                                        }}
                                    >
                                        <span>{category.name}</span>
                                        <Badge variant="secondary" className="ml-2">
                                            {getCategoryCount(category.id)}
                                        </Badge>
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Notice List */}
                    <div className="lg:col-span-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-navy-900">
                                    {selectedCategory === "all"
                                        ? "전체 공지사항"
                                        : categories.find((c) => c.id === selectedCategory)?.name}
                                </CardTitle>
                                <CardDescription>총 {filteredNotices.length}개의 공지사항</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600 mx-auto mb-4"></div>
                                        <p>공지사항을 불러오는 중입니다...</p>
                                    </div>
                                ) : paginatedNotices.length > 0 ? (
                                    <div className="space-y-4">
                                        {paginatedNotices.map((notice) => (
                                            <Card
                                                key={notice.id}
                                                className="cursor-pointer hover:shadow-md transition-shadow"
                                                onClick={() => handleViewNotice(notice.id)}
                                            >
                                                <CardContent className="p-6">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <Badge className={categoryColors[notice.category] || "bg-gray-600"}>
                                                                {notice.category}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                                            <div className="flex items-center gap-1">
                                                                <Eye className="w-4 h-4" />
                                                                <span>{notice.views.toLocaleString()}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="w-4 h-4" />
                                                                <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <h3 className="text-lg font-semibold text-navy-900 mb-2 hover:text-teal-600 transition-colors">
                                                        {notice.title}
                                                    </h3>

                                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{notice.content}</p>

                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-500">작성자: 관리자</span>
                                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 mb-4">검색 결과가 없습니다.</p>
                                        <Button
                                            variant="outline"
                                            className="bg-transparent"
                                            onClick={() => {
                                                setSearchTerm("")
                                                setSelectedCategory("all")
                                                setCurrentPage(1)
                                            }}
                                        >
                                            전체 보기
                                        </Button>
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 mt-8">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                        >
                                            이전
                                        </Button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <Button
                                                key={page}
                                                variant={currentPage === page ? "default" : "outline"}
                                                size="sm"
                                                className={currentPage === page ? "bg-navy-600 hover:bg-navy-700" : "bg-transparent"}
                                                onClick={() => setCurrentPage(page)}
                                            >
                                                {page}
                                            </Button>
                                        ))}

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                        >
                                            다음
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}