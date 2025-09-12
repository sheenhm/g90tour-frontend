"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as Slider from "@radix-ui/react-slider"
import { Checkbox } from "@/components/ui/checkbox"
import { TreePine, SlidersHorizontal, Search } from "lucide-react"
import { productApi, type Product } from "@/lib/api"
import GolfCard from "@/components/GolfCard"
import { Skeleton } from "@/components/ui/skeleton"

const facilities = [
    { id: "caddy", label: "캐디 포함" },
    { id: "cart", label: "카트 포함" },
    { id: "meal", label: "식사 포함" },
    { id: "accommodation", label: "숙소 포함" },
]

export default function GolfPage() {
    const [golfPackages, setGolfPackages] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [destination, setDestination] = useState("")
    const [duration, setDuration] = useState("")
    const [players, setPlayers] = useState("4")
    const [sortBy, setSortBy] = useState("popular")

    // Filters
    const [priceRange, setPriceRange] = useState([0, 3000000])
    const [difficulty, setDifficulty] = useState<string>("all")
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])

    useEffect(() => {
        const fetchGolfPackages = async () => {
            try {
                setIsLoading(true)
                const response = await productApi.search({ category: "GOLF", size: 50 })
                setGolfPackages(response.content)
            } catch (error) {
                console.error("Failed to fetch golf packages:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchGolfPackages()
    }, [])

    const handleFacilityChange = (facilityId: string) => {
        setSelectedFacilities((prev) =>
            prev.includes(facilityId)
                ? prev.filter((id) => id !== facilityId)
                : [...prev, facilityId]
        )
    }

    const filteredAndSortedGolf = useMemo(() => {
        return golfPackages
            .filter((pkg) => {
                const byPrice = pkg.salePrice >= priceRange[0] && pkg.salePrice <= priceRange[1]
                const byDifficulty = difficulty === "all" || pkg.golfDetails?.difficulty === difficulty
                // '캐디', '카트' 등의 문자열이 `includes` 배열에 포함되어 있는지 확인
                const byFacilities = selectedFacilities.every(amenity => {
                    const keywords: {[key: string]: string[]} = {
                        caddy: ['캐디'],
                        cart: ['카트'],
                        meal: ['식사', '조식', '중식', '석식'],
                        accommodation: ['숙소', '호텔', '리조트']
                    };
                    return keywords[amenity]?.some(keyword =>
                        pkg.includes.some(item => item.includes(keyword))
                    ) ?? false;
                });
                return byPrice && byDifficulty && byFacilities;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "price-low": return a.salePrice - b.salePrice
                    case "price-high": return b.salePrice - a.salePrice
                    case "rating": return b.rating - a.rating
                    default: return b.id.localeCompare(a.id)
                }
            })
    }, [golfPackages, priceRange, difficulty, selectedFacilities, sortBy])

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative h-[400px] w-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center text-white">
                    <TreePine className="w-16 h-16 mb-4" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">프리미엄 골프 투어</h1>
                    <p className="text-lg md:text-xl text-gray-200">세계 최고의 골프장에서 특별한 라운딩을 경험하세요</p>
                </div>
            </section>

            {/* Search Section */}
            <section className="-mt-16 relative z-20 container mx-auto px-4">
                <Card className="shadow-lg">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                            <div className="space-y-2 md:col-span-1">
                                <Label htmlFor="destination">목적지</Label>
                                <Select value={destination} onValueChange={setDestination}>
                                    <SelectTrigger><SelectValue placeholder="골프 목적지" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="thailand">태국</SelectItem>
                                        <SelectItem value="vietnam">베트남</SelectItem>
                                        <SelectItem value="japan">일본</SelectItem>
                                        <SelectItem value="philippines">필리핀</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">기간</Label>
                                <Select value={duration} onValueChange={setDuration}>
                                    <SelectTrigger><SelectValue placeholder="여행 기간" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="3-4">3박 4일</SelectItem>
                                        <SelectItem value="4-5">4박 5일</SelectItem>
                                        <SelectItem value="5-6">5박 6일</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="players">인원</Label>
                                <Select value={players} onValueChange={setPlayers}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2">2명</SelectItem>
                                        <SelectItem value="4">4명</SelectItem>
                                        <SelectItem value="8">8명 이상</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button className="w-full md:col-span-2 bg-teal-600 hover:bg-teal-700 h-10">
                                <Search className="w-4 h-4 mr-2" />
                                골프 투어 검색
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
                                    <div className="space-y-4">
                                        <Label>그린피 (1인)</Label>
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
                                    </div>
                                    <div className="space-y-4">
                                        <Label>코스 난이도</Label>
                                        <div className="flex flex-col gap-2">
                                            {["all", "하", "중", "상"].map(level => (
                                                <Button key={level} variant={difficulty === level ? 'default' : 'outline'} onClick={() => setDifficulty(level)} className={difficulty === level ? "bg-navy-600" : ""}>
                                                    {level === 'all' ? '전체' : `난이도 ${level}`}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label>포함 옵션</Label>
                                        {facilities.map(facility => (
                                            <div key={facility.id} className="flex items-center gap-2">
                                                <Checkbox id={facility.id} checked={selectedFacilities.includes(facility.id)} onCheckedChange={() => handleFacilityChange(facility.id)} />
                                                <Label htmlFor={facility.id} className="text-sm font-normal">{facility.label}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </aside>

                        {/* Golf List */}
                        <div className="lg:col-span-3">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-navy-900">
                                    {filteredAndSortedGolf.length > 0 ? `${filteredAndSortedGolf.length}개의 골프 투어` : "추천 골프 투어"}
                                </h2>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="popular">인기순</SelectItem>
                                        <SelectItem value="price-low">가격 낮은순</SelectItem>
                                        <SelectItem value="price-high">가격 높은순</SelectItem>
                                        <SelectItem value="rating">평점순</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {isLoading ? (
                                    Array.from({ length: 6 }).map((_, index) => (
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
                                ) : filteredAndSortedGolf.map((pkg) => (
                                    <GolfCard key={pkg.id} pkg={pkg} />
                                ))}
                            </div>
                            {!isLoading && filteredAndSortedGolf.length === 0 && (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <p className="text-gray-500">조건에 맞는 골프 투어가 없습니다.</p>
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