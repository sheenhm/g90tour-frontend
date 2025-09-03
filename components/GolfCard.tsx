"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Users, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { type Product } from "@/lib/api"

export default function GolfCard({ pkg }: { pkg: Product }) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* 이미지 + 라벨 */}
            <div className="relative">
                <Image
                    src={pkg.imageUrl || "/placeholder.svg"}
                    alt={pkg.name}
                    width={400}
                    height={250}
                    className="w-full h-64 object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-teal-600 hover:bg-teal-700">
                    {pkg.golfDetails?.round || 3}라운드
                </Badge>
                <Badge className="absolute top-3 right-3 bg-navy-600 hover:bg-navy-700">
                    {pkg.golfDetails?.difficulty || "중급"}
                </Badge>
            </div>

            {/* 헤더 */}
            <CardHeader>
                <CardTitle className="text-xl text-navy-900">{pkg.name}</CardTitle>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{pkg.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                            {pkg.rating?.toFixed(1) || "4.5"}
                        </span>
                    </div>
                </div>
            </CardHeader>

            {/* 본문 */}
            <CardContent className="space-y-4">
                {/* 포함사항 */}
                <div>
                    <h4 className="font-semibold text-navy-900 mb-2">포함사항</h4>
                    <div className="flex flex-wrap gap-1">
                        {pkg.includes?.slice(0, 4).map((item) => (
                            <Badge key={item} variant="secondary" className="text-xs">
                                {item}
                            </Badge>
                        ))}
                        {pkg.includes && pkg.includes.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                                +{pkg.includes.length - 4}개
                            </Badge>
                        )}
                    </div>
                </div>

                {/* 가격 + 버튼 */}
                <div className="flex justify-between items-end pt-4 border-t">
                    <div>
                        <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-navy-900">
                {pkg.salePrice.toLocaleString()}원
              </span>
                            {pkg.originalPrice > 0 && (
                                <span className="text-sm text-gray-500 line-through">
                  {pkg.originalPrice.toLocaleString()}원
                </span>
                            )}
                        </div>
                        <span className="text-sm text-gray-600">1인 기준</span>
                    </div>
                    <Link href={`/products/${pkg.id}`}>
                        <Button className="bg-teal-600 hover:bg-teal-700">견적 요청</Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}