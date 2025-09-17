"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Trash2, Check, Plane, ShieldCheck, Save, Loader2, User, X } from "lucide-react"
import { travelerApi, fileApi, TravelerRequest, TravelerResponse } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

function TravelerInfoPageContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { toast } = useToast()
    const bookingId = searchParams.get("bookingId")

    const [travelers, setTravelers] = useState<TravelerResponse[]>([])
    const [selectedTravelerIndex, setSelectedTravelerIndex] = useState<number>(0)
    const [isPageLoading, setIsPageLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [passportPreview, setPassportPreview] = useState<string | null>(null)

    // 초기 여행자 데이터 불러오기
    useEffect(() => {
        if (!bookingId) {
            toast({ title: "오류", description: "예약 ID가 필요합니다.", variant: "destructive" })
            router.push("/")
            return
        }

        const fetchTravelers = async () => {
            try {
                setIsPageLoading(true)
                const travelerData = await travelerApi.getTravelers(bookingId)
                if (travelerData.length === 0) {
                    setTravelers([{
                        id: "",
                        name: "",
                        nameEngFirst: "",
                        nameEngLast: "",
                        gender: "MALE",
                        birth: "",
                        phone: "",
                        passportNumber: "",
                        passportUrl: "",
                    }])
                } else {
                    setTravelers(travelerData)
                }
                setSelectedTravelerIndex(0)
            } catch (error) {
                toast({ title: "오류", description: "여행자 데이터를 불러오는 데 실패했습니다.", variant: "destructive" })
            } finally {
                setIsPageLoading(false)
            }
        }

        fetchTravelers()
    }, [bookingId, router, toast])

    // 여행자 추가
    const addTraveler = () => {
        setTravelers([...travelers, {
            id: "",
            name: "",
            nameEngFirst: "",
            nameEngLast: "",
            gender: "MALE",
            birth: "",
            phone: "",
            passportNumber: "",
            passportUrl: "",
        }])
        setSelectedTravelerIndex(travelers.length)
    }

    // 여행자 삭제
    const removeTraveler = async (index: number) => {
        if (travelers.length <= 1) {
            toast({ title: "알림", description: "최소 1명의 여행자 정보가 필요합니다." })
            return
        }

        const traveler = travelers[index]

        if (traveler.id) {
            if (!confirm("저장된 여행자입니다. 정말 삭제하시겠습니까?")) return
            try {
                await travelerApi.removeTraveler(bookingId!, traveler.id)
                toast({ title: "성공", description: "여행자 정보가 삭제되었습니다." })
            } catch (error) {
                toast({ title: "오류", description: "삭제에 실패했습니다.", variant: "destructive" })
                return
            }
        }

        const newTravelers = travelers.filter((_, i) => i !== index)
        setTravelers(newTravelers)
        setSelectedTravelerIndex(Math.max(0, index - 1))
    }

    // 여행자 정보 수정
    const updateTravelerField = (index: number, field: keyof TravelerRequest | "passportFile", value: any) => {
        setTravelers(prev =>
            prev.map((traveler, i) =>
                i === index
                    ? { ...traveler, [field]: value }
                    : traveler
            )
        )
    }

    // 저장
    const saveTraveler = async (index: number) => {
        const traveler = travelers[index]

        if (!traveler.name || !traveler.passportNumber) {
            toast({ title: "경고", description: "이름과 여권번호는 필수 입력입니다.", variant: "destructive" })
            return
        }

        setIsSaving(true)
        try {
            let passportUrl = traveler.passportUrl

            if ((traveler as any).passportFile) {
                const response = await fileApi.uploadFile((traveler as any).passportFile, `passports/${bookingId}`)
                passportUrl = response.url
            }

            const travelerRequest: TravelerRequest = {
                name: traveler.name,
                nameEngFirst: traveler.nameEngFirst,
                nameEngLast: traveler.nameEngLast,
                gender: traveler.gender,
                birth: traveler.birth,
                phone: traveler.phone,
                passportNumber: traveler.passportNumber,
                passportUrl,
            }

            let savedTraveler: TravelerResponse
            if (traveler.id) {
                savedTraveler = await travelerApi.updateTraveler(bookingId!, traveler.id, travelerRequest)
            } else {
                savedTraveler = await travelerApi.addTraveler(bookingId!, travelerRequest)
            }

            const updatedTravelers = [...travelers]
            updatedTravelers[index] = savedTraveler
            setTravelers(updatedTravelers)
            toast({ title: "성공", description: `${savedTraveler.name}님의 정보가 저장되었습니다.` })
        } catch (error) {
            toast({ title: "오류", description: "저장에 실패했습니다.", variant: "destructive" })
        } finally {
            setIsSaving(false)
        }
    }

    if (isPageLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-navy-600" /></div>
    }

    const selectedTraveler = travelers[selectedTravelerIndex]
    const completedCount = travelers.filter(t => t.name && t.passportNumber).length
    const totalCount = travelers.length
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

    return (
        <div className="min-h-screen bg-gray-100">
            {/* 상단 헤더 */}
            <section className="bg-navy-900 text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <Plane className="w-12 h-12 mx-auto mb-4" />
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">여행자 정보 입력</h1>
                    <p className="text-lg text-gray-300">여행자 정보를 자유롭게 추가하고 수정할 수 있습니다.</p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* 좌측 목록 */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-28 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-navy-900">여행자 목록 ({totalCount})</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {/* Progress */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{completedCount}명 완료</span>
                                        <span>{Math.round(progress)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 h-2 rounded-full">
                                        <div
                                            className="bg-teal-500 h-2 rounded-full transition-all"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Traveler list */}
                                {travelers.map((traveler, index) => (
                                    <div
                                        key={traveler.id || index}
                                        className={`p-3 border rounded-lg cursor-pointer transition-all duration-300 ${
                                            selectedTravelerIndex === index
                                                ? "border-teal-500 bg-teal-50 shadow-md ring-2 ring-teal-500"
                                                : "border-gray-200 hover:border-gray-400"
                                        }`}
                                        onClick={() => setSelectedTravelerIndex(index)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedTravelerIndex === index ? "bg-teal-600" : "bg-gray-300"}`}>
                                                    <User className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-navy-900">
                                                        {traveler.name || `여행자 ${index + 1}`}
                                                        {index === 0 && <Badge variant="secondary" className="ml-2 text-xs">대표자</Badge>}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {traveler.id && <Check className="w-5 h-5 text-green-500" />}
                                                <Button type="button" variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); removeTraveler(index) }} className="text-red-500 hover:bg-red-100 h-7 w-7">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={addTraveler} className="w-full border-dashed mt-2">
                                    <Plus className="w-4 h-4 mr-2" /> 여행자 추가
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 여행자 상세 */}
                    <div className="lg:col-span-3">
                        {selectedTraveler && (
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-navy-900">
                                        {selectedTraveler.name || `여행자 ${selectedTravelerIndex + 1} 정보`}
                                    </CardTitle>
                                    <CardDescription>여권 정보는 실제 여권과 정확히 일치해야 합니다.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Accordion type="multiple" defaultValue={['item-1', 'item-2']} className="w-full">
                                        {/* 기본 정보 */}
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger className="flex items-center gap-2 text-lg font-semibold">
                                                <User className="w-5 h-5 text-teal-600" />
                                                여행자 정보
                                            </AccordionTrigger>
                                            <AccordionContent className="pt-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label>한글 이름 *</Label>
                                                        <Input
                                                            value={selectedTraveler.name}
                                                            onChange={(e) => updateTravelerField(selectedTravelerIndex, "name", e.target.value)}
                                                            placeholder="홍길동"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2 col-span-2">
                                                        <Label>영문 이름 *</Label>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <Input
                                                                className="uppercase"
                                                                value={selectedTraveler.nameEngFirst}
                                                                onChange={(e) => updateTravelerField(selectedTravelerIndex, "nameEngFirst", e.target.value.toUpperCase())}
                                                                placeholder="GILDONG"
                                                                required
                                                            />
                                                            <Input
                                                                className="uppercase"
                                                                value={selectedTraveler.nameEngLast}
                                                                onChange={(e) => updateTravelerField(selectedTravelerIndex, "nameEngLast", e.target.value.toUpperCase())}
                                                                placeholder="HONG"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>성별 *</Label>
                                                        <Select
                                                            value={selectedTraveler.gender}
                                                            onValueChange={(v) => updateTravelerField(selectedTravelerIndex, "gender", v)}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="성별 선택" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="MALE">남성</SelectItem>
                                                                <SelectItem value="FEMALE">여성</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>생년월일 *</Label>
                                                        <Input
                                                            type="date"
                                                            value={selectedTraveler.birth}
                                                            onChange={(e) => updateTravelerField(selectedTravelerIndex, "birth", e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>휴대전화 *</Label>
                                                        <Input
                                                            type="tel"
                                                            value={selectedTraveler.phone}
                                                            onChange={(e) => updateTravelerField(selectedTravelerIndex, "phone", e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>

                                        {/* 여권 정보 */}
                                        <AccordionItem value="item-2">
                                            <AccordionTrigger className="flex items-center gap-2 text-lg font-semibold">
                                                <ShieldCheck className="w-5 h-5 text-teal-600" />
                                                여권 정보
                                            </AccordionTrigger>
                                            <AccordionContent className="pt-4">
                                                <div className="space-y-2">
                                                    <Label>여권번호 *</Label>
                                                    <Input
                                                        value={selectedTraveler.passportNumber}
                                                        onChange={(e) => updateTravelerField(selectedTravelerIndex, "passportNumber", e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="mt-6 space-y-2">
                                                    <Label>여권 사본 업로드</Label>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0] || null
                                                            if (file) {
                                                                updateTravelerField(selectedTravelerIndex, "passportFile", file)
                                                                updateTravelerField(selectedTravelerIndex, "passportUrl", URL.createObjectURL(file))
                                                            }
                                                        }}
                                                    />
                                                    {selectedTraveler.passportUrl && (
                                                        <>
                                                            <div className="mt-2 cursor-pointer">
                                                                <p className="text-sm text-gray-500 mb-1">미리보기 (클릭하면 확대)</p>
                                                                <img
                                                                    src={selectedTraveler.passportUrl}
                                                                    alt="Passport Preview"
                                                                    className="w-full max-w-sm h-auto rounded shadow-lg border cursor-pointer"
                                                                    onClick={() => setPassportPreview(selectedTraveler.passportUrl!)}
                                                                />
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>

                                    {/* 저장 버튼 */}
                                    <div className="mt-6 flex justify-end">
                                        <Button onClick={() => saveTraveler(selectedTravelerIndex)} disabled={isSaving}>
                                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="w-4 h-4 mr-2"/>}
                                            {selectedTraveler.id ? '수정사항 저장' : '여행자 저장'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* 여권 전체화면 모달 */}
            {passportPreview && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
                            onClick={() => setPassportPreview(null)}
                        >
                            <X className="w-6 h-6" />
                        </Button>
                        <img src={passportPreview} alt="Full Passport" className="max-h-[90vh] max-w-[90vw] shadow-2xl rounded" />
                    </div>
                </div>
            )}
        </div>
    )
}

export default function TravelerInfoPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-navy-600"/>
            </div>
        }>
            <TravelerInfoPageContent />
        </Suspense>
    )
}