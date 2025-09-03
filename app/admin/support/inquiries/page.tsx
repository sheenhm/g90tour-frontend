"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Search, Eye, Reply, Clock, CheckCircle, AlertCircle, Phone, Mail } from "lucide-react"

const inquiries = [
  {
    id: 1,
    customer: "김철수",
    email: "kim@example.com",
    phone: "010-1234-5678",
    subject: "예약 취소 문의",
    content: "3월 15일 제주도 여행 예약을 취소하고 싶습니다. 취소 수수료는 얼마인가요?",
    category: "예약/결제",
    status: "미답변",
    priority: "높음",
    createdAt: "2024-02-28 14:30",
    updatedAt: "2024-02-28 14:30",
    bookingId: "B20240315001",
    response: "",
    responseAt: "",
    assignedTo: "",
  },
  {
    id: 2,
    customer: "이영희",
    email: "lee@example.com",
    phone: "010-2345-6789",
    subject: "여행 일정 변경 가능한가요?",
    content: "4월 10일 출발 예정인 유럽 투어 일정을 4월 20일로 변경할 수 있나요?",
    category: "여행 정보",
    status: "답변완료",
    priority: "보통",
    createdAt: "2024-02-28 10:15",
    updatedAt: "2024-02-28 16:20",
    bookingId: "B20240410002",
    response: "안녕하세요. 일정 변경은 출발 7일 전까지 가능합니다. 변경 수수료는 1인당 50,000원입니다.",
    responseAt: "2024-02-28 16:20",
    assignedTo: "관리자",
  },
  {
    id: 3,
    customer: "박민수",
    email: "park@example.com",
    phone: "010-3456-7890",
    subject: "결제 오류 문의",
    content: "카드 결제가 완료되었는데 예약 확인서가 오지 않았습니다.",
    category: "결제",
    status: "처리중",
    priority: "높음",
    createdAt: "2024-02-27 16:45",
    updatedAt: "2024-02-28 09:30",
    bookingId: "B20240227003",
    response: "",
    responseAt: "",
    assignedTo: "관리자",
  },
]

