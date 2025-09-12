"use client"

import {useEffect, useState, useMemo} from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import * as Slider from "@radix-ui/react-slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Plane, SlidersHorizontal, Search } from "lucide-react"
import {Product, productApi} from "@/lib/product";
import TourCard from "@/components/TourCard";
import { Skeleton } from "@/components/ui/skeleton"

const tourThemes = [
    { id: "culture", label: "문화탐방" },
    { id: "nature", label: "자연/휴양" },
    { id: "adventure", label: "어드벤처" },
    { id: "foodie", label: "미식기행" },
];

export default function ToursPage() {
    const [tours, setTours] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [destination, setDestination] = useState("")
    const [duration, setDuration] = useState("")
    const [travelers, setTravelers] = useState("2")
    const [sortBy, setSortBy] = useState("popular")

    // Filters
    const [priceRange, setPriceRange] = useState([0, 1000000])
    const [selectedThemes, setSelectedThemes] = useState<string[]>([])

    useEffect(() => {
        const fetchTours = async () => {
            try {
                setIsLoading(true)
                const response = await productApi.search({ category: "TOUR", size: 50 })
                setTours(response.content)
            } catch (error) {
                console.error("Failed to fetch tours:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchTours()
    }, [])

    const handleThemeChange = (themeId: string) => {
        setSelectedThemes((prev) =>
            prev.includes(themeId)
                ? prev.filter((id) => id !== themeId)
                : [...prev, themeId]
        )
    }

    const filteredAndSortedTours = useMemo(() => {
        return tours
            .filter((tour) => {
                const byPrice = tour.salePrice >= priceRange[0] && tour.salePrice <= priceRange[1]
                const byTheme = selectedThemes.length === 0 || selectedThemes.some(theme => tour.tourDetails?.tourType?.toLowerCase().includes(theme));
                return byPrice && byTheme;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "price-low": return a.salePrice - b.salePrice
                    case "price-high": return b.salePrice - a.salePrice
                    case "rating": return b.rating - a.rating
                    default: return b.id.localeCompare(a.id)
                }
            })
    }, [tours, priceRange, selectedThemes, sortBy])

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative h-[400px] w-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=2070&auto=format&fit=crop')"}}>
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center text-white">
                    <Plane className="w-16 h-16 mb-4 animate-pulse" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">잊지 못할 패키지 여행</h1>
                    <p className="text-lg md:text-xl text-gray-200">전 세계 명소를 편안하고 특별하게 여행하세요</p>
                </div>
            </section>

            {/* Search Section */}
            <section className="-mt-16 relative z-20 container mx-auto px-4">
                <Card className="shadow-lg">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                            <div className="space-y-2 md:col-span-1">
                                <Label htmlFor="destination">목적지</Label>
                                <Input id="destination" placeholder="예: 유럽, 아시아" value={destination} onChange={e => setDestination(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">기간</Label>
                                <Select value={duration} onValueChange={setDuration}>
                                    <SelectTrigger><SelectValue placeholder="여행 기간" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="3-5">3-5일</SelectItem>
                                        <SelectItem value="6-8">6-8일</SelectItem>
                                        <SelectItem value="9-12">9-12일</SelectItem>
                                        <SelectItem value="over-12">12일 이상</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="travelers">인원</Label>
                                <Select value={travelers} onValueChange={setTravelers}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1명</SelectItem>
                                        <SelectItem value="2">2명</SelectItem>
                                        <SelectItem value="3-4">3-4명</SelectItem>
                                        <SelectItem value="5+">5명 이상</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button className="w-full md:col-span-2 bg-teal-600 hover:bg-teal-700 h-10">
                                <Search className="w-4 h-4 mr-2"/>
                                투어 검색
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
                                    <div className="space-y-3">
                                        <Label>여행 테마</Label>
                                        {tourThemes.map(theme => (
                                            <div key={theme.id} className="flex items-center gap-2">
                                                <Checkbox id={theme.id} checked={selectedThemes.includes(theme.id)} onCheckedChange={() => handleThemeChange(theme.id)} />
                                                <Label htmlFor={theme.id} className="text-sm font-normal">{theme.label}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </aside>

                        {/* Tours List */}
                        <div className="lg:col-span-3">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-navy-900">
                                    {filteredAndSortedTours.length > 0 ? `${filteredAndSortedTours.length}개의 투어` : "추천 투어 상품"}
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
                                ) : filteredAndSortedTours.map((tour) => <TourCard key={tour.id} product={tour} />)}
                            </div>
                            {!isLoading && filteredAndSortedTours.length === 0 && (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <p className="text-gray-500">조건에 맞는 투어가 없습니다.</p>
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