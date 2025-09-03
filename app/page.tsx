"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Star,
    MapPin,
    Calendar,
    Users,
    Plane,
    Car,
    Building,
    TreePine,
    Waves,
    Dumbbell,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { productApi, type Product } from "@/lib/api"
import ProductCard from "@/components/MainProductCard";

const categories = [
    { name: "호텔", icon: Building, href: "/hotels", color: "bg-navy-600" },
    { name: "골프", icon: TreePine, href: "/golf", color: "bg-teal-600" },
    { name: "패키지", icon: Plane, href: "/tours", color: "bg-navy-600" },
    { name: "스파", icon: Waves, href: "/spa", color: "bg-teal-600" },
    { name: "액티비티", icon: Dumbbell, href: "/activities", color: "bg-navy-600" },
    { name: "차량", icon: Car, href: "/vehicles", color: "bg-teal-600" },
]

const categoryLabels: { [key: string]: string } = {
    HOTEL: "호텔",
    GOLF: "골프",
    TOUR: "패키지",
    SPA: "스파",
    ACTIVITY: "액티비티",
    VEHICLE: "차량",
}

export default function HomePage() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // 상품 불러오기
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true)
                const products = await productApi.getAll()
                setFeaturedProducts(products.slice(0, 4)) // 상위 4개만
            } catch (error) {
                console.error("Failed to fetch products:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProducts()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section - Video Background */}
            <section className="relative h-[574px] w-full overflow-hidden">
                {/* 배경 영상 */}
                <video
                    className="absolute inset-0 w-full h-full object-cover"
                    src="/lending.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Hero 텍스트 */}
                <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center">
                    <div className="max-w-4xl mx-auto text-center text-white">
                        <h1 className="text-4xl lg:text-6xl font-bold mb-6">특별한 여행의 시작</h1>
                        <p className="text-xl lg:text-2xl mb-8 text-gray-200">
                            G90과 함께하는 프리미엄 여행 경험
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3">
                                여행 상품 보기
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white hover:text-navy-900 px-8 py-3 bg-transparent"
                            >
                                맞춤 상담 받기
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">어떤 여행을 떠나시나요?</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {categories.map((category) => (
                            <Link
                                key={category.name}
                                href={category.href}
                                className="flex flex-col items-center justify-center p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow group"
                            >
                                <div className={`${category.color} text-white p-4 rounded-full mb-4`}>
                                    <category.icon className="w-8 h-8" />
                                </div>
                                <span className="font-semibold text-gray-800 group-hover:text-primary">
                  {category.name}
                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">인기 상품</h2>
                    {isLoading ? (
                        <p className="text-center text-gray-500">로딩 중...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}