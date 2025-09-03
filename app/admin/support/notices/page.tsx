"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Search, Eye, Calendar, TrendingUp, Loader2 } from "lucide-react"
import { adminNoticeApi, Notice, NoticeCreateRequest } from "@/lib/admin"

// 초기 폼 상태 정의
const initialFormState: NoticeCreateRequest = {
    title: "",
    content: "",
    category: "공지",
    active: true,
    pinned: false,
}

export default function AdminNoticesPage() {
    // --- 상태 관리 (State Management) ---
    const [notices, setNotices] = useState<Notice[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")

    // Dialog(팝업) 상태
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    // 공지사항 폼 및 수정 대상 상태
    const [editingNotice, setEditingNotice] = useState<Notice | null>(null)
    const [noticeForm, setNoticeForm] = useState<NoticeCreateRequest>(initialFormState)

    // --- 데이터 페칭 (Data Fetching) ---
    const fetchNotices = async () => {
        try {
            setIsLoading(true)
            const data = await adminNoticeApi.getAll()
            setNotices(data.sort((a, b) => b.id - a.id))
        } catch (error) {
            console.error("Failed to fetch notices:", error)
            // 사용자에게 에러 알림을 보여주는 로직을 추가할 수 있습니다 (e.g., Toast)
        } finally {
            setIsLoading(false)
        }
    }

    // 컴포넌트 마운트 시 공지사항 목록을 불러옵니다.
    useEffect(() => {
        fetchNotices()
    }, [])

    // --- 이벤트 핸들러 (Event Handlers) ---
    const resetFormAndCloseDialog = () => {
        setNoticeForm(initialFormState)
        setEditingNotice(null)
        setIsAddDialogOpen(false)
        setIsEditDialogOpen(false)
    }

    // 공지사항 추가
    const handleAddNotice = async () => {
        if (!noticeForm.title || !noticeForm.content) {
            alert("제목과 내용은 필수 입력 항목입니다.");
            return;
        }
        try {
            await adminNoticeApi.create(noticeForm)
            resetFormAndCloseDialog()
            await fetchNotices() // 목록 새로고침
        } catch (error) {
            console.error("Failed to create notice:", error)
            alert("공지사항 등록에 실패했습니다.")
        }
    }

    // 수정 모드 시작
    const handleEditClick = (notice: Notice) => {
        setEditingNotice(notice)
        setNoticeForm({
            title: notice.title,
            content: notice.content,
            category: notice.category,
            active: notice.active,
            pinned: notice.pinned,
        })
        setIsEditDialogOpen(true)
    }

    // 공지사항 수정
    const handleUpdateNotice = async () => {
        if (!editingNotice) return
        if (!noticeForm.title || !noticeForm.content) {
            alert("제목과 내용은 필수 입력 항목입니다.");
            return;
        }
        try {
            await adminNoticeApi.update(editingNotice.id, noticeForm)
            resetFormAndCloseDialog()
            await fetchNotices() // 목록 새로고침
        } catch (error) {
            console.error("Failed to update notice:", error)
            alert("공지사항 수정에 실패했습니다.")
        }
    }

    // 공지사항 삭제
    const handleDeleteNotice = async (noticeId: number) => {
        if (window.confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
            try {
                await adminNoticeApi.delete(noticeId)
                await fetchNotices() // 목록 새로고침
            } catch (error) {
                console.error("Failed to delete notice:", error)
                alert("공지사항 삭제에 실패했습니다.")
            }
        }
    }

    // --- 데이터 필터링 및 가공 ---
    const filteredNotices = notices.filter((notice) => {
        const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === "all" || notice.category === categoryFilter
        return matchesSearch && matchesCategory
    })

    const getStatusBadge = (active: boolean | undefined) => {
        if (active) {
            return <Badge className="bg-green-600">게시중</Badge>
        }
        return <Badge className="bg-gray-600">게시중지</Badge>
    }

    // --- 재사용 UI 컴포넌트 ---
    const NoticeForm = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="title">제목 *</Label>
                    <Input
                        id="title"
                        value={noticeForm.title}
                        onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                        placeholder="공지사항 제목을 입력하세요"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">카테고리 *</Label>
                    <Select
                        value={noticeForm.category}
                        onValueChange={(value) => setNoticeForm({ ...noticeForm, category: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="카테고리 선택" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="공지">공지</SelectItem>
                            <SelectItem value="이벤트">이벤트</SelectItem>
                            <SelectItem value="시스템">시스템</SelectItem>
                            <SelectItem value="서비스">서비스</SelectItem>
                            <SelectItem value="기타">기타</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="md:col-span-2 space-y-2">
                <Label htmlFor="content">내용 *</Label>
                <Textarea
                    id="content"
                    value={noticeForm.content}
                    onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                    placeholder="공지사항 내용을 입력하세요"
                    rows={8}
                />
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                        <Label htmlFor="active" className="font-semibold">공지 활성화</Label>
                        <p className="text-sm text-gray-500">활성화 시 고객에게 공지가 노출됩니다.</p>
                    </div>
                    <Switch
                        id="active"
                        checked={noticeForm.active}
                        onCheckedChange={(checked) => setNoticeForm({ ...noticeForm, active: checked })}
                    />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                        <Label htmlFor="pinned" className="font-semibold">상단 고정</Label>
                        <p className="text-sm text-gray-500">활성화 시 공지사항 목록 최상단에 고정됩니다.</p>
                    </div>
                    <Switch
                        id="pinned"
                        checked={noticeForm.pinned}
                        onCheckedChange={(checked) => setNoticeForm({ ...noticeForm, pinned: checked })}
                    />
                </div>
            </div>
        </div>
    )

    // --- 메인 렌더링 ---
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-navy-900">공지사항 관리</h1>
                    <p className="text-gray-600">고객에게 전달할 공지사항을 작성하고 관리하세요</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-navy-600 hover:bg-navy-700" onClick={() => setNoticeForm(initialFormState)}>
                            <Plus className="w-4 h-4 mr-2" />
                            공지사항 작성
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>새 공지사항 작성</DialogTitle>
                            <DialogDescription>고객에게 전달할 공지사항을 작성해주세요</DialogDescription>
                        </DialogHeader>
                        <NoticeForm />
                        <div className="flex justify-end gap-2 mt-6">
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                취소
                            </Button>
                            <Button onClick={handleAddNotice} className="bg-navy-600 hover:bg-navy-700">
                                공지사항 등록
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>공지사항 수정</DialogTitle>
                        <DialogDescription>공지사항 정보를 수정해주세요</DialogDescription>
                    </DialogHeader>
                    <NoticeForm />
                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            취소
                        </Button>
                        <Button onClick={handleUpdateNotice} className="bg-navy-600 hover:bg-navy-700">
                            수정 완료
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">전체 공지</p>
                                <p className="text-2xl font-bold text-navy-900">{notices.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Eye className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">게시중</p>
                                <p className="text-2xl font-bold text-navy-900">
                                    {notices.filter((n) => n.active).length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">상단 고정</p>
                                <p className="text-2xl font-bold text-navy-900">{notices.filter((n) => n.pinned).length}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">총 조회수</p>
                                <p className="text-2xl font-bold text-navy-900">
                                    {notices.reduce((sum, n) => sum + (n.views || 0), 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <Eye className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="제목으로 검색..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="카테고리" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">전체 카테고리</SelectItem>
                                <SelectItem value="공지">공지</SelectItem>
                                <SelectItem value="이벤트">이벤트</SelectItem>
                                <SelectItem value="시스템">시스템</SelectItem>
                                <SelectItem value="서비스">서비스</SelectItem>
                                <SelectItem value="기타">기타</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Notices List */}
            <Card>
                <CardContent className="p-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-8 h-8 text-navy-600 animate-spin" />
                            <p className="ml-4 text-gray-600">공지사항을 불러오는 중입니다...</p>
                        </div>
                    ) : filteredNotices.length > 0 ? (
                        <div className="space-y-4">
                            {filteredNotices.map((notice) => (
                                <div key={notice.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex-1 mb-4 md:mb-0">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            {notice.pinned && <Badge className="bg-yellow-600">고정</Badge>}
                                            <Badge className="bg-teal-600">{notice.category}</Badge>
                                            {getStatusBadge(notice.active)}
                                        </div>
                                        <h3 className="font-semibold text-navy-900 mb-1">{notice.title}</h3>
                                        <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                                            <span>ID: {notice.id}</span>
                                            <span>작성일: {new Date(notice.createdAt).toLocaleDateString()}</span>
                                            <span>조회수: {(notice.views || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 self-end md:self-center">
                                        <Button size="sm" variant="outline" onClick={() => handleEditClick(notice)}>
                                            <Edit className="w-4 h-4 mr-1" />
                                            수정
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDeleteNotice(notice.id)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            삭제
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-500">표시할 공지사항이 없습니다.</p>
                            <p className="text-sm text-gray-400 mt-2">새로운 공지사항을 작성해보세요.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}