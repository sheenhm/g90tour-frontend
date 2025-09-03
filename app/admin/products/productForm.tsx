"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { UploadCloud, Image as ImageIcon, Info, Tag, DollarSign, Plus, X } from "lucide-react"
import {
    Product,
    Category,
    ProductRequest,
    ProductDetails,
    buildRequestFromForm,
    toProductForm,
    Currency, CurrencyLabels
} from "@/lib/product"

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

const defaultDetails: Record<Category, ProductDetails["details"]> = {
    HOTEL: { capacity: 0, roomType: "" },
    GOLF: { golfClubName: [], round: 0, difficulty: "" },
    TOUR: { tourType: "", departurePlace: "", durationDays: 0, majorCities: [], majorSpots: [] },
    SPA: { treatmentType: "", durationMinutes: 0, treatmentOptions: [], facilities: [] },
    VEHICLE: { vehicleType: "", carName: "", passengerCapacity: 0, gasType: "", isDriverIncluded: false },
    ACTIVITY: { activityType: "", reservationDeadline: "", activities: [] },
}

type FormState = Omit<ProductRequest, "category"> & {
    category: Category
    details: ProductDetails["details"]
    costPrice: number
    currency: Currency
}

export default function ProductForm<C extends Category>({
                                                            category,
                                                            initialData,
                                                            onSubmit,
                                                            onImageUpload,
                                                            onCancel,
                                                        }: Props) {
    const [form, setForm] = useState<FormState>(() => ({
        name: initialData?.name || "",
        description: initialData?.description || "",
        originalPrice: initialData?.originalPrice || 0,
        salePrice: initialData?.salePrice || 0,
        costPrice: (initialData as any)?.costPrice || 0,
        currency: (initialData as any)?.currency || "KRW",
        location: initialData?.location || "",
        includes: initialData?.includes || [],
        imageUrl: initialData?.imageUrl || "",
        category,
        details: initialData
            ? (initialData[detailKeyMap[category]] as ProductDetails["details"])
            : defaultDetails[category],
    }))

    const [isUploading, setIsUploading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null)

    const handleChange = <K extends keyof FormState>(field: K, value: FormState[K]) =>
        setForm(prev => ({ ...prev, [field]: value }))

    const handleDetailChange = (detailData: FormState["details"]) =>
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
        const requestData: ProductRequest = buildRequestFromForm(toProductForm(form))
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
                        <Label>포함 사항</Label>
                        <div className="space-y-2">
                            {(form.includes.length > 0 ? form.includes : [""]).map((item, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={item}
                                        onChange={(e) => {
                                            const newIncludes = [...(form.includes.length > 0 ? form.includes : [""])]
                                            newIncludes[index] = e.target.value
                                            handleChange("includes", newIncludes)
                                        }}
                                    />
                                    <Button type="button" variant="outline" size="icon" onClick={() => {
                                        const newIncludes = form.includes.filter((_, i) => i !== index)
                                        handleChange("includes", newIncludes)
                                    }}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => handleChange("includes", [...form.includes, ""])}>
                                <Plus className="w-4 h-4 mr-1" /> 항목 추가
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 가격 정보 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign size={20} /> 가격 정보
                    </CardTitle>
                    <CardDescription className="text-gray-500 text-sm mt-1">
                        고객에게 노출되는 정보입니다. '판매가' 기준으로 판매됩니다.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="originalPrice">정가</Label>
                        <Input
                            id="originalPrice"
                            type="text"
                            value={form.originalPrice.toLocaleString()}
                            onChange={(e) => {
                                const numericValue = Number(e.target.value.replace(/,/g, ""));
                                handleChange("originalPrice", isNaN(numericValue) ? 0 : numericValue);
                            }}
                        />
                    </div>
                    <div>
                        <Label htmlFor="salePrice">판매가</Label>
                        <Input
                            id="salePrice"
                            type="text"
                            value={form.salePrice.toLocaleString()}
                            onChange={(e) => {
                                const numericValue = Number(e.target.value.replace(/,/g, ""));
                                handleChange("salePrice", isNaN(numericValue) ? 0 : numericValue);
                            }}
                        />
                    </div>

                    {/* 실시간 할인율 표시 */}
                    <div className="col-span-2 mt-2">
                        {form.originalPrice > 0 ? (
                            (() => {
                                const discount = Math.round(
                                    ((form.originalPrice - form.salePrice) / form.originalPrice) * 100
                                );

                                let colorClass = "text-gray-600"; // 기본
                                if (discount >= 50) colorClass = "text-red-600";
                                else if (discount >= 30) colorClass = "text-orange-600";
                                else if (discount >= 10) colorClass = "text-blue-600";

                                return (
                                    <p className={`text-sm font-semibold ${colorClass}`}>
                                        할인율: {discount}%
                                    </p>
                                );
                            })()
                        ) : (
                            <p className="text-sm text-gray-400">정가를 입력하면 할인율이 계산됩니다.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* 관리자 전용 가격 정보 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign size={20} /> 상품 원가 (관리자 전용)
                    </CardTitle>
                    <CardDescription className="text-gray-500 text-sm mt-1">
                        고객에게 보이지 않는 관리자용 정보입니다.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="costPrice">원가</Label>
                        <Input
                            id="costPrice"
                            type="text"
                            value={form.costPrice.toLocaleString()}
                            onChange={(e) => {
                                const numericValue = Number(e.target.value.replace(/,/g, ""));
                                handleChange("costPrice", isNaN(numericValue) ? 0 : numericValue);
                            }}
                        />
                    </div>
                    <div>
                        <Label htmlFor="currency">화폐</Label>
                        <select
                            id="currency"
                            value={form.currency}
                            onChange={(e) => handleChange("currency", e.target.value as Currency)}
                            className="w-full border rounded px-2 py-1"
                        >
                            {Object.entries(CurrencyLabels).map(([key, label]) => (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 1개 판매 시 남는 이익 */}
                    <div className="col-span-2 mt-2">
                        {form.salePrice > 0 ? (
                            (() => {
                                const profit = form.salePrice - form.costPrice;
                                let colorClass = "text-gray-600"; // 기본
                                if (profit >= 100000) colorClass = "text-green-600";
                                else if (profit > 0) colorClass = "text-blue-600";
                                else colorClass = "text-red-600"; // 손해

                                return (
                                    <p className={`text-sm font-semibold ${colorClass}`}>
                                        1개 판매 시 예상 이익: {profit.toLocaleString()} {form.currency}
                                    </p>
                                );
                            })()
                        ) : (
                            <p className="text-sm text-gray-400">판매가를 입력하면 이익이 계산됩니다.</p>
                        )}
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