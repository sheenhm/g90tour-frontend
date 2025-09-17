"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Search, Eye, Reply, Clock, CheckCircle, AlertCircle, Phone, Mail } from "lucide-react"
import { adminInquiryApi, Inquiry, InquiryStatus } from "@/lib/admin"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";

const statusMap: Record<InquiryStatus, { text: string; color: string; icon: React.ElementType }> = {
    UNANSWERED: { text: "미답변", color: "bg-red-600", icon: AlertCircle },
    ANSWERED: { text: "답변완료", color: "bg-green-600", icon: CheckCircle },
    CLOSED: { text: "처리종료", color: "bg-gray-600", icon: CheckCircle },
}

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState({ UNANSWERED: 0, ANSWERED: 0, CLOSED: 0, TOTAL: 0 })

    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [activeTab, setActiveTab] = useState<InquiryStatus>("UNANSWERED")

    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
    const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)
    const [replyContent, setReplyContent] = useState("")

    const fetchInquiries = async (status: InquiryStatus) => {
        setIsLoading(true)
        try {
            const data = await adminInquiryApi.getByStatus(status)
            setInquiries(data || [])
        } catch (error) {
            toast({ title: "오류", description: "문의 목록을 불러오는 데 실패했습니다.", variant: "destructive" })
            setInquiries([])
        } finally {
            setIsLoading(false)
        }
    }

    const fetchStats = async () => {
        try {
            const [unanswered, answered, closed] = await Promise.all([
                adminInquiryApi.getByStatus("UNANSWERED"),
                adminInquiryApi.getByStatus("ANSWERED"),
                adminInquiryApi.getByStatus("CLOSED"),
            ]);
            const unansweredCount = unanswered?.length || 0;
            const answeredCount = answered?.length || 0;
            const closedCount = closed?.length || 0;
            setStats({
                UNANSWERED: unansweredCount,
                ANSWERED: answeredCount,
                CLOSED: closedCount,
                TOTAL: unansweredCount + answeredCount + closedCount,
            })
        } catch (error) {
            console.error("Failed to fetch stats:", error)
        }
    }

    useEffect(() => {
        fetchStats()
        fetchInquiries(activeTab)
    }, [activeTab])

    const handleViewDetail = (inquiry: Inquiry) => {
        setSelectedInquiry(inquiry)
        setIsDetailDialogOpen(true)
    }

    const handleReply = (inquiry: Inquiry) => {
        setSelectedInquiry(inquiry)
        setReplyContent(inquiry.response || "")
        setIsReplyDialogOpen(true)
    }

    const handleSendReply = async () => {
        if (!selectedInquiry || !replyContent.trim()) {
            toast({ title: "오류", description: "답변 내용을 입력해주세요.", variant: "destructive" });
            return;
        }
        try {
            await adminInquiryApi.respond(selectedInquiry.id, replyContent)
            toast({ title: "성공", description: "답변이 성공적으로 전송되었습니다." })
            setIsReplyDialogOpen(false)
            setReplyContent("")
            setSelectedInquiry(null)
            fetchInquiries(activeTab)
            fetchStats()
        } catch (error) {
            toast({ title: "오류", description: "답변 전송에 실패했습니다.", variant: "destructive" })
        }
    }

    const filteredInquiries = useMemo(() => {
        return inquiries.filter((inquiry) => {
            const customerName = inquiry.userName || inquiry.nonMemberName || ""
            const matchesSearch =
                customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inquiry.title.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategory = categoryFilter === "all" || inquiry.category === categoryFilter
            return matchesSearch && matchesCategory
        })
    }, [inquiries, searchTerm, categoryFilter])


    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-navy-900">문의 관리</h1>
                    <p className="text-gray-600">고객 문의에 답변하고 관리하세요</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card><CardContent className="p-6"><p className="text-sm font-medium text-gray-600">전체 문의</p><p className="text-2xl font-bold text-navy-900">{stats.TOTAL}</p></CardContent></Card>
                <Card><CardContent className="p-6"><p className="text-sm font-medium text-gray-600">미답변</p><p className="text-2xl font-bold text-red-600">{stats.UNANSWERED}</p></CardContent></Card>
                <Card><CardContent className="p-6"><p className="text-sm font-medium text-gray-600">답변완료</p><p className="text-2xl font-bold text-green-600">{stats.ANSWERED}</p></CardContent></Card>
                <Card><CardContent className="p-6"><p className="text-sm font-medium text-gray-600">처리종료</p><p className="text-2xl font-bold text-gray-600">{stats.CLOSED}</p></CardContent></Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="고객명 또는 제목으로 검색..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-48"><SelectValue placeholder="카테고리" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">전체 카테고리</SelectItem>
                                <SelectItem value="예약/결제">예약/결제</SelectItem>
                                <SelectItem value="여행 정보">여행 정보</SelectItem>
                                <SelectItem value="취소/환불">취소/환불</SelectItem>
                                <SelectItem value="기타">기타</SelectItem>
                            </SelectContent>
                        </Select>
                        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as InquiryStatus)}>
                            <TabsList>
                                <TabsTrigger value="UNANSWERED">미답변</TabsTrigger>
                                <TabsTrigger value="ANSWERED">답변완료</TabsTrigger>
                                <TabsTrigger value="CLOSED">처리종료</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>

            {/* Inquiries List */}
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {isLoading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-24 w-full rounded-lg" />
                            ))
                            : filteredInquiries.length > 0
                                ? filteredInquiries.map((inquiry) => {
                                    const StatusIcon = statusMap[inquiry.status as InquiryStatus]?.icon;

                                    return (
                                        <div
                                            key={inquiry.id}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge
                                                        className={
                                                            statusMap[inquiry.status as InquiryStatus]?.color +
                                                            " flex items-center gap-1"
                                                        }
                                                    >
                                                        {StatusIcon && <StatusIcon className="w-4 h-4" />}
                                                        <span>{statusMap[inquiry.status as InquiryStatus]?.text}</span>
                                                    </Badge>
                                                    <Badge className="bg-teal-600">{inquiry.category}</Badge>
                                                </div>
                                                <h3 className="font-semibold text-navy-900 mb-1">{inquiry.title}</h3>
                                                <p className="text-sm text-gray-600 mb-2 line-clamp-1">{inquiry.content}</p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span>고객: {inquiry.userName || inquiry.nonMemberName}</span>
                                                    <span>접수일: {new Date(inquiry.createdAt).toLocaleString()}</span>
                                                    {inquiry.respondedAt && (
                                                        <span>답변일: {new Date(inquiry.respondedAt).toLocaleString()}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleViewDetail(inquiry)}
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    보기
                                                </Button>
                                                {inquiry.status === "UNANSWERED" && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-teal-600 hover:bg-teal-700"
                                                        onClick={() => handleReply(inquiry)}
                                                    >
                                                        <Reply className="w-4 h-4 mr-1" />
                                                        답변
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                                : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500">해당 상태의 문의가 없습니다.</p>
                                    </div>
                                )
                        }

                    </div>
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>문의 상세보기</DialogTitle>
                        <DialogDescription>고객 문의 내용을 확인하세요</DialogDescription>
                    </DialogHeader>
                    {selectedInquiry && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>고객명</Label><p>{selectedInquiry.userName || selectedInquiry.nonMemberName}</p></div>
                                <div><Label>연락처</Label><p>{selectedInquiry.nonMemberPhone}</p></div>
                                <div><Label>이메일</Label><p>{selectedInquiry.nonMemberEmail}</p></div>
                                <div><Label>카테고리</Label><p>{selectedInquiry.category}</p></div>
                            </div>
                            <div><Label>문의 제목</Label><p className="font-medium">{selectedInquiry.title}</p></div>
                            <div><Label>문의 내용</Label><div className="mt-2 p-4 bg-gray-50 rounded-lg"><p className="whitespace-pre-wrap">{selectedInquiry.content}</p></div></div>
                            {selectedInquiry.response && (
                                <div><Label>답변 내용</Label><div className="mt-2 p-4 bg-blue-50 rounded-lg"><p className="whitespace-pre-wrap">{selectedInquiry.response}</p><p className="text-xs text-gray-500 mt-2">답변일: {new Date(selectedInquiry.respondedAt!).toLocaleString()}</p></div></div>
                            )}
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>닫기</Button>
                                {selectedInquiry.status === "UNANSWERED" && <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => { setIsDetailDialogOpen(false); handleReply(selectedInquiry); }}>답변하기</Button>}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Reply Dialog */}
            <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader><DialogTitle>문의 답변</DialogTitle><DialogDescription>고객 문의에 답변을 작성해주세요</DialogDescription></DialogHeader>
                    {selectedInquiry && (
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg"><h4 className="font-medium mb-2">{selectedInquiry.title}</h4><p className="text-sm text-gray-600">{selectedInquiry.content}</p></div>
                            <div><Label htmlFor="reply">답변 내용</Label><Textarea id="reply" value={replyContent} onChange={(e) => setReplyContent(e.target.value)} placeholder="고객에게 전달할 답변을 작성해주세요" rows={8}/></div>
                            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>취소</Button><Button onClick={handleSendReply} className="bg-teal-600 hover:bg-teal-700">답변 전송</Button></div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}