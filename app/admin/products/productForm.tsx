"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { UploadCloud, Image as ImageIcon, Info, Tag, DollarSign } from "lucide-react"

import { Product, ProductForm as ProductFormType, Category, buildRequestFromForm, ProductRequest } from "@/lib/product"

// category별 세부 폼
import HotelForm from "./category-forms/HotelForm"
import GolfForm from "./category-forms/GolfForm"
import SpaForm from "./category-forms/SpaForm"
import TourForm from "./category-forms/TourForm"
import VehicleForm from "./category-forms/VehicleForm"
import ActivityForm from "./category-forms/ActivityForm"

interface Props {
    category: Category
    initialData?: Product | null
    onSubmit: (data: ProductRequest) => void
    onImageUpload: (file: File, path: string) => Promise<string>
    onCancel: () => void
}

const detailKeyMap: { [K in Category]: keyof Product } = {
    HOTEL: "hotelDetails",
    GOLF: "golfDetails",
    SPA: "spaDetails",
    TOUR: "tourDetails",
    VEHICLE: "vehicleDetails",
    ACTIVITY: "activityDetails",
}

export default function ProductForm({ category, initialData, onSubmit, onImageUpload, onCancel }: Props) {
    const [form, setForm] = useState<ProductFormType>(() => ({
        name: initialData?.name || "",
        description: initialData?.description || "",
        originalPrice: initialData?.originalPrice || 0,
        salePrice: initialData?.salePrice || 0,
        location: initialData?.location || "",
        includes: initialData?.includes || [],
        imageUrl: initialData?.imageUrl || "",
        details: initialData
            ? (initialData[detailKeyMap[category]] as ProductFormType["details"]) || {}
            : {},
        category
    }))

    const [isUploading, setIsUploading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null)

    const handleChange = <K extends keyof ProductFormType>(field: K, value: ProductFormType[K]) =>
        setForm(prev => ({ ...prev, [field]: value }))

    const handleDetailChange = (detailData: ProductFormType["details"]) =>
        setForm(prev => ({ ...prev, details: detailData }))

    const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => setImagePreview(reader.result as string)
        reader.readAsDataURL(file)

        setIsUploading(true)
        try {
            const uploadPath = `products/${category.toLowerCase()}`
            const url = await onImageUpload(file, uploadPath)
            handleChange("imageUrl", url)
        } catch {
            setImagePreview(initialData?.imageUrl || null)
        } finally {
            setIsUploading(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const requestData: ProductRequest = buildRequestFromForm(form)
        onSubmit(requestData)
    }

    const categoryForms: Record<Category, React.FC<{ data: any; onChange: (data: any) => void }>> = {
        HOTEL: HotelForm,
        GOLF: GolfForm,
        SPA: SpaForm,
        TOUR: TourForm,
        VEHICLE: VehicleForm,
        ACTIVITY: ActivityForm,
    }

    const DetailForm = categoryForms[category]

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            {/* 대표 이미지 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ImageIcon size={20} /> 대표 이미지
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <label htmlFor="image-upload" className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        {imagePreview ? (
                            <img src={imagePreview} alt="미리보기" className="object-cover w-full h-full rounded-lg" />
                        ) : (
                            <div className="text-center">
                                <UploadCloud className="w-12 h-12 mx-auto text-gray-400" />
                                <p className="mt-2 text-sm text-gray-500">이미지를 드래그하거나 클릭하여 업로드하세요.</p>
                            </div>
                        )}
                        <Input id="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImage} disabled={isUploading} />
                    </label>
                    {isUploading && <p className="text-sm text-blue-500 mt-2 text-center">이미지 업로드 중...</p>}
                </CardContent>
            </Card>

            {/* 기본 정보 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Info size={20} /> 기본 정보
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="name">상품명</Label>
                        <Input id="name" required value={form.name} onChange={e => handleChange("name", e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="description">설명</Label>
                        <Textarea id="description" value={form.description} onChange={e => handleChange("description", e.target.value)} rows={4} />
                    </div>
                    <div>
                        <Label htmlFor="location">지역</Label>
                        <Input id="location" value={form.location} onChange={e => handleChange("location", e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="includes">포함사항 (쉼표로 구분)</Label>
                        <Input
                            id="includes"
                            value={form.includes.join(", ")}
                            onChange={e => handleChange("includes", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* 가격 정보 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign size={20} /> 가격 정보
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="originalPrice">정가</Label>
                        <Input id="originalPrice" type="number" value={form.originalPrice} onChange={e => handleChange("originalPrice", +e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="salePrice">할인가</Label>
                        <Input id="salePrice" type="number" value={form.salePrice} onChange={e => handleChange("salePrice", +e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            {/* 세부 정보 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Tag size={20} /> 세부 정보
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {DetailForm ? <DetailForm data={form.details} onChange={handleDetailChange} /> : <p className="text-center text-gray-500">세부 정보 폼이 없습니다.</p>}
                </CardContent>
            </Card>

            <Separator />

            {/* 액션 버튼 */}
            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel}>취소</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isUploading}>
                    {isUploading ? "업로드 중..." : (initialData ? "수정 완료" : "상품 등록")}
                </Button>
            </div>
        </form>
    )
}