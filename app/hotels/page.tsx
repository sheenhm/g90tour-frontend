"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Building, MapPin, Star } from "lucide-react"
import Image from "next/image"
import { productApi, type Product } from "@/lib/api"
import Link from "next/link"
import HotelCard from "@/components/HotelCard";

export default function HotelsPage() {
    const [hotels, setHotels] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchLocation, setSearchLocation] = useState("")
    const [checkIn, setCheckIn] = useState("")
    const [checkOut, setCheckOut] = useState("")
    const [guests, setGuests] = useState("2")

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                setIsLoading(true)
                const response = await productApi.search({ category: "HOTEL", size: 10 })
                setHotels(response.content)
            } catch (error) {
                console.error("Failed to fetch hotels:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchHotels()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-navy-900 to-teal-800 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <Building className="w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-4xl font-bold mb-4">호텔 & 리조트</h1>
                        <p className="text-xl text-gray-200">여행의 피로를 풀어줄 특별한 공간을 만나보세요</p>
                    </div>

                    {/* Search Form */}
                    <Card className="max-w-4xl mx-auto">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="location">목적지</Label>
                                    <Input
                                        id="location"
                                        placeholder="도시 또는 호텔명"
                                        value={searchLocation}
                                        onChange={(e) => setSearchLocation(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="checkin">체크인</Label>
                                    <Input id="checkin" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="checkout">체크아웃</Label>
                                    <Input id="checkout" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="guests">투숙객</Label>
                                    <Select value={guests} onValueChange={setGuests}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1명</SelectItem>
                                            <SelectItem value="2">2명</SelectItem>
                                            <SelectItem value="3">3명</SelectItem>
                                            <SelectItem value="4">4명</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button className="w-full mt-6 bg-teal-600 hover:bg-teal-700">호텔 검색</Button>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Hotels List */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-navy-900">추천 호텔</h2>
                        <Select defaultValue="popular">
                            <SelectTrigger className="w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="popular">인기순</SelectItem>
                                <SelectItem value="price-low">가격 낮은순</SelectItem>
                                <SelectItem value="price-high">가격 높은순</SelectItem>
                                <SelectItem value="rating">평점순</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, index) => (
                                <Card key={index} className="overflow-hidden">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="md:w-2/5 bg-gray-200 animate-pulse h-64 md:h-auto"></div>
                                        <div className="md:w-3/5 p-6 space-y-4">
                                            <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                                            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                            <div className="flex justify-between items-end mt-4">
                                                <div className="space-y-2">
                                                    <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                                                </div>
                                                <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : hotels.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}
                    </div>
                </div>
            </section>
        </div>
    )
}