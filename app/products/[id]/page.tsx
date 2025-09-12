"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/hooks/useAuth"
import { productApi, type Product, type Review } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, Calendar, Users, CheckCircle, AlertCircle, MessageSquare, ChevronLeft, ChevronRight, Info } from "lucide-react"

const categoryLabels: { [key: string]: string } = { HOTEL: "호텔", GOLF: "골프", TOUR: "패키지", SPA: "스파", ACTIVITY: "액티비티", VEHICLE: "차량" }
const unitLabels: { [key: string]: string } = { HOTEL: "1박 기준", GOLF: "1인 기준", VEHICLE: "1일 기준", TOUR: "1인 기준", SPA: "1인 기준", ACTIVITY: "1인 기준" }
const bookingFieldLabels: { [key: string]: string } = { HOTEL: "투숙일수", GOLF: "인원수", VEHICLE: "대여일수", TOUR: "인원수", SPA: "인원수", ACTIVITY: "인원수" }

const ProductDetailSkeleton = () => (
    <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-200 rounded-lg w-full aspect-video"></div>
                <div className="bg-gray-200 rounded-lg h-48 w-full"></div>
            </div>
            <div className="lg:col-span-1">
                <div className="bg-gray-200 rounded-lg h-96 w-full"></div>
            </div>
        </div>
        <div className="mt-8 bg-gray-200 rounded-lg h-64 w-full"></div>
    </div>
)

