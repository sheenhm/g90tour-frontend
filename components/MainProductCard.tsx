"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Star,
    MapPin,
    Users,
    Building,
    TreePine,
    Plane,
    Clock,
    Car,
    Dumbbell,
    Calendar,
    Edit,
    Trash2,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Product } from "@/lib/product"

const categoryLabels: Record<string, string> = {
    HOTEL: "호텔",
    GOLF: "골프",
    TOUR: "패키지",
    SPA: "스파",
    ACTIVITY: "액티비티",
    VEHICLE: "차량",
}

function renderDetails(product: Product) {
    switch (product.category) {
        case "HOTEL":
            return (
                <div className="flex flex-col gap-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-navy-600" />
                        <span className="font-medium">{product.hotelDetails?.roomType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-navy-600" />
                        <span>최대 {product.hotelDetails?.capacity}명</span>
                    </div>
                </div>
            )
        case "GOLF":
            return (
                <div className="flex flex-col gap-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <TreePine className="w-4 h-4 text-green-600" />
                        <span>{(product.golfDetails?.golfClubName ?? []).join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span>{product.golfDetails?.round} 라운드</span>
                    </div>
                </div>
            )
        case "TOUR":
            return (
                <div className="flex flex-col gap-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Plane className="w-4 h-4 text-blue-600" />
                        <span>출발: {product.tourDetails?.departurePlace}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>{product.tourDetails?.durationDays}일 일정</span>
                    </div>
                </div>
            )
        case "SPA":
            return (
                <div className="flex flex-col gap-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-pink-600" />
                        <span>{product.spaDetails?.treatmentType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-pink-600" />
                        <span>{product.spaDetails?.durationMinutes}분</span>
                    </div>
                </div>
            )
        case "VEHICLE":
            return (
                <div className="flex flex-col gap-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-gray-700" />
                        <span>{product.vehicleDetails?.carName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-700" />
                        <span>{product.vehicleDetails?.passengerCapacity}인승</span>
                    </div>
                </div>
            )
        case "ACTIVITY":
            return (
                <div className="flex flex-col gap-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Dumbbell className="w-4 h-4 text-orange-600" />
                        <span>{product.activityDetails?.activityType}</span>
                    </div>
                    {product.activityDetails?.reservationDeadline && (
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-orange-600" />
                            <span>예약 마감 {product.activityDetails.reservationDeadline}</span>
                        </div>
                    )}
                </div>
            )
        default:
            return null
    }
}

interface ProductCardProps {
    product: Product
    isAdmin?: boolean
    onEdit?: (product: Product) => void
    onDelete?: (productId: string) => void
}

export default function ProductCard({
                                        product,
                                        isAdmin = false,
                                        onEdit,
                                        onDelete,
                                    }: ProductCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* 이미지 + 카테고리 배지 */}
            <div className="relative h-48 w-full">
                <Image
                    src={product.imageUrl || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover"
                />
                <Badge className="absolute top-2 left-2 bg-primary text-white">
                    {categoryLabels[product.category]}
                </Badge>
            </div>

            {/* 상품 제목, 평점, 위치 */}
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                    <div className="flex items-center text-yellow-500 ml-2">
                        <Star className="w-4 h-4 mr-1 fill-yellow-500" />
                        <span>{product.rating?.toFixed(1) ?? "0.0"}</span>
                    </div>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="line-clamp-1">{product.location}</span>
                </div>
            </CardHeader>

            {/* 상세 내용 */}
            <CardContent>
                {renderDetails(product)}

                {/* 가격 */}
                <div className="flex items-center gap-2 mt-3">
                    <span className="text-2xl font-bold text-navy-900">
                        {product.salePrice.toLocaleString()}원
                    </span>
                    {product.originalPrice > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                            {product.originalPrice.toLocaleString()}원
                        </span>
                    )}
                </div>

                {/* 버튼 영역 */}
                <div className="flex justify-end gap-2 mt-4">
                    {/* 고객용 상세보기 버튼 */}
                    {!isAdmin && (
                        <Button asChild className="bg-teal-600 hover:bg-teal-700">
                            <Link href={`/products/${product.id}`}>상세보기</Link>
                        </Button>
                    )}

                    {/* 관리자용 수정/삭제 버튼 */}
                    {isAdmin && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit?.(product)}
                            >
                                <Edit className="w-4 h-4 mr-1" /> 수정
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => onDelete?.(product.id)}
                            >
                                <Trash2 className="w-4 h-4" /> 비활성화
                            </Button>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}