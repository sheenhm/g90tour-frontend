"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Product } from "@/lib/api"
import { Star, MapPin } from "lucide-react"

interface Props {
    hotel: Product
}

export default function HotelCard({ hotel }: Props) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5">
                    <Image
                        src={hotel.imageUrl || "/placeholder.svg"}
                        alt={hotel.name}
                        width={400}
                        height={250}
                        className="w-full h-64 md:h-full object-cover"
                    />
                </div>
                <div className="md:w-3/5 p-6">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-navy-900">{hotel.name}</h3>
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">
                                {hotel.rating.toFixed(1)}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 text-gray-600 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{hotel.location}</span>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">{hotel.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {hotel.includes.slice(0, 4).map((amenity) => (
                            <Badge key={amenity} variant="secondary" className="text-xs">
                                {amenity}
                            </Badge>
                        ))}
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-navy-900">
                  {hotel.salePrice.toLocaleString()}원
                </span>
                                {hotel.originalPrice > 0 && (
                                    <span className="text-sm text-gray-500 line-through">
                    {hotel.originalPrice.toLocaleString()}원
                  </span>
                                )}
                            </div>
                            <span className="text-sm text-gray-600">1박 기준</span>
                        </div>
                        <Button asChild className="bg-teal-600 hover:bg-teal-700">
                            <Link href={`/products/${hotel.id}`}>상세보기</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}