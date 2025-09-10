"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Package, Calendar, DollarSign, Eye } from "lucide-react"
import Link from "next/link"
import {adminDashboardApi, DashboardSummary, Booking, TopProduct, adminBookingApi} from "@/lib/admin"
import { Skeleton } from "@/components/ui/skeleton"

const quickActions = [
    { title: "상품 관리", href: "/admin/products", icon: Package, description: "여행 상품 등록 및 수정" },
    { title: "회원 관리", href: "/admin/users", icon: Users, description: "회원 정보 및 권한 관리" },
    { title: "예약 관리", href: "/admin/bookings", icon: Calendar, description: "예약 현황 및 관리" },
]

export default function AdminPage() {
    const [summary, setSummary] = useState<DashboardSummary | null>(null)
    const [bookings, setBookings] = useState<Booking[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const summaryData = await adminDashboardApi.getSummary()
                setSummary(summaryData)

                const recentBookingsResponse = await adminBookingApi.search({ page: 0, size: 5 })
                setBookings(recentBookingsResponse.content)
            } catch (err) {
                console.error("대시보드 데이터 불러오기 실패:", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-navy-900 mb-2">관리자 대시보드</h1>
                    <p className="text-gray-600">G90 Entertainment Tour 관리 시스템</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <Skeleton className="h-4 w-24 mb-2" />
                                        <Skeleton className="h-8 w-20" />
                                        <Skeleton className="h-3 w-16 mt-1" />
                                    </div>
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <>
                            <StatCard title="총 회원수" value={`${summary?.totalUsers}명`} change={`+${summary?.newUsersLast7Days}명`} icon={Users} color="text-blue-600" />
                            <StatCard title="총 예약" value={`${summary?.totalBookings}건`} change={`+${summary?.newBookingsLast7Days}건`} icon={Calendar} color="text-green-600" />
                            <StatCard title="총 매출" value={`${summary?.totalRevenue.toLocaleString()}원`} change={`+${summary?.revenueLast7Days.toLocaleString()}원`} icon={DollarSign} color="text-purple-600" />
                            <StatCard title="판매 중인 상품" value={`${summary?.activeProducts}개`} icon={Package} color="text-orange-600" />
                        </>
                    )}
                </div>

                {/* Quick Actions */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>빠른 작업</CardTitle>
                        <CardDescription>자주 사용하는 관리 기능</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {isLoading
                                ? Array.from({ length: 3 }).map((_, i) => (
                                    <Card key={i}>
                                        <CardContent className="p-4 flex items-center gap-3">
                                            <Skeleton className="w-10 h-10 rounded-lg" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-4 w-24" />
                                                <Skeleton className="h-3 w-32" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                                : quickActions.map((action) => (
                                    <Link key={action.title} href={action.href}>
                                        <Card className="hover:shadow-lg hover:scale-105 transition-transform cursor-pointer">
                                            <CardContent className="p-4 flex items-center gap-3">
                                                <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center">
                                                    <action.icon className="w-5 h-5 text-navy-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-navy-900">{action.title}</h3>
                                                    <p className="text-xs text-gray-600">{action.description}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))
                            }
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top 5 인기 상품 */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>Top 5 인기 상품</CardTitle>
                            <CardDescription>최근 예약 기준 인기 상품</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {isLoading
                                    ? Array.from({ length: 5 }).map((_, i) => (
                                        <Skeleton key={i} className="h-6 w-full rounded-md" />
                                    ))
                                    : summary?.top5Products.map((product: TopProduct) => (
                                        <div key={product.productId} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <p className="font-medium text-navy-900">{product.productName}</p>
                                            <Badge variant="default" className="text-xs">{product.bookingCount} 예약</Badge>
                                        </div>
                                    ))
                                }
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Bookings */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>최근 예약</CardTitle>
                            <CardDescription>최신 예약 현황</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {isLoading
                                    ? Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="space-y-1">
                                                <Skeleton className="h-4 w-32" />
                                                <Skeleton className="h-3 w-24" />
                                            </div>
                                            <div className="space-y-1 text-right">
                                                <Skeleton className="h-4 w-16 ml-auto" />
                                                <Skeleton className="h-4 w-12 ml-auto" />
                                            </div>
                                        </div>
                                    ))
                                    : bookings.map((booking) => (
                                        <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div>
                                                <p className="font-medium text-navy-900">{booking.customerName}</p>
                                                <p className="text-sm text-gray-600">{booking.productName}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-navy-900">{booking.totalPrice.toLocaleString()}원</p>
                                                <Badge
                                                    variant={
                                                        booking.status === "PAYMENT_COMPLETED" || booking.status === "TRAVEL_COMPLETED"
                                                            ? "default"
                                                            : booking.status === "PAYMENT_PENDING" || booking.status === "QUOTE_REQUESTED"
                                                                ? "secondary"
                                                                : booking.status === "CANCEL_PENDING" || booking.status === "CANCELLED"
                                                                    ? "destructive"
                                                                    : "default"
                                                    }
                                                    className="text-xs"
                                                >
                                                    {booking.status === "QUOTE_REQUESTED"
                                                        ? "견적 요청"
                                                        : booking.status === "PAYMENT_PENDING"
                                                            ? "결제 대기"
                                                            : booking.status === "PAYMENT_COMPLETED"
                                                                ? "결제 완료"
                                                                : booking.status === "TRAVEL_COMPLETED"
                                                                    ? "여행 완료"
                                                                    : booking.status === "CANCEL_PENDING"
                                                                        ? "취소 요청"
                                                                        : booking.status === "CANCELLED"
                                                                            ? "취소 완료"
                                                                            : booking.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            <Button variant="outline" className="w-full mt-4 bg-transparent hover:bg-gray-100 transition-colors">
                                <Eye className="w-4 h-4 mr-2" />
                                전체 예약 보기
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, change, icon: Icon, color }: any) {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    {value === undefined ? <Skeleton className="h-8 w-20 mt-1" /> : <p className="text-2xl font-bold text-navy-900">{value}</p>}
                    {change && (
                        <p className={`text-sm ${change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                            {change} 지난 주 대비
                        </p>
                    )}
                </div>
                <Icon className={`w-8 h-8 ${color}`} />
            </CardContent>
        </Card>
    )
}