"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Users, Calendar, Fuel, Settings } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Product } from "@/lib/api"

export default function VehicleCard({ product }: { product: Product }) {
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
                <Badge className="absolute top-3 left-3 bg-teal-600 hover:bg-teal-700">
                    {product.vehicleDetails?.vehicleType}
                </Badge>

                {product.vehicleDetails?.isDriverIncluded && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-navy-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-lg">
                        🚘 기사 포함
                    </div>
                )}
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
                <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-navy-900 mb-2">{product.vehicleDetails?.carName}</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-teal-600" />
                            <span>{product.vehicleDetails?.passengerCapacity}인승</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Settings className="w-4 h-4 text-teal-600" />
                            <span>자동(Auto)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Fuel className="w-4 h-4 text-teal-600" />
                            <span>{product.vehicleDetails?.gasType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-teal-600" />
                            <span>무제한</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-navy-900 mb-2">포함사항</h4>
                    <div className="flex flex-wrap gap-1">
                        {product.includes.slice(0, 4).map((item: string) => (
                            <Badge key={item} variant="secondary" className="text-xs">
                                {item}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-end pt-4 border-t">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-navy-900">
                                {product.salePrice.toLocaleString()}원
                            </span>
                            {product.originalPrice > product.salePrice && (
                                <span className="text-sm text-gray-500 line-through">
                                    {product.originalPrice.toLocaleString()}원
                                </span>
                            )}
                        </div>
                        <span className="text-sm text-gray-600">1일 기준</span>
                    </div>

                    <Link href={`/booking?type=vehicle&id=${product.id}`}>
                        <Button className="bg-teal-600 hover:bg-teal-700">견적 요청</Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}