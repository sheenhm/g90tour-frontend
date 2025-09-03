"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Users, Calendar, Dumbbell, Clock, AlertTriangle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Product } from "@/lib/product"

export default function ActivityCard({ product }: { product: Product }) {
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
                <Badge className="absolute top-3 left-3 bg-teal-600 hover:bg-teal-700">{product.activityDetails?.activityType}</Badge>
            </div>

            <CardHeader>
                <CardTitle className="text-xl text-navy-900">{product.name}</CardTitle>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{product.location}</span>
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
                <div>
                    <h4 className="font-semibold text-navy-900 mb-2">활동 내용</h4>
                    <div className="space-y-1">
                        {(product.activityDetails?.activities || []).slice(0, 6).map((act: string, index: number) => (
                            <p key={index} className="text-sm text-gray-600">
                                • {act}
                            </p>
                        ))}
                        {product.activityDetails?.activities && product.activityDetails?.activities.length > 6 && (
                            <p className="text-sm text-teal-600">외 {product.activityDetails?.activities.length - 6}개 활동</p>
                        )}
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-navy-900 mb-2">포함사항</h4>
                    <div className="flex flex-wrap gap-1">
                        {(product.includes || []).slice(0, 4).map((item: string) => (
                            <Badge key={item} variant="secondary" className="text-xs">
                                {item}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-600" />
                    <span className="font-semibold text-red-600">예약 마감: {product.activityDetails?.reservationDeadline}</span>
                </div>

                <div className="flex justify-between items-end pt-4 border-t">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-navy-900">{product.salePrice.toLocaleString()}원</span>
                            <span className="text-sm text-gray-500 line-through">{product.originalPrice.toLocaleString()}원</span>
                        </div>
                        <span className="text-sm text-gray-600">1인 기준</span>
                    </div>
                    <Link href={`/booking?type=activity&id=${product.id}`}>
                        <Button className="bg-teal-600 hover:bg-teal-700">견적 요청</Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}