"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Upload, User, Plus, Trash2, Check, Plane, ShieldCheck, HeartPulse } from "lucide-react"

interface TravelerInfo {
    id: string
    name: string
    nameEng: string
    gender: string
    birth: string
    phone: string
    email: string
    passportNumber: string
    passportExpiry: string
    passportFile: File | null
    emergencyContact: string
    emergencyPhone: string
    specialRequests: string
}

export default function TravelerInfoPage() {
    const [travelers, setTravelers] = useState<TravelerInfo[]>([
        {
            id: "1",
            name: "",
            nameEng: "",
            gender: "",
            birth: "",
            phone: "",
            email: "",
            passportNumber: "",
            passportExpiry: "",
            passportFile: null,
            emergencyContact: "",
            emergencyPhone: "",
            specialRequests: "",
        },
    ])
    const [selectedTravelerId, setSelectedTravelerId] = useState("1")

    const addTraveler = () => {
        const newTraveler: TravelerInfo = {
            id: Date.now().toString(),
            name: "",
            nameEng: "",
            gender: "",
            birth: "",
            phone: "",
            email: "",
            passportNumber: "",
            passportExpiry: "",
            passportFile: null,
            emergencyContact: "",
            emergencyPhone: "",
            specialRequests: "",
        }
        setTravelers([...travelers, newTraveler])
        setSelectedTravelerId(newTraveler.id)
    }

    const removeTraveler = (id: string) => {
        if (travelers.length > 1) {
            const newTravelers = travelers.filter((t) => t.id !== id)
            setTravelers(newTravelers)
            if (selectedTravelerId === id) {
                setSelectedTravelerId(newTravelers[0].id)
            }
        }
    }

    const updateTraveler = (id: string, field: keyof TravelerInfo, value: any) => {
        setTravelers(travelers.map((traveler) => (traveler.id === id ? { ...traveler, [field]: value } : traveler)))
    }

    const handleFileUpload = (id: string, file: File | null) => {
        updateTraveler(id, "passportFile", file)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Traveler information submitted:", travelers)
        alert("여행자 정보가 성공적으로 제출되었습니다.")
    }

    const isFormValid = () => {
        return travelers.every(
            (traveler) =>
                traveler.name &&
                traveler.nameEng &&
                traveler.gender &&
                traveler.birth &&
                traveler.phone &&
                traveler.email &&
                traveler.passportNumber &&
                traveler.passportExpiry,
        )
    }

    const isTravelerComplete = (traveler: TravelerInfo) => {
        return (
            traveler.name &&
            traveler.nameEng &&
            traveler.gender &&
            traveler.birth &&
            traveler.phone &&
            traveler.email &&
            traveler.passportNumber &&
            traveler.passportExpiry
        )
    }

    const selectedTraveler = travelers.find((t) => t.id === selectedTravelerId) || travelers[0]

    return (
        <div className="min-h-screen bg-gray-100">
            <section className="bg-navy-900 text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <Plane className="w-12 h-12 mx-auto mb-4" />
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">여행자 정보 입력</h1>
                    <p className="text-lg text-gray-300">
                        안전하고 즐거운 여행을 위해 모든 여행자의 정보를 정확히 입력해주세요.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Left: Traveler List */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-28 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-navy-900">여행자 목록</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {travelers.map((traveler, index) => (
                                        <div
                                            key={traveler.id}
                                            className={`p-3 border rounded-lg cursor-pointer transition-all duration-300 ${
                                                selectedTravelerId === traveler.id
                                                    ? "border-teal-500 bg-teal-50 shadow-md ring-2 ring-teal-500"
                                                    : "border-gray-200 hover:border-gray-400"
                                            }`}
                                            onClick={() => setSelectedTravelerId(traveler.id)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedTravelerId === traveler.id ? "bg-teal-600" : "bg-gray-300"}`}>
                                                        <User className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-navy-900">
                                                            {traveler.name || `여행자 ${index + 1}`}
                                                            {index === 0 && <Badge variant="secondary" className="ml-2 text-xs">대표자</Badge>}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {isTravelerComplete(traveler) && <Check className="w-5 h-5 text-green-500" />}
                                                    {travelers.length > 1 && (
                                                        <Button type="button" variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); removeTraveler(traveler.id) }} className="text-red-500 hover:bg-red-100 h-7 w-7">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <Button type="button" variant="outline" onClick={addTraveler} className="w-full border-dashed">
                                        <Plus className="w-4 h-4 mr-2" />
                                        여행자 추가
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right: Traveler Details Form */}
                        <div className="lg:col-span-3">
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-navy-900">
                                        {selectedTraveler.name || `여행자 ${travelers.findIndex((t) => t.id === selectedTravelerId) + 1} 정보`}
                                    </CardTitle>
                                    <CardDescription>여권 정보는 실제 여권과 정확히 일치해야 합니다.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Accordion type="multiple" defaultValue={['item-1', 'item-2']} className="w-full">
                                        {/* Basic Info */}
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger className="text-lg font-semibold"><User className="w-5 h-5 mr-2 text-teal-600"/>기본 정보</AccordionTrigger>
                                            <AccordionContent className="pt-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2"><Label htmlFor={`name-${selectedTraveler.id}`}>한글 이름 *</Label><Input id={`name-${selectedTraveler.id}`} value={selectedTraveler.name} onChange={(e) => updateTraveler(selectedTraveler.id, "name", e.target.value)} required /></div>
                                                    <div className="space-y-2"><Label htmlFor={`nameEng-${selectedTraveler.id}`}>영문 이름 *</Label><Input id={`nameEng-${selectedTraveler.id}`} value={selectedTraveler.nameEng} onChange={(e) => updateTraveler(selectedTraveler.id, "nameEng", e.target.value)} placeholder="HONG GILDONG" required /></div>
                                                    <div className="space-y-2"><Label htmlFor={`gender-${selectedTraveler.id}`}>성별 *</Label><Select value={selectedTraveler.gender} onValueChange={(value) => updateTraveler(selectedTraveler.id, "gender", value)}><SelectTrigger><SelectValue placeholder="성별 선택" /></SelectTrigger><SelectContent><SelectItem value="male">남성</SelectItem><SelectItem value="female">여성</SelectItem></SelectContent></Select></div>
                                                    <div className="space-y-2"><Label htmlFor={`birth-${selectedTraveler.id}`}>생년월일 *</Label><Input id={`birth-${selectedTraveler.id}`} type="date" value={selectedTraveler.birth} onChange={(e) => updateTraveler(selectedTraveler.id, "birth", e.target.value)} required /></div>
                                                    <div className="space-y-2"><Label htmlFor={`phone-${selectedTraveler.id}`}>휴대전화 *</Label><Input id={`phone-${selectedTraveler.id}`} type="tel" value={selectedTraveler.phone} onChange={(e) => updateTraveler(selectedTraveler.id, "phone", e.target.value)} required /></div>
                                                    <div className="space-y-2"><Label htmlFor={`email-${selectedTraveler.id}`}>이메일 *</Label><Input id={`email-${selectedTraveler.id}`} type="email" value={selectedTraveler.email} onChange={(e) => updateTraveler(selectedTraveler.id, "email", e.target.value)} required /></div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>

                                        {/* Passport Info */}
                                        <AccordionItem value="item-2">
                                            <AccordionTrigger className="text-lg font-semibold"><ShieldCheck className="w-5 h-5 mr-2 text-teal-600"/>여권 정보</AccordionTrigger>
                                            <AccordionContent className="pt-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2"><Label htmlFor={`passportNumber-${selectedTraveler.id}`}>여권번호 *</Label><Input id={`passportNumber-${selectedTraveler.id}`} value={selectedTraveler.passportNumber} onChange={(e) => updateTraveler(selectedTraveler.id, "passportNumber", e.target.value)} required /></div>
                                                    <div className="space-y-2"><Label htmlFor={`passportExpiry-${selectedTraveler.id}`}>여권 만료일 *</Label><Input id={`passportExpiry-${selectedTraveler.id}`} type="date" value={selectedTraveler.passportExpiry} onChange={(e) => updateTraveler(selectedTraveler.id, "passportExpiry", e.target.value)} required /></div>
                                                </div>
                                                <div className="mt-6 space-y-2">
                                                    <Label htmlFor={`passportFile-${selectedTraveler.id}`}>여권 사본 업로드</Label>
                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                        <p className="text-sm text-gray-600 mb-2">여권 사진 페이지를 업로드해주세요</p>
                                                        <input id={`passportFile-${selectedTraveler.id}`} type="file" accept="image/*" onChange={(e) => handleFileUpload(selectedTraveler.id, e.target.files?.[0] || null)} className="hidden"/>
                                                        <Button type="button" variant="outline" onClick={() => document.getElementById(`passportFile-${selectedTraveler.id}`)?.click()} className="bg-transparent">파일 선택</Button>
                                                        {selectedTraveler.passportFile && (<p className="text-sm text-green-600 mt-2">✓ {selectedTraveler.passportFile.name}</p>)}
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>

                                        {/* Emergency Contact & Special Requests */}
                                        <AccordionItem value="item-3">
                                            <AccordionTrigger className="text-lg font-semibold"><HeartPulse className="w-5 h-5 mr-2 text-teal-600"/>비상 연락처 및 요청사항</AccordionTrigger>
                                            <AccordionContent className="pt-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2"><Label htmlFor={`emergencyContact-${selectedTraveler.id}`}>비상연락처 이름</Label><Input id={`emergencyContact-${selectedTraveler.id}`} value={selectedTraveler.emergencyContact} onChange={(e) => updateTraveler(selectedTraveler.id, "emergencyContact", e.target.value)} /></div>
                                                    <div className="space-y-2"><Label htmlFor={`emergencyPhone-${selectedTraveler.id}`}>비상연락처 전화번호</Label><Input id={`emergencyPhone-${selectedTraveler.id}`} type="tel" value={selectedTraveler.emergencyPhone} onChange={(e) => updateTraveler(selectedTraveler.id, "emergencyPhone", e.target.value)} /></div>
                                                </div>
                                                <div className="mt-6 space-y-2">
                                                    <Label htmlFor={`specialRequests-${selectedTraveler.id}`}>특별 요청사항</Label>
                                                    <Textarea id={`specialRequests-${selectedTraveler.id}`} value={selectedTraveler.specialRequests} onChange={(e) => updateTraveler(selectedTraveler.id, "specialRequests", e.target.value)} placeholder="식이요법, 휠체어 이용 등" rows={4}/>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Submission Area */}
                    <div className="mt-8">
                        <Card className="shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex-1 w-full">
                                        <p className="text-sm text-gray-600 mb-2">
                                            총 {travelers.length}명의 여행자 정보 중 {travelers.filter(isTravelerComplete).length}명 완료
                                        </p>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="bg-teal-600 h-2.5 rounded-full transition-all duration-500"
                                                style={{ width: `${(travelers.filter(isTravelerComplete).length / travelers.length) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full md:w-auto">
                                        <Button type="submit" size="lg" disabled={!isFormValid()} className="w-full bg-navy-600 hover:bg-navy-700 px-10 py-6 text-lg">
                                            여행자 정보 제출
                                        </Button>
                                    </div>
                                </div>
                                {!isFormValid() && <p className="text-xs text-red-600 mt-2 text-center md:text-right">* 모든 여행자의 필수 정보를 입력해야 제출할 수 있습니다.</p>}
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </div>
    )
}