export default function AdminInquiriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)
  const [replyContent, setReplyContent] = useState("")

  const handleViewDetail = (inquiry) => {
    setSelectedInquiry(inquiry)
    setIsDetailDialogOpen(true)
  }

  const handleReply = (inquiry) => {
    setSelectedInquiry(inquiry)
    setReplyContent(inquiry.response || "")
    setIsReplyDialogOpen(true)
  }

  const handleSendReply = () => {
    console.log("Sending reply:", selectedInquiry.id, replyContent)
    setIsReplyDialogOpen(false)
    setReplyContent("")
    setSelectedInquiry(null)
  }

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || inquiry.category === categoryFilter
    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter
    const matchesPriority = priorityFilter === "all" || inquiry.priority === priorityFilter
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "미답변":
        return "bg-red-600"
      case "처리중":
        return "bg-yellow-600"
      case "답변완료":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "높음":
        return "bg-red-600"
      case "보통":
        return "bg-yellow-600"
      case "낮음":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "미답변":
        return <AlertCircle className="w-4 h-4" />
      case "처리중":
        return <Clock className="w-4 h-4" />
      case "답변완료":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">문의 관리</h1>
          <p className="text-gray-600">고객 문의에 답변하고 관리하세요</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-transparent">
            미답변만 보기
          </Button>
          <Button variant="outline" className="bg-transparent">
            내 담당 문의
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">전체 문의</p>
                <p className="text-2xl font-bold text-navy-900">{inquiries.length}</p>
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
                <p className="text-sm font-medium text-gray-600">미답변</p>
                <p className="text-2xl font-bold text-red-600">
                  {inquiries.filter((i) => i.status === "미답변").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">처리중</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {inquiries.filter((i) => i.status === "처리중").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">답변완료</p>
                <p className="text-2xl font-bold text-green-600">
                  {inquiries.filter((i) => i.status === "답변완료").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
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
                  placeholder="고객명 또는 제목으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 카테고리</SelectItem>
                <SelectItem value="예약/결제">예약/결제</SelectItem>
                <SelectItem value="여행 정보">여행 정보</SelectItem>
                <SelectItem value="결제">결제</SelectItem>
                <SelectItem value="취소/환불">취소/환불</SelectItem>
                <SelectItem value="기타">기타</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="미답변">미답변</SelectItem>
                <SelectItem value="처리중">처리중</SelectItem>
                <SelectItem value="답변완료">답변완료</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="우선순위" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="높음">높음</SelectItem>
                <SelectItem value="보통">보통</SelectItem>
                <SelectItem value="낮음">낮음</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inquiries List */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {filteredInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getPriorityColor(inquiry.priority)}>{inquiry.priority}</Badge>
                    <Badge className={getStatusColor(inquiry.status)} className="flex items-center gap-1">
                      {getStatusIcon(inquiry.status)}
                      {inquiry.status}
                    </Badge>
                    <Badge className="bg-teal-600">{inquiry.category}</Badge>
                    {inquiry.bookingId && <Badge variant="outline">예약번호: {inquiry.bookingId}</Badge>}
                  </div>
                  <h3 className="font-semibold text-navy-900 mb-1">{inquiry.subject}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-1">{inquiry.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <span>고객: {inquiry.customer}</span>
                    </span>
                    <span>접수일: {inquiry.createdAt}</span>
                    {inquiry.assignedTo && <span>담당자: {inquiry.assignedTo}</span>}
                    {inquiry.responseAt && <span>답변일: {inquiry.responseAt}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => window.open(`tel:${inquiry.phone}`)}>
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => window.open(`mailto:${inquiry.email}`)}>
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleViewDetail(inquiry)}>
                    <Eye className="w-4 h-4 mr-1" />
                    보기
                  </Button>
                  {inquiry.status !== "답변완료" && (
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={() => handleReply(inquiry)}>
                      <Reply className="w-4 h-4 mr-1" />
                      답변
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredInquiries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">검색 결과가 없습니다.</p>
            </div>
          )}
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
                <div>
                  <Label className="text-sm font-medium text-gray-600">고객명</Label>
                  <p className="text-navy-900">{selectedInquiry.customer}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">연락처</Label>
                  <p className="text-navy-900">{selectedInquiry.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">이메일</Label>
                  <p className="text-navy-900">{selectedInquiry.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">카테고리</Label>
                  <p className="text-navy-900">{selectedInquiry.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">우선순위</Label>
                  <Badge className={getPriorityColor(selectedInquiry.priority)}>{selectedInquiry.priority}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">상태</Label>
                  <Badge className={getStatusColor(selectedInquiry.status)}>{selectedInquiry.status}</Badge>
                </div>
                {selectedInquiry.bookingId && (
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-600">관련 예약번호</Label>
                    <p className="text-navy-900">{selectedInquiry.bookingId}</p>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">문의 제목</Label>
                <p className="text-navy-900 font-medium">{selectedInquiry.subject}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">문의 내용</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-navy-900 whitespace-pre-wrap">{selectedInquiry.content}</p>
                </div>
              </div>

              {selectedInquiry.response && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">답변 내용</Label>
                  <div className="mt-2 p-4 bg-blue-50 rounded-lg">
                    <p className="text-navy-900 whitespace-pre-wrap">{selectedInquiry.response}</p>
                    <p className="text-xs text-gray-500 mt-2">답변일: {selectedInquiry.responseAt}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                  닫기
                </Button>
                {selectedInquiry.status !== "답변완료" && (
                  <Button
                    className="bg-teal-600 hover:bg-teal-700"
                    onClick={() => {
                      setIsDetailDialogOpen(false)
                      handleReply(selectedInquiry)
                    }}
                  >
                    답변하기
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>문의 답변</DialogTitle>
            <DialogDescription>고객 문의에 답변을 작성해주세요</DialogDescription>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-navy-900 mb-2">{selectedInquiry.subject}</h4>
                <p className="text-sm text-gray-600">{selectedInquiry.content}</p>
              </div>
              <div>
                <Label htmlFor="reply">답변 내용</Label>
                <Textarea
                  id="reply"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="고객에게 전달할 답변을 작성해주세요"
                  rows={8}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
                  취소
                </Button>
                <Button onClick={handleSendReply} className="bg-teal-600 hover:bg-teal-700">
                  답변 전송
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
