"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Bell, Calendar, Eye, Pin, Newspaper } from "lucide-react"
import { supportApi, type Notice } from "@/lib/api"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

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
    이벤트: "bg-red-500 text-white",
    시스템: "bg-blue-500 text-white",
    서비스: "bg-green-500 text-white",
    운영: "bg-yellow-500 text-white",
    정책: "bg-purple-500 text-white",
    예약: "bg-teal-500 text-white",
}

export default function NoticePage() {
    const [notices, setNotices] = useState<Notice[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 7

    const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                setIsLoading(true)
                const response = await supportApi.getNotices()
                setNotices(Array.isArray(response) ? response : response.content ?? [])
            } catch (error) {
                console.error("Failed to fetch notices:", error)
                setNotices([]) // 실패 시 빈 배열
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

    const sortedNotices = [...filteredNotices].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    const totalPages = Math.ceil(sortedNotices.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedNotices = sortedNotices.slice(startIndex, startIndex + itemsPerPage)

    const handleViewNotice = (notice: Notice) => {
        setSelectedNotice(notice)
        setIsDetailOpen(true)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative h-[400px] w-full flex items-center justify-center">
                <Image
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop"
                    alt="Notice board"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 container mx-auto px-4 text-center text-white">
                    <Bell className="w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">공지사항</h1>
                    <p className="text-lg md:text-xl text-gray-200">G90 투어의 최신 소식과 중요한 정보를 확인하세요.</p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 max-w-5xl">
                {/* Search */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                        placeholder="제목 또는 내용으로 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 h-12 text-lg rounded-full shadow-md"
                    />
                </div>

                {/* Category Tabs & Notice List */}
                <Card>
                    <CardContent className="p-6">
                        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 mb-6">
                                {categories.map((category) => (
                                    <TabsTrigger key={category.id} value={category.id}>
                                        {category.name}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            <TabsContent value={selectedCategory}>
                                {isLoading ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600 mx-auto mb-4"></div>
                                        <p>공지사항을 불러오는 중입니다...</p>
                                    </div>
                                ) : paginatedNotices.length > 0 ? (
                                    <div className="divide-y divide-gray-200">
                                        {paginatedNotices.map((notice) => (
                                            <div
                                                key={notice.id}
                                                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                                                onClick={() => handleViewNotice(notice)}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            {notice.pinned && <Pin className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                                                            <Badge className={categoryColors[notice.category] || "bg-gray-600 text-white"}>
                                                                {notice.category}
                                                            </Badge>
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-navy-900 mb-2 hover:text-teal-600">
                                                            {notice.title}
                                                        </h3>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                                            <div className="flex items-center gap-1.5">
                                                                <Calendar className="w-4 h-4" />
                                                                <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Eye className="w-4 h-4" />
                                                                <span>{notice.views.toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20">
                                        <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 mb-2">해당 카테고리에 공지사항이 없습니다.</p>
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                setSearchTerm("")
                                                setSelectedCategory("all")
                                            }}
                                        >
                                            전체 공지사항 보기
                                        </Button>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>

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
                                <span className="text-sm text-gray-600">
                                    Page {currentPage} of {totalPages}
                                </span>
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

            {/* Notice Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-3xl">
                    {selectedNotice && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    {selectedNotice.pinned && <Pin className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                                    <Badge className={categoryColors[selectedNotice.category] || "bg-gray-600 text-white"}>
                                        {selectedNotice.category}
                                    </Badge>
                                </div>
                                <DialogTitle className="text-2xl text-navy-900">{selectedNotice.title}</DialogTitle>
                                <DialogDescription className="flex items-center gap-4 pt-2">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(selectedNotice.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Eye className="w-4 h-4" />
                                        <span>{selectedNotice.views.toLocaleString()}</span>
                                    </div>
                                </DialogDescription>
                            </DialogHeader>
                            <Separator className="my-4" />
                            <div className="prose max-w-none max-h-[50vh] overflow-y-auto text-gray-700">
                                <p>{selectedNotice.content}</p>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}