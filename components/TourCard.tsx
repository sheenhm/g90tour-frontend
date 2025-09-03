"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Users, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Product } from "@/lib/product"

export default function TourCard({ product }: { product: Product }) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
                <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={250}
                    className="w-full h-64 object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-teal-600 hover:bg-teal-700">{product.tourDetails?.tourType}</Badge>
                <Badge className="absolute top-3 right-3 bg-navy-600 hover:bg-navy-700">{product.tourDetails?.durationDays}</Badge>
            </div>

            <CardHeader>
                <CardTitle className="text-xl text-navy-900">{product.name}</CardTitle>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{product.tourDetails?.majorCities.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                            {product.rating?.toFixed(1) || "4.5"}
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-teal-600" />
                        <span>{product.tourDetails?.durationDays}</span>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-navy-900 mb-2">주요 도시</h4>
                    <div className="flex flex-wrap gap-1">
                        {product.tourDetails?.majorCities.map((city) => (
                            <Badge key={city} variant="outline" className="text-xs">{city}</Badge>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-navy-900 mb-2">주요 관광지</h4>
                    <div className="space-y-1">
                        {product.tourDetails?.majorSpots?.slice(0, 3).map((highlight, index) => (
                            <p key={index} className="text-sm text-gray-600">• {highlight}</p>
                        ))}
                        {(product.tourDetails?.majorSpots?.length ?? 0) > 3 && (
                            <p className="text-sm text-teal-600">
                                외 {(product.tourDetails?.majorSpots?.length ?? 0) - 3}개 명소
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-navy-900 mb-2">포함사항</h4>
                    <div className="flex flex-wrap gap-1">
                        {product.includes.slice(0, 4).map((item) => (
                            <Badge key={item} variant="secondary" className="text-xs">{item}</Badge>
                        ))}
                        {product.includes.length > 4 && (
                            <Badge variant="secondary" className="text-xs">+{product.includes.length - 4}개</Badge>
                        )}
                    </div>
                </div>

                <div className="flex justify-between items-end pt-4 border-t">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-navy-900">{product.salePrice.toLocaleString()}원</span>
                            <span className="text-sm text-gray-500 line-through">{product.originalPrice.toLocaleString()}원</span>
                        </div>
                        <span className="text-sm text-gray-600">1인 기준</span>
                    </div>
                    <Link href={`/booking?type=tour&id=${product.id}`}>
                        <Button className="bg-teal-600 hover:bg-teal-700">견적 요청</Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}