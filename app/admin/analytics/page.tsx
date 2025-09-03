"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, Star, MapPin, Package, Download } from "lucide-react"

const analyticsData = {
  overview: {
    totalRevenue: 125000000,
    revenueGrowth: 12.5,
    totalBookings: 1247,
    bookingsGrowth: 8.3,
    totalUsers: 3456,
    usersGrowth: 15.2,
    avgRating: 4.7,
    ratingChange: 0.2,
  },
  monthlyRevenue: [
    { month: "1월", revenue: 8500000, bookings: 85 },
    { month: "2월", revenue: 9200000, bookings: 92 },
    { month: "3월", revenue: 11800000, bookings: 118 },
    { month: "4월", revenue: 10300000, bookings: 103 },
    { month: "5월", revenue: 12600000, bookings: 126 },
    { month: "6월", revenue: 15200000, bookings: 152 },
  ],
  topProducts: [
    { name: "제주 신라호텔 3박 4일", category: "호텔", bookings: 156, revenue: 46800000 },
    { name: "태국 푸켓 골프 패키지", category: "골프", bookings: 89, revenue: 115570000 },
    { name: "유럽 5개국 투어", category: "투어", bookings: 45, revenue: 134955000 },
    { name: "발리 스파 리조트", category: "스파", bookings: 78, revenue: 31200000 },
  ],
  topDestinations: [
    { destination: "제주도", bookings: 234, percentage: 18.8 },
    { destination: "태국", bookings: 189, percentage: 15.2 },
    { destination: "유럽", bookings: 156, percentage: 12.5 },
    { destination: "발리", bookings: 134, percentage: 10.7 },
    { destination: "일본", bookings: 98, percentage: 7.9 },
  ],
  customerSegments: [
    { segment: "20-30대", count: 1234, percentage: 35.7 },
    { segment: "30-40대", count: 1089, percentage: 31.5 },
    { segment: "40-50대", count: 876, percentage: 25.3 },
    { segment: "50대 이상", count: 257, percentage: 7.4 },
  ],
}

export default function AdminAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const StatCard = ({ title, value, change, icon: Icon, format = "number" }) => {
    const isPositive = change > 0
    const formattedValue =
      format === "currency" ? formatCurrency(value) : format === "rating" ? value.toFixed(1) : value.toLocaleString()

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-navy-900">{formattedValue}</p>
              <div className={`flex items-center text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
                {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {Math.abs(change)}% 전월 대비
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">통계 분석</h1>
          <p className="text-gray-600">비즈니스 성과를 분석하고 인사이트를 확인하세요</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1개월</SelectItem>
              <SelectItem value="3months">3개월</SelectItem>
              <SelectItem value="6months">6개월</SelectItem>
              <SelectItem value="1year">1년</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            리포트 다운로드
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="revenue">매출 분석</TabsTrigger>
          <TabsTrigger value="products">상품 분석</TabsTrigger>
          <TabsTrigger value="customers">고객 분석</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="총 매출"
              value={analyticsData.overview.totalRevenue}
              change={analyticsData.overview.revenueGrowth}
              icon={DollarSign}
              format="currency"
            />
            <StatCard
              title="총 예약"
              value={analyticsData.overview.totalBookings}
              change={analyticsData.overview.bookingsGrowth}
              icon={Calendar}
            />
            <StatCard
              title="총 회원"
              value={analyticsData.overview.totalUsers}
              change={analyticsData.overview.usersGrowth}
              icon={Users}
            />
            <StatCard
              title="평균 평점"
              value={analyticsData.overview.avgRating}
              change={analyticsData.overview.ratingChange}
              icon={Star}
              format="rating"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Monthly Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-navy-900">월별 매출 추이</CardTitle>
                <CardDescription>최근 6개월 매출 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.monthlyRevenue.map((data, index) => (
                    <div key={data.month} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-600 rounded-full" />
                        <span className="text-sm font-medium">{data.month}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-navy-900">{formatCurrency(data.revenue)}</p>
                        <p className="text-xs text-gray-600">{data.bookings}건</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Destinations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-navy-900">인기 여행지</CardTitle>
                <CardDescription>예약 기준 상위 여행지</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topDestinations.map((destination, index) => (
                    <div key={destination.destination} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium">{destination.destination}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-navy-900">{destination.bookings}건</p>
                        <p className="text-xs text-gray-600">{destination.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-navy-900">주요 인사이트</CardTitle>
              <CardDescription>이번 달 비즈니스 하이라이트</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">매출 성장</span>
                  </div>
                  <p className="text-sm text-green-700">전월 대비 12.5% 증가하여 목표를 초과 달성했습니다.</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-800">신규 회원</span>
                  </div>
                  <p className="text-sm text-blue-700">이번 달 신규 회원이 15.2% 증가했습니다.</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-800">고객 만족도</span>
                  </div>
                  <p className="text-sm text-purple-700">평균 평점이 4.7점으로 높은 만족도를 유지하고 있습니다.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy-900">매출 상세 분석</CardTitle>
                  <CardDescription>카테고리별 매출 현황</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {analyticsData.topProducts.map((product) => (
                      <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium text-navy-900">{product.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-teal-600">{product.category}</Badge>
                            <span className="text-sm text-gray-600">{product.bookings}건 예약</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-navy-900">{formatCurrency(product.revenue)}</p>
                          <p className="text-sm text-gray-600">
                            건당 평균 {formatCurrency(product.revenue / product.bookings)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy-900">매출 목표</CardTitle>
                  <CardDescription>이번 달 목표 달성률</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-navy-900">87%</p>
                      <p className="text-sm text-gray-600">목표 달성률</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: "87%" }} />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">현재 매출</span>
                        <span className="font-medium">₩108,750,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">목표 매출</span>
                        <span className="font-medium">₩125,000,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">남은 목표</span>
                        <span className="font-medium text-blue-600">₩16,250,000</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-navy-900">상품별 성과</CardTitle>
                <CardDescription>예약 건수 기준 상위 상품</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-navy-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-navy-900">{product.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-teal-600">{product.category}</Badge>
                          <span className="text-sm text-gray-600">{product.bookings}건</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-navy-900">{formatCurrency(product.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-navy-900">카테고리별 분석</CardTitle>
                <CardDescription>상품 카테고리 성과 비교</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["호텔", "골프", "패키지", "스파", "액티비티"].map((category, index) => {
                    const bookings = [156, 89, 45, 78, 34][index]
                    const percentage = [35, 20, 10, 18, 8][index]
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Package className="w-5 h-5 text-gray-400" />
                          <span className="font-medium">{category}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-navy-900">{bookings}건</p>
                          <p className="text-sm text-gray-600">{percentage}%</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-navy-900">고객 연령대 분석</CardTitle>
                <CardDescription>연령대별 고객 분포</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.customerSegments.map((segment) => (
                    <div key={segment.segment} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{segment.segment}</span>
                        <span className="text-sm text-gray-600">
                          {segment.count.toLocaleString()}명 ({segment.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${segment.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-navy-900">고객 행동 분석</CardTitle>
                <CardDescription>주요 고객 지표</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">2.3</p>
                    <p className="text-sm text-blue-800">평균 예약 횟수</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">₩890,000</p>
                    <p className="text-sm text-green-800">고객 평균 구매액</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">73%</p>
                    <p className="text-sm text-purple-800">재구매율</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