const ProductImageGallery = ({ images, productName }: { images: string[], productName: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length)
    const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)

    if (!images || images.length === 0) {
        images = ["/placeholder.jpg"]
    }

    return (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg">
            <AnimatePresence initial={false}>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={images[currentIndex]}
                        alt={`${productName} image ${currentIndex + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={currentIndex === 0}
                    />
                </motion.div>
            </AnimatePresence>
            {images.length > 1 && (
                <>
                    <Button onClick={prevImage} variant="outline" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/70 hover:bg-white">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button onClick={nextImage} variant="outline" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/70 hover:bg-white">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, index) => (
                            <div key={index}
                                 className={`w-2 h-2 rounded-full transition-all ${currentIndex === index ? 'bg-white scale-125' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

// Review Summary Component
const ReviewSummary = ({ reviews, averageRating }: { reviews: Review[], averageRating: number }) => {
    const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
        const count = reviews.filter(r => r.rating === star).length;
        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
        return { star, count, percentage };
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-4 border rounded-lg bg-gray-50/50 mb-6">
            <div className="flex flex-col items-center justify-center">
                <p className="text-sm text-gray-600">전체 평점</p>
                <div className="flex items-center gap-2">
                    <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                    <span className="text-4xl font-bold text-navy-900">{averageRating.toFixed(1)}</span>
                    <span className="text-lg text-gray-500">/ 5</span>
                </div>
            </div>
            <div className="md:col-span-2 space-y-1">
                {ratingDistribution.map(({ star, count, percentage }) => (
                    <div key={star} className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">{star}점</span>
                        <div className="flex-grow bg-gray-200 rounded-full h-2.5">
                            <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <span className="w-8 text-right text-gray-500">{count}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Star Rating Component
const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) => {
    const starSize = size === "lg" ? "w-6 h-6" : "w-4 h-4";
    return (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className={`${starSize} ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
            ))}
        </div>
    );
};

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
    const [reviewData, setReviewData] = useState({ rating: 5, content: "" })
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
    const [count, setCount] = useState(1)

    const productId = params.id as string

    useEffect(() => {
        if (productId) {
            const fetchData = async () => {
                setIsLoading(true)
                try {
                    const productData = await productApi.getById(productId)
                    setProduct(productData)
                    const reviewData = await productApi.getReviews(productId)
                    setReviews(reviewData)
                } catch (error: any) {
                    setError("정보를 불러오는데 실패했습니다.")
                } finally {
                    setIsLoading(false)
                }
            }
            fetchData()
        }
    }, [productId])

    const handleReviewSubmit = async () => {
        if (!isAuthenticated) { setError("리뷰 작성은 로그인이 필요합니다."); return }
        if (!reviewData.content.trim()) { setError("리뷰 내용을 입력해주세요."); return }

        try {
            await productApi.createReview(productId, reviewData)
            setSuccess("리뷰가 성공적으로 등록되었습니다.")
            setReviewDialogOpen(false)
            setReviewData({ rating: 5, content: "" })
            const [newProduct, newReviews] = await Promise.all([
                productApi.getById(productId),
                productApi.getReviews(productId)
            ]);
            setProduct(newProduct)
            setReviews(newReviews)
        } catch (error: any) {
            setError(error.message || "리뷰 등록에 실패했습니다.")
        }
    }

    const handleBooking = () => {
        if (!isAuthenticated) { router.push("/login"); return }
        if (!selectedDate) { setError("예약 날짜를 선택해주세요."); return }
        if (!count || count < 1) { setError("예약 조건을 입력해주세요."); return }

        router.push(`/booking?productId=${productId}&date=${selectedDate}&count=${count}`)
    }

    if (isLoading) return <ProductDetailSkeleton />

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md text-center shadow-lg">
                    <CardHeader><CardTitle>상품을 찾을 수 없습니다</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-6">요청하신 상품이 존재하지 않거나 삭제되었습니다.</p>
                        <Button onClick={() => router.back()}>이전 페이지로</Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const totalPrice = product.salePrice * count;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {error && <Alert variant="destructive" className="mb-6"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
                {success && <Alert className="mb-6 border-green-200 bg-green-50 text-green-800"><CheckCircle className="h-4 w-4 text-green-600" /><AlertDescription>{success}</AlertDescription></Alert>}

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                                <Card>
                                    <CardContent className="p-0">
                                        <ProductImageGallery images={[product.imageUrl].filter(Boolean) as string[]} productName={product.name} />
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-teal-600 text-white shadow-md">{categoryLabels[product.category]}</Badge>
                                        </div>
                                        {product.originalPrice > product.salePrice && (
                                            <div className="absolute top-4 right-4">
                                                <Badge variant="destructive" className="text-lg font-bold shadow-md">
                                                    {Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)}%
                                                </Badge>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                                <Card>
                                    <CardContent className="p-4">
                                        <Tabs defaultValue="description">
                                            <TabsList className="grid w-full grid-cols-3">
                                                <TabsTrigger value="description">상품 설명</TabsTrigger>
                                                <TabsTrigger value="includes">포함/불포함</TabsTrigger>
                                                <TabsTrigger value="notice">유의사항</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="description" className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line p-2">
                                                {product.description}
                                            </TabsContent>
                                            <TabsContent value="includes" className="mt-4 p-2">
                                                <div className="space-y-2">
                                                    {product.includes?.map((item, index) => (
                                                        <div key={index} className="flex items-start gap-2">
                                                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                            <span>{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </TabsContent>
                                            <TabsContent value="notice" className="mt-4 p-2">
                                                <div className="flex items-start gap-2 text-sm text-gray-600 border border-yellow-200 bg-yellow-50 p-4 rounded-md">
                                                    <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                                    <p>예약 전 반드시 유의사항을 확인해주세요. 취소/환불 규정은 상품별로 다를 수 있습니다.</p>
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        <div className="lg:col-span-1">
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="sticky top-8">
                                <Card className="shadow-lg">
                                    <CardHeader>
                                        <div className="flex items-center gap-2 mb-2">
                                            <StarRating rating={Math.round(product.rating)} size="sm" />
                                            <span className="text-sm text-gray-600">({product.rating.toFixed(1)} / {reviews.length}개 리뷰)</span>
                                        </div>
                                        <CardTitle className="text-2xl font-bold text-navy-900">{product.name}</CardTitle>
                                        <div className="flex items-center gap-2 text-gray-600 pt-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{product.location}</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="text-right">
                                            {product.originalPrice > product.salePrice && (
                                                <p className="text-md text-gray-500 line-through">{product.originalPrice.toLocaleString()}원</p>
                                            )}
                                            <p className="text-3xl font-extrabold text-navy-900">{product.salePrice.toLocaleString()}원~</p>
                                            <p className="text-sm text-gray-600">{unitLabels[product.category] || "1인 기준"}</p>
                                        </div>
                                        <Separator />
                                        <div className="space-y-3">
                                            <Label>날짜 선택</Label>
                                            <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
                                            <Label>{bookingFieldLabels[product.category] || "수량"}</Label>
                                            <Input type="number" min={1} value={count} onChange={(e) => setCount(Math.max(1, Number(e.target.value)))} />
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between items-center text-lg font-bold">
                                            <span>총 예상 금액</span>
                                            <AnimatePresence mode="wait">
                                                <motion.span key={totalPrice} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="text-2xl text-teal-600">
                                                    {totalPrice.toLocaleString()}원
                                                </motion.span>
                                            </AnimatePresence>
                                        </div>
                                        <Button onClick={handleBooking} className="w-full bg-teal-600 hover:bg-teal-700 text-lg font-bold" size="lg">예약하기</Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>

                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                        <Card className="mt-8">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-navy-900 flex items-center gap-2"><MessageSquare className="w-5 h-5" />리뷰 ({reviews.length})</CardTitle>
                                        <CardDescription>다른 고객들의 생생한 후기를 확인해보세요.</CardDescription>
                                    </div>
                                    {isAuthenticated && (
                                        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                                            <DialogTrigger asChild><Button variant="outline">리뷰 작성</Button></DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>리뷰 작성</DialogTitle>
                                                </DialogHeader>
                                                <div className="flex items-center gap-1 my-4">
                                                    {[...Array(5)].map((_, i) => (
                                                        <button key={i} type="button" onClick={() => setReviewData({ ...reviewData, rating: i + 1 })}>
                                                            <Star className={`w-8 h-8 transition-colors ${i < reviewData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-300"}`} />
                                                        </button>
                                                    ))}
                                                </div>
                                                <Textarea placeholder="여행 경험을 자세히 알려주세요..." value={reviewData.content} onChange={(e) => setReviewData({ ...reviewData, content: e.target.value })} rows={4} />
                                                <div className="flex justify-end gap-2 mt-4">
                                                    <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>취소</Button>
                                                    <Button onClick={handleReviewSubmit}>리뷰 등록</Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ReviewSummary reviews={reviews} averageRating={product.rating} />
                                <div className="space-y-6">
                                    {reviews.length > 0 ? (
                                        reviews.map((review) => (
                                            <div key={review.id} className="flex gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-navy-700 flex-shrink-0">
                                                    {review.authorName.charAt(0)}
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-semibold text-navy-900">{review.authorName}</span>
                                                        <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <StarRating rating={review.rating} />
                                                    <p className="text-gray-700 mt-2 leading-relaxed">{review.content}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-gray-500">
                                            <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                                            <p className="font-semibold">아직 작성된 리뷰가 없습니다.</p>
                                            <p className="text-sm">이 상품의 첫 번째 리뷰를 남겨주세요!</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}