"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as Slider from "@radix-ui/react-slider"
import { Checkbox } from "@/components/ui/checkbox"
import {Building, MapPin, Star, SlidersHorizontal, Search, Badge} from "lucide-react"
import { productApi, type Product } from "@/lib/api"
import HotelCard from "@/components/HotelCard"
import { Skeleton } from "@/components/ui/skeleton"


const amenities = [
    { id: "wifi", label: "무료 Wi-Fi" },
    { id: "pool", label: "수영장" },
    { id: "fitness", label: "피트니스 센터" },
    { id: "parking", label: "주차 가능" },
    { id: "breakfast", label: "조식 포함" },
]

export default function HotelsPage() {
    const [hotels, setHotels] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchLocation, setSearchLocation] = useState("")
    const [checkIn, setCheckIn] = useState("")
    const [checkOut, setCheckOut] = useState("")
    const [guests, setGuests] = useState("2")
    const [sortBy, setSortBy] = useState("popular")

    // Filters
    const [priceRange, setPriceRange] = useState([0, 1000000])
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

    const amenityMapping: Record<string, string> = {
        wifi: "wifi",
        pool: "수영장",
        fitness: "피트니스",
        parking: "주차",
        breakfast: "조식",
    }

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                setIsLoading(true)
                const response = await productApi.search({ category: "HOTEL", size: 50 }) // 더 많은 데이터를 가져옵니다
                setHotels(response.content)
            } catch (error) {
                console.error("Failed to fetch hotels:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchHotels()
    }, [])

    const handleAmenityChange = (amenityId: string) => {
        setSelectedAmenities((prev) =>
            prev.includes(amenityId)
                ? prev.filter((id) => id !== amenityId)
                : [...prev, amenityId]
        )
    }

    const filteredAndSortedHotels = useMemo(() => {
        return hotels
            .filter((hotel) => {
                const byPrice = hotel.salePrice >= priceRange[0] && hotel.salePrice <= priceRange[1]
                const byAmenities = selectedAmenities.every((amenity) =>
                    hotel.includes.some(
                        (hotelAmenity) =>
                            hotelAmenity.toLowerCase().includes(amenityMapping[amenity])
                    )
                )
                return byPrice && byAmenities
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "price-low":
                        return a.salePrice - b.salePrice
                    case "price-high":
                        return b.salePrice - a.salePrice
                    default: // popular
                        return b.id.localeCompare(a.id) // 임시 정렬
                }
            })
    }, [hotels, priceRange, selectedAmenities, sortBy])

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative h-[400px] w-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center text-white">
                    <Building className="w-16 h-16 mb-4" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">최고의 호텔 & 리조트</h1>
                    <p className="text-lg md:text-xl text-gray-200">여행의 피로를 풀어줄 특별한 공간을 만나보세요</p>
                </div>
            </section>

            {/* Search and Filter Section */}
            <section className="-mt-16 relative z-20 container mx-auto px-4">
                <Card className="shadow-lg">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                            <div className="space-y-2 md:col-span-1">
                                <Label htmlFor="location">목적지</Label>
                                <Input id="location" placeholder="도시 또는 호텔명" value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} />
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
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1명</SelectItem>
                                        <SelectItem value="2">2명</SelectItem>
                                        <SelectItem value="3">3명</SelectItem>
                                        <SelectItem value="4">4명</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button className="w-full bg-teal-600 hover:bg-teal-700 h-10">
                                <Search className="w-4 h-4 mr-2" />
                                호텔 검색
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Main Content */}
            <main className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Filters Sidebar */}
                        <aside className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-navy-900 flex items-center gap-2">
                                        <SlidersHorizontal className="w-5 h-5" />
                                        상세 필터
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <Label>가격대 (1박)</Label>
                                    {/* Price Range */}
                                    <Slider.Root
                                        value={priceRange}
                                        onValueChange={setPriceRange}
                                        min={0}
                                        max={1000000}
                                        step={10000}
                                        className="relative flex items-center select-none touch-none w-full h-5"
                                    >
                                        <Slider.Track className="bg-gray-200 relative grow rounded-full h-1">
                                            <Slider.Range className="absolute bg-teal-600 rounded-full h-full" />
                                        </Slider.Track>
                                        <Slider.Thumb className="block w-5 h-5 bg-white border border-gray-300 rounded-full shadow" />
                                        <Slider.Thumb className="block w-5 h-5 bg-white border border-gray-300 rounded-full shadow" />
                                    </Slider.Root>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>{priceRange[0].toLocaleString()}원</span>
                                        <span>{priceRange[1].toLocaleString()}원+</span>
                                    </div>

                                    {/* Amenities */}
                                    <div className="space-y-3">
                                        <Label>편의시설</Label>
                                        {amenities.map(amenity => (
                                            <div key={amenity.id} className="flex items-center gap-2">
                                                <Checkbox id={amenity.id} checked={selectedAmenities.includes(amenity.id)} onCheckedChange={() => handleAmenityChange(amenity.id)} />
                                                <Label htmlFor={amenity.id} className="text-sm font-normal">{amenity.label}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </aside>

                        {/* Hotels List */}
                        <div className="lg:col-span-3">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-navy-900">
                                    {filteredAndSortedHotels.length > 0
                                        ? `${filteredAndSortedHotels.length}개의 호텔`
                                        : "추천 호텔"}
                                </h2>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="popular">인기순</SelectItem>
                                        <SelectItem value="price-low">가격 낮은순</SelectItem>
                                        <SelectItem value="price-high">가격 높은순</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {isLoading ? (
                                    Array.from({ length: 4 }).map((_, index) => (
                                        <Card key={index} className="overflow-hidden">
                                            <Skeleton className="h-48 w-full" />
                                            <CardContent className="p-4 space-y-3">
                                                <Skeleton className="h-5 w-3/4" />
                                                <Skeleton className="h-4 w-1/2" />
                                                <div className="flex justify-between items-end pt-2">
                                                    <Skeleton className="h-8 w-1/3" />
                                                    <Skeleton className="h-10 w-1/4" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : filteredAndSortedHotels.map((hotel) => (
                                    <HotelCard key={hotel.id} hotel={hotel} />
                                ))}
                            </div>

                            {!isLoading && filteredAndSortedHotels.length === 0 && (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <p className="text-gray-500">조건에 맞는 호텔이 없습니다.</p>
                                        <p className="text-sm text-gray-400 mt-2">필터를 조정하여 다시 검색해보세요.</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}