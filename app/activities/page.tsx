"use client"

import {useEffect, useState, useMemo} from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import * as Slider from "@radix-ui/react-slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Dumbbell, SlidersHorizontal, Search } from "lucide-react"
import {Product, productApi} from "@/lib/product";
import ActivityCard from "@/components/ActivityCard";
import { Skeleton } from "@/components/ui/skeleton"

const activityTypes = [
    { id: "extreme", label: "익스트림 스포츠" },
    { id: "water", label: "수상 액티비티" },
    { id: "nature", label: "자연/트래킹" },
    { id: "culture", label: "문화/클래스" },
]

export default function ActivitiesPage() {
    const [activities, setActivities] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortBy, setSortBy] = useState("popular")

    // Filters
    const [priceRange, setPriceRange] = useState([0, 500000])
    const [selectedTypes, setSelectedTypes] = useState<string[]>([])

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setIsLoading(true)
                const response = await productApi.search({ category: "ACTIVITY", size: 50 })
                setActivities(response.content)
            } catch (error) {
                console.error("Failed to fetch activities:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchActivities()
    }, [])

    const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
        setter((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        )
    }

    const filteredAndSortedActivities = useMemo(() => {
        return activities
            .filter((activity) => {
                const bySearch = searchTerm === "" || activity.name.toLowerCase().includes(searchTerm.toLowerCase())
                const byPrice = activity.salePrice >= priceRange[0] && activity.salePrice <= priceRange[1]
                const byType = selectedTypes.length === 0 || selectedTypes.some(type => activity.activityDetails?.activityType?.toLowerCase().includes(type));
                return bySearch && byPrice && byType
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "price-low": return a.salePrice - b.salePrice
                    case "price-high": return b.salePrice - a.salePrice
                    case "rating": return b.rating - a.rating
                    default: return b.id.localeCompare(a.id)
                }
            })
    }, [activities, searchTerm, priceRange, selectedTypes, sortBy])

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative h-[400px] w-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}}>
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center text-white">
                    <Dumbbell className="w-16 h-16 mb-4" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">액티비티 & 어드벤처</h1>
                    <p className="text-lg md:text-xl text-gray-200">스릴 넘치는 모험과 특별한 경험을 만나보세요</p>
                </div>
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
                                        <Label>액티비티 종류</Label>
                                        {activityTypes.map(type => (
                                            <div key={type.id} className="flex items-center gap-2">
                                                <Checkbox id={type.id} checked={selectedTypes.includes(type.id)} onCheckedChange={() => handleFilterChange(setSelectedTypes, type.id)} />
                                                <Label htmlFor={type.id} className="text-sm font-normal">{type.label}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </aside>

                        {/* Activities List */}
                        <div className="lg:col-span-3">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <div className="relative w-full md:w-auto flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="액티비티 검색..."
                                        className="pl-9"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">정렬:</span>
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="popular">인기순</SelectItem>
                                            <SelectItem value="price-low">가격 낮은순</SelectItem>
                                            <SelectItem value="price-high">가격 높은순</SelectItem>
                                            <SelectItem value="rating">평점순</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
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
                                ) : filteredAndSortedActivities.map((activity) => <ActivityCard key={activity.id} product={activity} />)}
                            </div>
                            {!isLoading && filteredAndSortedActivities.length === 0 && (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <p className="text-gray-500">조건에 맞는 액티비티가 없습니다.</p>
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