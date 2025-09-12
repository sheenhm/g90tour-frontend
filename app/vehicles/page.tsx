"use client"

import {useEffect, useState, useMemo} from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import * as Slider from "@radix-ui/react-slider"
import { Car, SlidersHorizontal, Search, Users, Fuel } from "lucide-react"
import {Product, productApi} from "@/lib/product";
import VehicleCard from "@/components/VehicleCard";
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input";

const vehicleTypes = [
    { id: "compact", label: "소형/준중형" },
    { id: "sedan", label: "중형" },
    { id: "suv", label: "SUV" },
    { id: "van", label: "승합차" },
    { id: "luxury", label: "고급/수입차" },
];

const vehicleOptions = [
    { id: "driver", label: "운전기사 포함" },
    { id: "navigation", label: "네비게이션" },
    { id: "bluetooth", label: "블루투스" },
];

export default function VehiclesPage() {
    const [vehicles, setVehicles] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortBy, setSortBy] = useState("popular")

    // Search Section State
    const [searchLocation, setSearchLocation] = useState("")
    const [rentalDate, setRentalDate] = useState("")
    const [returnDate, setReturnDate] = useState("")

    // Filters
    const [priceRange, setPriceRange] = useState([0, 500000])
    const [selectedTypes, setSelectedTypes] = useState<string[]>([])
    const [selectedOptions, setSelectedOptions] = useState<string[]>([])

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                setIsLoading(true)
                const response = await productApi.search({ category: "VEHICLE", size: 50 })
                setVehicles(response.content)
            } catch (error) {
                console.error("Failed to fetch vehicles:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchVehicles()
    }, [])

    const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
        setter((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        )
    }

    const filteredAndSortedVehicles = useMemo(() => {
        return vehicles
            .filter((vehicle) => {
                const bySearch = searchTerm === "" || vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) || vehicle.vehicleDetails?.carName?.toLowerCase().includes(searchTerm.toLowerCase())
                const byPrice = vehicle.salePrice >= priceRange[0] && vehicle.salePrice <= priceRange[1]
                const byType = selectedTypes.length === 0 || selectedTypes.some(type => vehicle.vehicleDetails?.vehicleType?.toLowerCase().includes(type));
                const byOptions = selectedOptions.length === 0 || selectedOptions.every(option => {
                    if (option === 'driver') return vehicle.vehicleDetails?.isDriverIncluded;
                    // 다른 옵션들은 product.includes에 포함되어 있다고 가정
                    return vehicle.includes.some(inc => inc.toLowerCase().includes(option));
                });

                return bySearch && byPrice && byType && byOptions;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "price-low": return a.salePrice - b.salePrice
                    case "price-high": return b.salePrice - a.salePrice
                    case "rating": return b.rating - a.rating
                    default: return b.id.localeCompare(a.id)
                }
            })
    }, [vehicles, searchTerm, priceRange, selectedTypes, selectedOptions, sortBy])


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative h-[400px] w-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}}>
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center text-white">
                    <Car className="w-16 h-16 mb-4" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">프리미엄 차량 렌탈</h1>
                    <p className="text-lg md:text-xl text-gray-200">편안하고 안전한 여행을 위한 완벽한 선택</p>
                </div>
            </section>

            {/* Search Section */}
            <section className="-mt-16 relative z-20 container mx-auto px-4">
                <Card className="shadow-lg">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div className="space-y-2">
                                <Label htmlFor="search-location">렌탈 지역</Label>
                                <Select value={searchLocation} onValueChange={setSearchLocation}>
                                    <SelectTrigger id="search-location"><SelectValue placeholder="렌탈 지역 선택" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="jeju">제주도</SelectItem>
                                        <SelectItem value="seoul">서울</SelectItem>
                                        <SelectItem value="busan">부산</SelectItem>
                                        <SelectItem value="gangneung">강릉</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rental-date">대여일</Label>
                                <Input id="rental-date" type="date" value={rentalDate} onChange={(e) => setRentalDate(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="return-date">반납일</Label>
                                <Input id="return-date" type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
                            </div>
                            <Button className="w-full bg-teal-600 hover:bg-teal-700 h-10">
                                <Search className="w-4 h-4 mr-2"/>
                                차량 검색
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
                                        <Label>가격대 (1일)</Label>
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
                                        <Label>차량 종류</Label>
                                        {vehicleTypes.map(type => (
                                            <div key={type.id} className="flex items-center gap-2">
                                                <Checkbox id={type.id} checked={selectedTypes.includes(type.id)} onCheckedChange={() => handleFilterChange(setSelectedTypes, type.id)} />
                                                <Label htmlFor={type.id} className="text-sm font-normal">{type.label}</Label>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-3">
                                        <Label>옵션</Label>
                                        {vehicleOptions.map(option => (
                                            <div key={option.id} className="flex items-center gap-2">
                                                <Checkbox id={option.id} checked={selectedOptions.includes(option.id)} onCheckedChange={() => handleFilterChange(setSelectedOptions, option.id)} />
                                                <Label htmlFor={option.id} className="text-sm font-normal">{option.label}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </aside>

                        {/* Vehicle List */}
                        <div className="lg:col-span-3">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-navy-900">
                                    {filteredAndSortedVehicles.length > 0 ? `${filteredAndSortedVehicles.length}개의 차량 렌탈` : "추천 차량 렌탈"}
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
                                ) : filteredAndSortedVehicles.map((vehicle) => <VehicleCard key={vehicle.id} product={vehicle} />)}
                            </div>
                            {!isLoading && filteredAndSortedVehicles.length === 0 && (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <p className="text-gray-500">조건에 맞는 차량이 없습니다.</p>
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