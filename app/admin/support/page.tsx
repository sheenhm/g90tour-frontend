"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Bell, Plus, Eye, Reply, CheckCircle } from "lucide-react"
import Link from "next/link"

const supportStats = [
  {
    title: "미답변 문의",
    value: "12",
    change: "+3",
    icon: MessageSquare,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    title: "오늘 답변",
    value: "8",
    change: "+5",
    icon: Reply,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "활성 공지",
    value: "5",
    change: "0",
    icon: Bell,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "완료율",
    value: "94%",
    change: "+2%",
    icon: CheckCircle,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
]

const recentInquiries = [
  {
    id: 1,
    customer: "김철수",
    email: "kim@example.com",
    subject: "예약 취소 문의",
    category: "예약/결제",
    status: "미답변",
    date: "2024-02-28 14:30",
    priority: "높음",
  },
  {
    id: 2,
    customer: "이영희",
    email: "lee@example.com",
    subject: "여행 일정 변경 가능한가요?",
    category: "여행 정보",
    status: "답변완료",
    date: "2024-02-28 10:15",
    priority: "보통",
  },
  {
    id: 3,
    customer: "박민수",
    email: "park@example.com",
    subject: "결제 오류 문의",
    category: "결제",
    status: "처리중",
    date: "2024-02-27 16:45",
    priority: "높음",
  },
]

const recentNotices = [
  {
    id: 1,
    title: "2024년 3월 여행 상품 할인 이벤트 안내",
    category: "이벤트",
    status: "게시중",
    date: "2024-02-28",
    views: 1245,
  },
  {
    id: 2,
    title: "시스템 점검 안내 (3월 5일 02:00~04:00)",
    category: "시스템",
    status: "게시중",
    date: "2024-02-25",
    views: 892,
  },
  {
    id: 3,
    title: "새로운 결제 시스템 도입 안내",
    category: "서비스",
    status: "임시저장",
    date: "2024-02-20",
    views: 0,
  },
]

export default function AdminSupportPage() {
  const [selectedTab, setSelectedTab] = useState("overview")

  const getStatusColor = (status) => {
    switch (status) {
      case "미답변":
        return "bg-red-600"
      case "처리중":
        return "bg-yellow-600"
      case "답변완료":
        return "bg-green-600"
      case "게시중":
        return "bg-green-600"
      case "임시저장":
        return "bg-gray-600"
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900">고객센터 관리</h1>
        <p className="text-gray-600">공지사항과 고객 문의를 관리하세요</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {supportStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
                  <p className={`text-sm ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                    {stat.change} 전일 대비
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="notices">공지사항 관리</TabsTrigger>
          <TabsTrigger value="inquiries">문의 관리</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Inquiries */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-navy-900">최근 문의</CardTitle>
                    <CardDescription>처리가 필요한 고객 문의</CardDescription>
                  </div>
                  <Button asChild size="sm" className="bg-navy-600 hover:bg-navy-700">
                    <Link href="/admin/support/inquiries">전체 보기</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentInquiries.map((inquiry) => (
                    <div key={inquiry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-navy-900">{inquiry.subject}</h4>
                          <Badge className={getPriorityColor(inquiry.priority)} size="sm">
                            {inquiry.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {inquiry.customer} • {inquiry.category}
                        </p>
                        <p className="text-xs text-gray-500">{inquiry.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(inquiry.status)} size="sm">
                          {inquiry.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Notices */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-navy-900">최근 공지사항</CardTitle>
                    <CardDescription>게시된 공지사항 현황</CardDescription>
                  </div>
                  <Button asChild size="sm" className="bg-teal-600 hover:bg-teal-700">
                    <Link href="/admin/support/notices">관리하기</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentNotices.map((notice) => (
                    <div key={notice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-navy-900 mb-1">{notice.title}</h4>
                        <p className="text-sm text-gray-600">{notice.category}</p>
                        <p className="text-xs text-gray-500">
                          {notice.date} • 조회수 {notice.views.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(notice.status)} size="sm">
                          {notice.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-navy-900">빠른 작업</CardTitle>
              <CardDescription>자주 사용하는 고객센터 기능</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button asChild className="h-20 flex-col gap-2 bg-navy-600 hover:bg-navy-700">
                  <Link href="/admin/support/notices/new">
                    <Plus className="w-6 h-6" />새 공지사항
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <Link href="/admin/support/inquiries?status=pending">
                    <MessageSquare className="w-6 h-6" />
                    미답변 문의
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <Link href="/admin/support/templates">
                    <Reply className="w-6 h-6" />
                    답변 템플릿
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                  <Link href="/admin/support/analytics">
                    <CheckCircle className="w-6 h-6" />
                    처리 현황
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notices" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-navy-900">공지사항 관리</h2>
              <p className="text-gray-600">공지사항을 작성하고 관리하세요</p>
            </div>
            <Button asChild className="bg-navy-600 hover:bg-navy-700">
              <Link href="/admin/support/notices/new">
                <Plus className="w-4 h-4 mr-2" />새 공지사항
              </Link>
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentNotices.map((notice) => (
                  <div key={notice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-navy-900">{notice.title}</h3>
                        <Badge className={getStatusColor(notice.status)}>{notice.status}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>카테고리: {notice.category}</span>
                        <span>작성일: {notice.date}</span>
                        <span>조회수: {notice.views.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        수정
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                        삭제
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inquiries" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-navy-900">문의 관리</h2>
              <p className="text-gray-600">고객 문의에 답변하고 관리하세요</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-transparent">
                미답변만 보기
              </Button>
              <Button variant="outline" className="bg-transparent">
                필터
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-navy-900">{inquiry.subject}</h3>
                        <Badge className={getPriorityColor(inquiry.priority)}>{inquiry.priority}</Badge>
                        <Badge className={getStatusColor(inquiry.status)}>{inquiry.status}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>고객: {inquiry.customer}</span>
                        <span>카테고리: {inquiry.category}</span>
                        <span>접수일: {inquiry.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        보기
                      </Button>
                      {inquiry.status === "미답변" && (
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                          <Reply className="w-4 h-4 mr-1" />
                          답변
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
