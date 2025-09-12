import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Product } from "@/lib/api"
import { Star, MapPin, Wifi, Utensils, ParkingSquare, Dumbbell, Waves, Coffee } from "lucide-react"

interface Props {
    hotel: Product
}

// 편의시설 매핑
const amenityMapping: Record<string, { label: string; icon: React.ElementType }> = {
    wifi: { label: "무료 Wi-Fi", icon: Wifi },
    조식: { label: "조식 포함", icon: Utensils },
    주차: { label: "주차 가능", icon: ParkingSquare },
    수영장: { label: "수영장", icon: Waves },
    피트니스: { label: "피트니스 센터", icon: Dumbbell },
    라운지: { label: "라운지", icon: Coffee },
}

export default function HotelCard({ hotel }: Props) {
    const hasDiscount = hotel.originalPrice > hotel.salePrice
    const discountRate = hasDiscount ? Math.round(((hotel.originalPrice - hotel.salePrice) / hotel.originalPrice) * 100) : 0

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
            {/* 이미지 */}
            <div className="relative">
                <Image
                    src={hotel.imageUrl || "/placeholder.svg"}
                    alt={hotel.name}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-navy-900/80 backdrop-blur-sm text-white">
                        <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {hotel.rating.toFixed(1)}
                    </Badge>
                    {hasDiscount && <Badge variant="destructive">{discountRate}% OFF</Badge>}
                </div>
            </div>

            {/* 내용 */}
            <CardContent className="p-4 space-y-3">
                <h3 className="text-lg font-bold text-navy-900 truncate">{hotel.name}</h3>
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{hotel.location}</span>
                </div>

                {/* 편의시설 아이콘 + 텍스트 */}
                <div className="flex flex-wrap gap-3 text-gray-600 border-t pt-3 text-sm">
                    {hotel.includes.map((inc) => {
                        const key = Object.keys(amenityMapping).find((k) =>
                            inc.toLowerCase().includes(k.toLowerCase())
                        )
                        if (!key) return null
                        const AmenityIcon = amenityMapping[key].icon
                        return (
                            <div key={inc} className="flex items-center gap-1">
                                <AmenityIcon className="w-4 h-4" />
                                <span>{amenityMapping[key].label}</span>
                            </div>
                        )
                    })}
                </div>

                {/* 가격 */}
                <div className="flex justify-between items-end pt-2">
                    <div>
                        {hasDiscount && (
                            <p className="text-sm text-gray-500 line-through">
                                {hotel.originalPrice.toLocaleString()}원
                            </p>
                        )}
                        <p className="text-xl font-bold text-navy-900">
                            {hotel.salePrice.toLocaleString()}원
                            <span className="text-sm font-normal text-gray-600"> / 1박</span>
                        </p>
                    </div>
                    <Button asChild className="bg-teal-600 hover:bg-teal-700">
                        <Link href={`/products/${hotel.id}`}>상세보기</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}