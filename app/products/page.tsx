"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { productApi, type Product, ProductSearchParams } from "@/lib/api"
import MainProductCard from "@/components/MainProductCard"
import { Loader2, Search, Frown, Star } from "lucide-react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Separator } from "@/components/ui/separator"

const categories = [
    { id: "HOTEL", label: "호텔" },
    { id: "GOLF", label: "골프" },
    { id: "TOUR", label: "패키지" },
    { id: "SPA", label: "스파" },
    { id: "ACTIVITY", label: "액티비티" },
    { id: "VEHICLE", label: "차량" },
]

function SearchResults() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialQuery = searchParams.get("query") || ""

    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 1 })

    const [searchTerm, setSearchTerm] = useState(initialQuery)
    const [filters, setFilters] = useState({
        categories: (searchParams.get("categories")?.split(",")) || [],
        priceRange: [Number(searchParams.get("minPrice")) || 0, Number(searchParams.get("maxPrice")) || 2000000],
        rating: Number(searchParams.get("rating")) || 0,
    })

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true)
            try {
                const params: ProductSearchParams = {
                    keyword: searchTerm,
                    page: pageInfo.page,
                    size: 12,
                }
                if (filters.categories.length > 0) {
                    // @ts-ignore
                    params.category = filters.categories
                }
                if (filters.priceRange[0] > 0) params.minPrice = filters.priceRange[0]
                if (filters.priceRange[1] < 2000000) params.maxPrice = filters.priceRange[1]

                const response = await productApi.search(params)
                setProducts(response.content)
                setPageInfo({ page: response.pageNumber, totalPages: response.totalPages })
            } catch (error) {
                console.error("Failed to fetch products:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProducts()
    }, [searchTerm, filters, pageInfo.page])

    const handleFilterChange = <K extends keyof typeof filters>(key: K, value: (typeof filters)[K]) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const handleCategoryChange = (categoryId: string) => {
        const newCategories = filters.categories.includes(categoryId)
            ? filters.categories.filter((c) => c !== categoryId)
            : [...filters.categories, categoryId]
        handleFilterChange("categories", newCategories)
    }

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < pageInfo.totalPages) {
            setPageInfo(prev => ({ ...prev, page: newPage }))
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <section className="bg-gradient-to-r from-navy-800 to-teal-700 text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-2">상품 목록</h1>
                    <p className="text-lg text-gray-200">원하는 여행 상품을 찾아보세요</p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>필터</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Category Filter */}
                                <div>
                                    <Label className="font-semibold">카테고리</Label>
                                    <div className="space-y-2 mt-2">
                                        {categories.map((cat) => (
                                            <div key={cat.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={cat.id}
                                                    checked={filters.categories.includes(cat.id)}
                                                    onCheckedChange={() => handleCategoryChange(cat.id)}
                                                />
                                                <Label htmlFor={cat.id} className="font-normal cursor-pointer">{cat.label}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Separator />
                                {/* Price Filter */}
                                <div>
                                    <Label className="font-semibold">가격 범위</Label>
                                    <div className="mt-4">
                                        <Slider
                                            min={0}
                                            max={2000000}
                                            step={10000}
                                            value={filters.priceRange}
                                            onValueChange={(value) => handleFilterChange("priceRange", value)}
                                        />
                                        <div className="flex justify-between text-sm mt-2">
                                            <span>{filters.priceRange[0].toLocaleString()}원</span>
                                            <span>{filters.priceRange[1].toLocaleString()}원</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Product List */}
                    <main className="lg:col-span-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>검색 결과</CardTitle>
                                <CardDescription>
                                    {searchTerm ? `'${searchTerm}'에 대한 검색 결과입니다.` : '전체 상품 목록입니다.'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="flex justify-center items-center py-20">
                                        <Loader2 className="w-12 h-12 text-navy-600 animate-spin" />
                                    </div>
                                ) : products.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {products.map((product) => (
                                            <MainProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20">
                                        <Frown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">검색된 상품이 없습니다.</p>
                                    </div>
                                )}

                                {/* Pagination */}
                                {pageInfo.totalPages > 1 && (
                                    <div className="mt-8">
                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        href="#"
                                                        onClick={(e) => { e.preventDefault(); handlePageChange(pageInfo.page - 1); }}
                                                        className={pageInfo.page === 0 ? "pointer-events-none opacity-50" : ""}
                                                    />
                                                </PaginationItem>
                                                {[...Array(pageInfo.totalPages).keys()].map(p => (
                                                    <PaginationItem key={p}>
                                                        <PaginationLink
                                                            href="#"
                                                            onClick={(e) => { e.preventDefault(); handlePageChange(p); }}
                                                            isActive={pageInfo.page === p}
                                                        >
                                                            {p + 1}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                ))}
                                                <PaginationItem>
                                                    <PaginationNext
                                                        href="#"
                                                        onClick={(e) => { e.preventDefault(); handlePageChange(pageInfo.page + 1); }}
                                                        className={pageInfo.page === pageInfo.totalPages - 1 ? "pointer-events-none opacity-50" : ""}
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-navy-600 animate-spin" />
            </div>
        }>
            <SearchResults />
        </Suspense>
    )
}