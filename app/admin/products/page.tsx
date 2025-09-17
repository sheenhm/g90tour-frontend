"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
    Plus,
    Search,
    Hotel,
    TreePine,
    Mountain,
    Waves,
    Car,
    Ticket,
    MoreHorizontal,
    List,
    LayoutGrid,
    CheckCircle,
    XCircle, LucideIcon
} from "lucide-react"

import { adminProductApi, adminFileApi } from "@/lib/admin"
import { Product, Category } from "@/lib/product"
import { Skeleton } from "@/components/ui/skeleton"

import ProductForm from "./productForm"

const categoryInfo: Record<Category, { icon: LucideIcon; label: string }> = {
    HOTEL: { icon: Hotel, label: "호텔" },
    GOLF: { icon: TreePine, label: "골프" },
    TOUR: { icon: Mountain, label: "패키지" },
    SPA: { icon: Waves, label: "스파" },
    VEHICLE: { icon: Car, label: "차량" },
    ACTIVITY: { icon: Ticket, label: "액티비티" },
}

type ProductGridProps = {
    products: Product[]
    onEdit: (product: Product) => void
    onToggleActive: (id: string) => void
}

type ProductTableProps = {
    products: Product[]
    onEdit: (product: Product) => void
    onToggleActive: (id: string) => void
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all")
    const [view, setView] = useState<"grid" | "list">("grid")
    const [isCategorySelectorOpen, setIsCategorySelectorOpen] = useState(false)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const res = await adminProductApi.search({
                keyword: searchTerm,
                category: categoryFilter === "all" ? undefined : categoryFilter,
                page: 0,
                size: 50, // Fetch more items for better client-side search experience
            })
            setProducts(res.content)
        } catch (error) {
            console.error("상품 로딩 실패:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchProducts()
        }, 300); // Debounce search term
        return () => clearTimeout(debounceTimer);
    }, [searchTerm, categoryFilter])

    const handleSelectCategory = (category: Category) => {
        setSelectedCategory(category)
        setEditingProduct(null)
        setIsCategorySelectorOpen(false)
        setIsFormOpen(true)
    }

    const handleEditClick = (product: Product) => {
        setSelectedCategory(product.category)
        setEditingProduct(product)
        setIsFormOpen(true)
    }

    const handleSubmit = async (formData: any) => {
        try {
            if (editingProduct) {
                await adminProductApi.update(editingProduct.id, formData)
            } else {
                await adminProductApi.create(formData)
            }
            closeFormDialog()
            await fetchProducts()
        } catch (error) {
            console.error("상품 저장 실패:", error)
            alert("상품 저장에 실패했습니다.")
        }
    }

    const handleToggleActive = async (productId: string) => {
        try {
            await adminProductApi.toggleActive(productId)
            await fetchProducts()
        } catch (error) {
            console.error("상태 변경 실패:", error)
            alert("상태 변경에 실패했습니다.")
        }
    }

    const handleImageUpload = async (file: File, path: string): Promise<string> => {
        try {
            const response = await adminFileApi.uploadPublicFile(file, path)
            return response.url
        } catch (error) {
            console.error("이미지 업로드 실패:", error)
            alert("이미지 업로드에 실패했습니다.")
            throw error
        }
    }

    const closeFormDialog = () => {
        setIsFormOpen(false)
        setEditingProduct(null)
        setSelectedCategory(null)
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-navy-900">상품 관리</h1>
                    <p className="text-gray-600">여행 상품을 등록하고 관리하세요.</p>
                </div>
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
                            {Object.entries(categoryInfo).map(([key, { icon: Icon, label }]) => (
                                <Button
                                    key={key}
                                    variant="outline"
                                    className="flex flex-col items-center justify-center h-24 text-base"
                                    onClick={() => handleSelectCategory(key as Category)}
                                >
                                    <Icon className="w-8 h-8 mb-2" />
                                    <span>{label}</span>
                                </Button>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs defaultValue="all">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Button variant={view === 'grid' ? 'default' : 'ghost'} size="icon" onClick={() => setView('grid')}>
                            <LayoutGrid className="h-4 w-4"/>
                        </Button>
                        <Button variant={view === 'list' ? 'default' : 'ghost'} size="icon" onClick={() => setView('list')}>
                            <List className="h-4 w-4"/>
                        </Button>
                    </div>
                </div>
                <TabsContent value="all" className="mt-4">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col md:flex-row gap-4">
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
                                    <SelectTrigger className="w-full md:w-48">
                                        <SelectValue placeholder="카테고리" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">전체 카테고리</SelectItem>
                                        {Object.entries(categoryInfo).map(([key, { label }]) => (
                                            <SelectItem key={key} value={key}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                view === 'grid' ? <ProductGridSkeleton /> : <ProductTableSkeleton />
                            ) : view === 'grid' ? (
                                <ProductGrid products={products} onEdit={handleEditClick} onToggleActive={handleToggleActive} />
                            ) : (
                                <ProductTable products={products} onEdit={handleEditClick} onToggleActive={handleToggleActive} />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={isFormOpen} onOpenChange={closeFormDialog}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? "상품 수정" : "새 상품 추가"}</DialogTitle>
                        <DialogDescription>
                            {selectedCategory && `${categoryInfo[selectedCategory].label} 상품 정보를 입력해주세요.`}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedCategory && (
                        <ProductForm
                            key={editingProduct?.id || 'new'}
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

// --- Display Components ---

const ProductGrid: React.FC<ProductGridProps> = ({ products, onEdit, onToggleActive }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map(product => (
            <Card key={product.id} className="overflow-hidden">
                <div className="relative h-48">
                    <Image src={product.imageUrl || '/placeholder.jpg'} alt={product.name} fill className="object-cover"/>
                    <Badge className="absolute top-2 left-2">{categoryInfo[product.category]?.label}</Badge>
                </div>
                <CardContent className="p-4">
                    <h3 className="font-semibold truncate">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.location}</p>
                    <div className="flex justify-between items-center mt-4">
                        <p className="font-bold text-lg">{product.salePrice.toLocaleString()}원</p>
                        <Badge variant={product.isActive ? "default" : "destructive"} className={product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>{product.isActive ? '활성' : '비활성'}</Badge>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="w-full" onClick={() => onEdit(product)}>수정</Button>
                        <Button variant="outline" size="sm" className="w-full" onClick={() => onToggleActive(product.id)}>상태 변경</Button>
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onToggleActive }) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                <TableHead>상품명</TableHead>
                <TableHead className="hidden md:table-cell">카테고리</TableHead>
                <TableHead className="hidden md:table-cell">가격</TableHead>
                <TableHead>상태</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {products.map(product => (
                <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                        <Image alt={product.name} className="aspect-square rounded-md object-cover" height="64" src={product.imageUrl || '/placeholder.jpg'} width="64"/>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="hidden md:table-cell"><Badge variant="outline">{categoryInfo[product.category]?.label}</Badge></TableCell>
                    <TableCell className="hidden md:table-cell">{product.salePrice.toLocaleString()}원</TableCell>
                    <TableCell>
                        <Badge variant={product.isActive ? 'default' : 'secondary'} className={product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>{product.isActive ? '활성' : '비활성'}</Badge>
                    </TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4"/><span className="sr-only">Toggle menu</span></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onEdit(product)}>수정</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onToggleActive(product.id)}>상태 변경</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);

const ProductGridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({length: 6}).map((_, i) => (
            <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full"/>
                <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-5 w-3/4"/>
                    <Skeleton className="h-4 w-1/2"/>
                    <div className="flex justify-between items-center pt-2">
                        <Skeleton className="h-6 w-1/3"/>
                        <Skeleton className="h-6 w-1/4"/>
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

const ProductTableSkeleton = () => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                <TableHead>상품명</TableHead>
                <TableHead className="hidden md:table-cell">카테고리</TableHead>
                <TableHead className="hidden md:table-cell">가격</TableHead>
                <TableHead>상태</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {Array.from({length: 5}).map((_, i) => (
                <TableRow key={i}>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-16 w-16 rounded-md"/></TableCell>
                    <TableCell><Skeleton className="h-5 w-48"/></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-20"/></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24"/></TableCell>
                    <TableCell><Skeleton className="h-6 w-16"/></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 rounded-full"/></TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);