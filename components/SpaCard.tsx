"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Clock, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { type Product } from "@/lib/product"

export default function SpaCard({ product }: { product: Product }) {
    const hasDiscount = product.originalPrice > product.salePrice;

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <div className="relative">
                <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-teal-600/80 backdrop-blur-sm text-white border-teal-500">
                        {product.spaDetails?.treatmentType}
                    </Badge>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <h3 className="text-lg font-bold text-white truncate">{product.name}</h3>
                </div>
            </div>

            <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{product.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium text-gray-800">
                            {product.rating?.toFixed(1) || "4.8"}
                        </span>
                    </div>
                </div>

                <div className="space-y-2 border-t pt-3 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-teal-600" />
                        <span className="font-medium">{product.spaDetails?.durationMinutes}분 프로그램</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-teal-600" />
                        <span className="truncate">
                           {(product.spaDetails?.treatmentOptions ?? []).slice(0, 2).join(", ")}
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-end pt-2">
                    <div>
                        {hasDiscount && (
                            <p className="text-sm text-gray-500 line-through">
                                {product.originalPrice.toLocaleString()}원
                            </p>
                        )}
                        <p className="text-xl font-bold text-navy-900">
                            {product.salePrice.toLocaleString()}원
                            <span className="text-sm font-normal text-gray-600"> / 1인</span>
                        </p>
                    </div>
                    <Button asChild className="bg-teal-600 hover:bg-teal-700">
                        <Link href={`/products/${product.id}`}>상세보기</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}