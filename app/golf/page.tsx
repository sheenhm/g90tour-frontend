"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Users, Calendar, TreePine } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { productApi, type Product } from "@/lib/api"
import GolfCard from "@/components/GolfCard";

export default function GolfPage() {
    const [golfPackages, setGolfPackages] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [destination, setDestination] = useState("")
    const [duration, setDuration] = useState("")
    const [players, setPlayers] = useState("4")
    const [budget, setBudget] = useState("")

    useEffect(() => {
        const fetchGolfPackages = async () => {
            try {
                setIsLoading(true)
                const response = await productApi.search({ category: "GOLF", size: 10 })
                setGolfPackages(response.content)
            } catch (error) {
                console.error("Failed to fetch golf packages:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchGolfPackages()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-navy-900 to-teal-800 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <TreePine className="w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-4xl font-bold mb-4">골프 투어</h1>
                        <p className="text-xl text-gray-200">세계 최고의 골프장에서 특별한 라운딩을 경험하세요</p>
                    </div>

                    {/* Search Form */}
                    <Card className="max-w-4xl mx-auto">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="destination">목적지</Label>
                                    <Select value={destination} onValueChange={setDestination}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="골프 목적지 선택" />
                                        </SelectTrigger>
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
                                        <SelectTrigger>
                                            <SelectValue placeholder="여행 기간" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="3-4">3박 4일</SelectItem>
                                            <SelectItem value="4-5">4박 5일</SelectItem>
                                            <SelectItem value="5-6">5박 6일</SelectItem>
                                            <SelectItem value="custom">맞춤 일정</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="players">인원</Label>
                                    <Select value={players} onValueChange={setPlayers}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2">2명</SelectItem>
                                            <SelectItem value="4">4명</SelectItem>
                                            <SelectItem value="8">8명</SelectItem>
                                            <SelectItem value="12">12명</SelectItem>
                                            <SelectItem value="16">16명</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="budget">예산</Label>
                                    <Select value={budget} onValueChange={setBudget}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="1인 예산" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="under-1m">100만원 이하</SelectItem>
                                            <SelectItem value="1m-1.5m">100-150만원</SelectItem>
                                            <SelectItem value="1.5m-2m">150-200만원</SelectItem>
                                            <SelectItem value="over-2m">200만원 이상</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button className="w-full mt-6 bg-teal-600 hover:bg-teal-700">골프 투어 검색</Button>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Golf Packages */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-navy-900">인기 골프 투어</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, idx) => (
                                <Card key={idx} className="overflow-hidden">
                                    <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
                                    <CardContent className="p-6 space-y-4">
                                        <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : golfPackages.map((pkg) => <GolfCard key={pkg.id} pkg={pkg} />)}
                    </div>
                </div>
            </section>
        </div>
    )
}