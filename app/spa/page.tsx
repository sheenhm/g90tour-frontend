"use client"

import {useEffect, useState, useMemo} from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as Slider from "@radix-ui/react-slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Waves, SlidersHorizontal, Search } from "lucide-react"
import {productApi, type Product} from "@/lib/product";
import SpaCard from "@/components/SpaCard";
import { Skeleton } from "@/components/ui/skeleton"

const treatmentTypes = [
    { id: "massage", label: "마사지" },
    { id: "facial", label: "페이셜" },
    { id: "body", label: "바디 트리트먼트" },
    { id: "wellness", label: "웰니스 프로그램" },
]

export default function SpaPage() {
    const [spas, setSpas] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [destination, setDestination] = useState("")
    const [guests, setGuests] = useState("2")
    const [sortBy, setSortBy] = useState("popular")

    // Filters
    const [priceRange, setPriceRange] = useState([0, 100000])
    const [selectedTypes, setSelectedTypes] = useState<string[]>([])
    const [duration, setDuration] = useState<string>("all")

    useEffect(() => {
        const fetchSpas = async () => {
            try {
                setIsLoading(true)
                const response = await productApi.search({ category: "SPA", size: 50 })
                setSpas(response.content)
            } catch (error) {
                console.error("Failed to fetch spas:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchSpas()
    }, [])

    const handleTypeChange = (typeId: string) => {
        setSelectedTypes((prev) =>
            prev.includes(typeId)
                ? prev.filter((id) => id !== typeId)
                : [...prev, typeId]
        )
    }

    const filteredAndSortedSpas = useMemo(() => {
        return spas
            .filter((spa) => {
                const byPrice = spa.salePrice >= priceRange[0] && spa.salePrice <= priceRange[1]

                const byType = selectedTypes.length === 0 || selectedTypes.some(type => {
                    const keywords: {[key: string]: string[]} = {
                        massage: ['마사지', '맛사지'],
                        facial: ['페이셜', '얼굴'],
                        body: ['바디', '전신'],
                        wellness: ['웰니스', '프로그램']
                    };
                    return keywords[type]?.some(keyword =>
                        spa.spaDetails?.treatmentType?.toLowerCase().includes(keyword) ||
                        spa.spaDetails?.treatmentOptions?.some(opt => opt.toLowerCase().includes(keyword))
                    ) ?? false;
                });

                const byDuration = duration === 'all' || (
                    duration === 'under60' && (spa.spaDetails?.durationMinutes ?? 0) <= 60 ||
                    duration === '60to90' && (spa.spaDetails?.durationMinutes ?? 0) > 60 && (spa.spaDetails?.durationMinutes ?? 0) <= 90 ||
                    duration === 'over90' && (spa.spaDetails?.durationMinutes ?? 0) > 90
                );

                return byPrice && byType && byDuration;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "price-low": return a.salePrice - b.salePrice
                    case "price-high": return b.salePrice - a.salePrice
                    case "rating": return b.rating - a.rating
                    default: return b.id.localeCompare(a.id)
                }
            })
    }, [spas, priceRange, selectedTypes, duration, sortBy])

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative h-[400px] w-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}}>
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center text-white">
                    <Waves className="w-16 h-16 mb-4" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">스파 & 웰니스</h1>
                    <p className="text-lg md:text-xl text-gray-200">몸과 마음의 완전한 힐링을 경험하세요</p>
                </div>
            </section>

            {/* Search Section */}
            <section className="-mt-16 relative z-20 container mx-auto px-4">
                <Card className="shadow-lg">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div className="space-y-2 md:col-span-1">
                                <Label htmlFor="destination">목적지</Label>
                                <Select value={destination} onValueChange={setDestination}>
                                    <SelectTrigger><SelectValue placeholder="스파 목적지" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bali">발리</SelectItem>
                                        <SelectItem value="thailand">태국</SelectItem>
                                        <SelectItem value="japan">일본</SelectItem>
                                        <SelectItem value="korea">한국</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="guests">인원</Label>
                                <Select value={guests} onValueChange={setGuests}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1명</SelectItem>
                                        <SelectItem value="2">2명</SelectItem>
                                        <SelectItem value="3-4">3-4명 (그룹)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button className="w-full md:col-span-2 bg-teal-600 hover:bg-teal-700 h-10">
                                <Search className="w-4 h-4 mr-2"/>
                                스파 검색
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
                                        <Label>가격대 (1인)</Label>
                                        <Slider.Root
                                            value={priceRange}
                                            onValueChange={setPriceRange}
                                            min={0}
                                            max={100000}
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
                                        <Label>프로그램 시간</Label>
                                        <div className="flex flex-col gap-2">
                                            {[{id: 'all', label: '전체'}, {id: 'under60', label: '60분 이하'}, {id: '60to90', label: '60-90분'}, {id: 'over90', label: '90분 이상'}].map(d => (
                                                <Button key={d.id} variant={duration === d.id ? 'default' : 'outline'} onClick={() => setDuration(d.id)} className={duration === d.id ? "bg-navy-600" : ""}>
                                                    {d.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label>트리트먼트 종류</Label>
                                        {treatmentTypes.map(type => (
                                            <div key={type.id} className="flex items-center gap-2">
                                                <Checkbox id={type.id} checked={selectedTypes.includes(type.id)} onCheckedChange={() => handleTypeChange(type.id)} />
                                                <Label htmlFor={type.id} className="text-sm font-normal">{type.label}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </aside>

                        {/* Spa List */}
                        <div className="lg:col-span-3">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-navy-900">
                                    {filteredAndSortedSpas.length > 0 ? `${filteredAndSortedSpas.length}개의 스파 & 웰니스` : "추천 스파 & 웰니스"}
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
                                ) : filteredAndSortedSpas.map((spa) => <SpaCard key={spa.id} product={spa} />)}
                            </div>
                            {!isLoading && filteredAndSortedSpas.length === 0 && (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <p className="text-gray-500">조건에 맞는 상품이 없습니다.</p>
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