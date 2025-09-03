"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, Hotel, TreePine, Mountain, Waves, Car, Ticket } from "lucide-react"

import { adminProductApi, adminFileApi } from "@/lib/admin"
import { Product, Category } from "@/lib/product"

import ProductForm from "./productForm"
import ProductCard from "@/components/MainProductCard"

// 카테고리 선택 UI를 위한 정보
const categoryInfo = {
    HOTEL: { icon: <Hotel className="w-8 h-8 mb-2" />, label: "호텔" },
    GOLF: { icon: <TreePine className="w-8 h-8 mb-2" />, label: "골프" },
    TOUR: { icon: <Mountain className="w-8 h-8 mb-2" />, label: "투어" },
    SPA: { icon: <Waves className="w-8 h-8 mb-2" />, label: "스파" },
    VEHICLE: { icon: <Car className="w-8 h-8 mb-2" />, label: "차량" },
    ACTIVITY: { icon: <Ticket className="w-8 h-8 mb-2" />, label: "액티비티" },
}

export default function AdminProductsPage() {
    // --- 상태(State) 정의 ---
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)

    // 검색 및 필터링 상태
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all")

    // 다이얼로그 관리 상태
    const [isCategorySelectorOpen, setIsCategorySelectorOpen] = useState(false)
    const [isFormOpen, setIsFormOpen] = useState(false)

    // 상품 추가/수정 상태
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

    // --- 데이터 Fetching ---
    const fetchProducts = async () => {
        setLoading(true)
        try {
            const res = await adminProductApi.search({
                keyword: searchTerm,
                category: categoryFilter === "all" ? undefined : categoryFilter,
                page: 0,
                size: 20,
            })
            setProducts(res.content)
        } catch (error) {
            console.error("상품 로딩 실패:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [searchTerm, categoryFilter])

    // --- 핸들러 함수 ---

    // 1. 새 상품 추가 플로우
    const handleSelectCategory = (category: Category) => {
        setSelectedCategory(category)
        setEditingProduct(null) // 추가 모드임을 명확히 함
        setIsCategorySelectorOpen(false)
        setIsFormOpen(true)
    }

    // 2. 상품 수정 플로우
    const handleEditClick = (product: Product) => {
        setSelectedCategory(product.category)
        setEditingProduct(product)
        setIsFormOpen(true)
    }

    // 3. 폼 제출 (추가/수정 공통)
    const handleSubmit = async (formData: any) => {
        try {
            if (editingProduct) { // 수정 모드
                const updatedProduct = await adminProductApi.update(editingProduct.id, formData)
                setProducts((prev) =>
                    prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
                )
            } else { // 추가 모드
                const newProduct = await adminProductApi.create(formData)
                setProducts((prev) => [newProduct, ...prev])
            }
            closeFormDialog()
            await fetchProducts() // 목록 새로고침
        } catch (error) {
            console.error("상품 저장 실패:", error)
            alert("상품 저장에 실패했습니다.")
        }
    }

    // 4. 상품 비활성화 (삭제)
    const handleDeleteProduct = async (productId: string) => {
        if (!confirm("정말로 이 상품을 비활성화 처리 하시겠습니까?")) return
        try {
            await adminProductApi.delete(productId)
            setProducts((prev) => prev.filter((p) => p.id !== productId))
        } catch (error) {
            console.error("상품 비활성화 실패:", error)
        }
    }

    // 5. 이미지 업로드
    const handleImageUpload = async (file: File, path: string): Promise<string> => {
        try {
            const response = await adminFileApi.uploadPublicFile(file, path);
            return response.url;
        } catch (error) {
            console.error("이미지 업로드 실패:", error);
            alert("이미지 업로드에 실패했습니다.");
            throw error;
        }
    }

    // 다이얼로그 닫기 및 상태 초기화
    const closeFormDialog = () => {
        setIsFormOpen(false)
        setEditingProduct(null)
        setSelectedCategory(null)
    }

    return (
        <div className="p-6">
            {/* 상단 헤더 + 상품 추가 버튼 */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">상품 관리</h1>
                <Dialog open={isCategorySelectorOpen} onOpenChange={setIsCategorySelectorOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-navy-600 hover:bg-navy-700">
                            <Plus className="w-4 h-4 mr-2" /> 상품 추가
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>상품 타입 선택</DialogTitle>
                            <DialogDescription>등록할 상품의 타입을 선택해주세요.</DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-3 gap-4 pt-4">
                            {Object.entries(categoryInfo).map(([key, { icon, label }]) => (
                                <Button
                                    key={key}
                                    variant="outline"
                                    className="flex flex-col items-center justify-center h-24"
                                    onClick={() => handleSelectCategory(key as Category)}
                                >
                                    {icon}
                                    <span>{label}</span>
                                </Button>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* 검색/필터 */}
            <Card className="mb-6">
                <CardContent className="p-6 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="상품명으로 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as Category | "all")}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="카테고리" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">전체 카테고리</SelectItem>
                            {Object.entries(categoryInfo).map(([key, { label }]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* 상품 리스트 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        isAdmin
                        onEdit={() => handleEditClick(product)}
                        onDelete={() => handleDeleteProduct(product.id)}
                    />
                ))}
            </div>
            {products.length === 0 && !loading && (
                <Card>
                    <CardContent className="p-12 text-center text-gray-500">
                        상품이 없습니다.
                    </CardContent>
                </Card>
            )}

            {/* 상품 추가/수정 폼 다이얼로그 */}
            <Dialog open={isFormOpen} onOpenChange={closeFormDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingProduct ? "상품 수정" : "새 상품 추가"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedCategory && `${categoryInfo[selectedCategory].label} 상품 정보를 입력해주세요.`}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedCategory && (
                        <ProductForm
                            key={editingProduct?.id || 'new'} // 수정/추가 모드 전환 시 폼을 리셋하기 위한 key
                            category={selectedCategory}
                            initialData={editingProduct}
                            onSubmit={handleSubmit}
                            onImageUpload={handleImageUpload}
                            onCancel={closeFormDialog}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}