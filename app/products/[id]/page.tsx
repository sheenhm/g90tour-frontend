"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Star,
    MapPin,
    Calendar,
    Users,
    CheckCircle,
    AlertCircle,
    MessageSquare,
} from "lucide-react"
import Image from "next/image"
import { productApi, type Product, type Review } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

const categoryLabels: { [key: string]: string } = {
    HOTEL: "호텔",
    GOLF: "골프",
    TOUR: "패키지",
    SPA: "스파",
    ACTIVITY: "액티비티",
    VEHICLE: "차량",
}

// 카테고리별 단위 문구
const unitLabels: { [key: string]: string } = {
    HOTEL: "1박 기준",
    GOLF: "1인 기준",
    VEHICLE: "1일 기준",
    TOUR: "1인 기준",
    SPA: "1인 기준",
    ACTIVITY: "1인 기준",
}

const bookingFieldLabels: { [key: string]: string } = {
    HOTEL: "투숙일수",
    GOLF: "인원수",
    VEHICLE: "대여일수",
    TOUR: "인원수",
    SPA: "인원수",
    ACTIVITY: "인원수",
}

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { isAuthenticated } = useAuth()
    const [product, setProduct] = useState<Product | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
    const [reviewData, setReviewData] = useState({
        rating: 5,
        content: "",
    })

    // 예약 관련 상태
    const [selectedDate, setSelectedDate] = useState("")
    const [count, setCount] = useState(1)

    const productId = params.id as string

    useEffect(() => {
        if (productId) {
            fetchProductDetail()
            fetchReviews()
        }
    }, [productId])

    const fetchProductDetail = async () => {
        try {
            const data = await productApi.getById(productId)
            setProduct(data)
        } catch (error: any) {
            setError("상품 정보를 불러오는데 실패했습니다.")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchReviews = async () => {
        try {
            const data = await productApi.getReviews(productId)
            setReviews(data)
        } catch (error: any) {
            console.error("Failed to fetch reviews:", error)
        }
    }

    const handleReviewSubmit = async () => {
        if (!isAuthenticated) {
            setError("리뷰 작성은 로그인이 필요합니다.")
            return
        }

        if (!reviewData.content.trim()) {
            setError("리뷰 내용을 입력해주세요.")
            return
        }

        try {
            await productApi.createReview(productId, reviewData)
            setSuccess("리뷰가 성공적으로 등록되었습니다.")
            setReviewDialogOpen(false)
            setReviewData({ rating: 5, content: "" })
            await fetchReviews()
            await fetchProductDetail() // Re-fetch product to update rating
        } catch (error: any) {
            setError(error.message || "리뷰 등록에 실패했습니다.")
        }
    }

    const handleBooking = () => {
        if (!isAuthenticated) {
            router.push("/login")
            return
        }

        if (!selectedDate) {
            setError("예약 날짜를 선택해주세요.")
            return
        }

        if (!count || count < 1) {
            setError("예약 조건을 입력해주세요.")
            return
        }

        router.push(
            `/booking?productId=${productId}&date=${selectedDate}&count=${count}`,
        )
    }

    const renderStars = (rating: number, size: "sm" | "lg" = "sm") => {
        const stars = []
        const starSize = size === "lg" ? "w-6 h-6" : "w-4 h-4"

        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    className={`${starSize} ${
                        i <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                    }`}
                />,
            )
        }
        return stars
    }

    const renderRatingSelector = () => {
        const stars = []
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <button
                    key={i}
                    type="button"
                    onClick={() => setReviewData({ ...reviewData, rating: i })}
                    className="focus:outline-none"
                >
                    <Star
                        className={`w-8 h-8 ${
                            i <= reviewData.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                        } hover:text-yellow-400 transition-colors`}
                    />
                </button>,
            )
        }
        return stars
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600 mx-auto mb-4"></div>
                    <p>로딩 중...</p>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="p-8 text-center">
                        <h2 className="text-xl font-semibold mb-4">상품을 찾을 수 없습니다</h2>
                        <p className="text-gray-600 mb-6">
                            요청하신 상품이 존재하지 않거나 삭제되었습니다.
                        </p>
                        <Button
                            onClick={() => router.back()}
                            className="bg-navy-600 hover:bg-navy-700"
                        >
                            이전 페이지로
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {error && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert className="mb-6 border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">{success}</AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 상품 이미지 */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardContent className="p-0">
                                <div className="relative aspect-video">
                                    <Image
                                        src={product.imageUrl || "/placeholder.jpg"}
                                        alt={product.name}
                                        fill
                                        className="object-cover rounded-t-lg"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-teal-600">
                                            {categoryLabels[product.category]}
                                        </Badge>
                                    </div>
                                    {product.originalPrice > product.salePrice && (
                                        <div className="absolute top-4 right-4">
                                            <Badge className="bg-red-600">
                                                {Math.round(
                                                    ((product.originalPrice - product.salePrice) /
                                                        product.originalPrice) *
                                                    100,
                                                )}
                                                % 할인
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* 상품 설명 */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="text-navy-900">상품 설명</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {product.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* 포함 사항 */}
                        {product.includes && product.includes.length > 0 && (
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle className="text-navy-900">포함 사항</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {product.includes.map((item, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                <span className="text-gray-700">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* 예약 정보 */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center gap-1">
                                        {renderStars(Math.round(product.rating), "sm")}
                                    </div>
                                    <span className="text-sm text-gray-600">
                    ({product.rating.toFixed(1)})
                  </span>
                                </div>
                                <CardTitle className="text-xl text-navy-900">{product.name}</CardTitle>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span>{product.location}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        {product.originalPrice > product.salePrice && (
                                            <p className="text-sm text-gray-500 line-through">
                                                {product.originalPrice.toLocaleString()}원
                                            </p>
                                        )}
                                        <p className="text-2xl font-bold text-navy-900">
                                            {product.salePrice.toLocaleString()}원
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {unitLabels[product.category] || "1인 기준"}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                {/* 예약 조건 */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <Input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            min={new Date().toISOString().split("T")[0]} // 오늘 이전 날짜는 선택 불가
                                            className="flex-1"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Users className="w-4 h-4" />
                                        <Input
                                            type="number"
                                            min={1}
                                            value={count}
                                            onChange={(e) => setCount(Number(e.target.value))}
                                            className="flex-1"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {bookingFieldLabels[product.category] || "인원수"}를 입력하세요
                                    </p>
                                </div>

                                <Button
                                    onClick={handleBooking}
                                    className="w-full bg-teal-600 hover:bg-teal-700"
                                    size="lg"
                                >
                                    예약하기
                                </Button>

                                <p className="text-xs text-gray-500 text-center">
                                    예약 확정 후 결제가 진행됩니다
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Card className="mt-8">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-navy-900 flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5" />
                                    리뷰 ({reviews.length})
                                </CardTitle>
                                <CardDescription>다른 고객들의 후기를 확인해보세요</CardDescription>
                            </div>
                            {isAuthenticated && (
                                <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">리뷰 작성</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>리뷰 작성</DialogTitle>
                                            <DialogDescription>{product.name}에 대한 후기를 남겨주세요</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>평점</Label>
                                                <div className="flex items-center gap-1">{renderRatingSelector()}</div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="review-content">리뷰 내용</Label>
                                                <Textarea
                                                    id="review-content"
                                                    placeholder="여행 경험을 자세히 알려주세요..."
                                                    value={reviewData.content}
                                                    onChange={(e) => setReviewData({ ...reviewData, content: e.target.value })}
                                                    rows={4}
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button onClick={handleReviewSubmit} className="bg-navy-600 hover:bg-navy-700">
                                                    리뷰 등록
                                                </Button>
                                                <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
                                                    취소
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review.id} className="border-b pb-4 last:border-b-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-navy-900">{review.authorName}</span>
                                            <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                                        </div>
                                        <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{review.content}</p>
                                </div>
                            ))}
                        </div>

                        {reviews.length === 0 && (
                            <div className="text-center py-12">
                                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 mb-4">아직 리뷰가 없습니다.</p>
                                <p className="text-sm text-gray-400">첫 번째 리뷰를 작성해보세요!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}