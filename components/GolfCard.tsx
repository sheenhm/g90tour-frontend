"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Users, Calendar, Flag, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { type Product } from "@/lib/api"

export default function GolfCard({ pkg }: { pkg: Product }) {
    const hasDiscount = pkg.originalPrice > pkg.salePrice;

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <div className="relative">
                <Image
                    src={pkg.imageUrl || "/placeholder.svg"}
                    alt={pkg.name}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-teal-600/80 backdrop-blur-sm text-white border-teal-500">
                        {pkg.golfDetails?.round || 3} 라운드
                    </Badge>
                    <Badge className="bg-navy-900/80 backdrop-blur-sm text-white border-navy-700">
                        난이도 {pkg.golfDetails?.difficulty || "중"}
                    </Badge>
                </div>
            </div>

            <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{pkg.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium text-gray-800">
                            {pkg.rating?.toFixed(1) || "4.5"}
                        </span>
                    </div>
                </div>
                <h3 className="text-lg font-bold text-navy-900 truncate">{pkg.name}</h3>

                <div className="space-y-2 border-t pt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Flag className="w-4 h-4 text-teal-600" />
                        <span className="font-medium truncate">
                            {(pkg.golfDetails?.golfClubName ?? []).join(", ")}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-teal-600" />
                        <span className="truncate">
                           {pkg.includes?.slice(0, 2).join(", ")}
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-end pt-2">
                    <div>
                        {hasDiscount && (
                            <p className="text-sm text-gray-500 line-through">
                                {pkg.originalPrice.toLocaleString()}원
                            </p>
                        )}
                        <p className="text-xl font-bold text-navy-900">
                            {pkg.salePrice.toLocaleString()}원
                            <span className="text-sm font-normal text-gray-600"> / 1인</span>
                        </p>
                    </div>
                    <Button asChild className="bg-teal-600 hover:bg-teal-700">
                        <Link href={`/products/${pkg.id}`}>상세보기</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}