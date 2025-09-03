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
import { Upload, User, Plus, Trash2, Check } from "lucide-react"

interface TravelerInfo {
  id: string
  name: string
  nameEng: string
  gender: string
  birth: string
  phone: string
  email: string
  address: string
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
      address: "",
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
      address: "",
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-navy-900 mb-4">여행자 정보 입력</h1>
          <p className="text-gray-600">
            여행 예약을 위해 모든 여행자의 정보를 정확히 입력해주세요.
            <br />
            여권 정보는 실제 여권과 정확히 일치해야 합니다.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 왼쪽 여행자 목록 */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="text-navy-900">여행자 목록</CardTitle>
                  <CardDescription>여행자를 선택하여 정보를 입력하세요</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {travelers.map((traveler, index) => (
                    <div
                      key={traveler.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedTravelerId === traveler.id
                          ? "border-navy-600 bg-navy-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedTravelerId(traveler.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              selectedTravelerId === traveler.id ? "bg-navy-600" : "bg-gray-400"
                            }`}
                          >
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-navy-900">
                              {traveler.name || `여행자 ${index + 1}`}
                              {index === 0 && <Badge className="ml-2 bg-teal-600 text-xs">대표자</Badge>}
                            </p>
                            <p className="text-xs text-gray-600">{traveler.nameEng || "영문명 미입력"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isTravelerComplete(traveler) && <Check className="w-4 h-4 text-green-600" />}
                          {travelers.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeTraveler(traveler.id)
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTraveler}
                    className="w-full bg-transparent border-dashed"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    여행자 추가
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* 오른쪽 상세 정보 */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-navy-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-navy-900">
                        {selectedTraveler.name ||
                          `여행자 ${travelers.findIndex((t) => t.id === selectedTravelerId) + 1}`}
                        {selectedTravelerId === travelers[0].id && <Badge className="ml-2 bg-teal-600">대표자</Badge>}
                      </CardTitle>
                      <CardDescription>모든 필수 정보를 입력해주세요</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-8">
                  {/* 기본 정보 */}
                  <div>
                    <h3 className="text-lg font-semibold text-navy-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      기본 정보
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`name-${selectedTraveler.id}`}>한글 이름 *</Label>
                        <Input
                          id={`name-${selectedTraveler.id}`}
                          value={selectedTraveler.name}
                          onChange={(e) => updateTraveler(selectedTraveler.id, "name", e.target.value)}
                          placeholder="홍길동"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`nameEng-${selectedTraveler.id}`}>영문 이름 *</Label>
                        <Input
                          id={`nameEng-${selectedTraveler.id}`}
                          value={selectedTraveler.nameEng}
                          onChange={(e) => updateTraveler(selectedTraveler.id, "nameEng", e.target.value)}
                          placeholder="HONG GILDONG"
                          required
                        />
                        <p className="text-xs text-gray-600">여권에 기재된 영문명과 정확히 일치해야 합니다</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`gender-${selectedTraveler.id}`}>성별 *</Label>
                        <Select
                          value={selectedTraveler.gender}
                          onValueChange={(value) => updateTraveler(selectedTraveler.id, "gender", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="성별 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">남성</SelectItem>
                            <SelectItem value="female">여성</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`birth-${selectedTraveler.id}`}>생년월일 *</Label>
                        <Input
                          id={`birth-${selectedTraveler.id}`}
                          type="date"
                          value={selectedTraveler.birth}
                          onChange={(e) => updateTraveler(selectedTraveler.id, "birth", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* 연락처 정보 */}
                  <div>
                    <h3 className="text-lg font-semibold text-navy-900 mb-4">연락처 정보</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`phone-${selectedTraveler.id}`}>휴대전화 *</Label>
                        <Input
                          id={`phone-${selectedTraveler.id}`}
                          type="tel"
                          value={selectedTraveler.phone}
                          onChange={(e) => updateTraveler(selectedTraveler.id, "phone", e.target.value)}
                          placeholder="010-1234-5678"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`email-${selectedTraveler.id}`}>이메일 *</Label>
                        <Input
                          id={`email-${selectedTraveler.id}`}
                          type="email"
                          value={selectedTraveler.email}
                          onChange={(e) => updateTraveler(selectedTraveler.id, "email", e.target.value)}
                          placeholder="example@email.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Label htmlFor={`address-${selectedTraveler.id}`}>주소</Label>
                      <Input
                        id={`address-${selectedTraveler.id}`}
                        value={selectedTraveler.address}
                        onChange={(e) => updateTraveler(selectedTraveler.id, "address", e.target.value)}
                        placeholder="서울특별시 강남구 테헤란로 123"
                      />
                    </div>
                  </div>

                  {/* 여권 정보 */}
                  <div>
                    <h3 className="text-lg font-semibold text-navy-900 mb-4">여권 정보</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`passportNumber-${selectedTraveler.id}`}>여권번호 *</Label>
                        <Input
                          id={`passportNumber-${selectedTraveler.id}`}
                          value={selectedTraveler.passportNumber}
                          onChange={(e) => updateTraveler(selectedTraveler.id, "passportNumber", e.target.value)}
                          placeholder="M12345678"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`passportExpiry-${selectedTraveler.id}`}>여권 만료일 *</Label>
                        <Input
                          id={`passportExpiry-${selectedTraveler.id}`}
                          type="date"
                          value={selectedTraveler.passportExpiry}
                          onChange={(e) => updateTraveler(selectedTraveler.id, "passportExpiry", e.target.value)}
                          required
                        />
                        <p className="text-xs text-gray-600">여행 종료일로부터 6개월 이상 유효해야 합니다</p>
                      </div>
                    </div>

                    {/* 여권 사본 업로드 */}
                    <div className="mt-4 space-y-2">
                      <Label htmlFor={`passportFile-${selectedTraveler.id}`}>여권 사본 업로드 *</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">여권 사진 페이지를 업로드해주세요</p>
                        <p className="text-xs text-gray-500 mb-4">JPG, PNG 파일만 가능 (최대 10MB)</p>
                        <input
                          id={`passportFile-${selectedTraveler.i}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(selectedTraveler.id, e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById(`passportFile-${selectedTraveler.id}`)?.click()}
                          className="bg-transparent"
                        >
                          파일 선택
                        </Button>
                        {selectedTraveler.passportFile && (
                          <p className="text-sm text-green-600 mt-2">✓ {selectedTraveler.passportFile.name}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 비상연락처 */}
                  <div>
                    <h3 className="text-lg font-semibold text-navy-900 mb-4">비상연락처</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`emergencyContact-${selectedTraveler.id}`}>비상연락처 이름</Label>
                        <Input
                          id={`emergencyContact-${selectedTraveler.id}`}
                          value={selectedTraveler.emergencyContact}
                          onChange={(e) => updateTraveler(selectedTraveler.id, "emergencyContact", e.target.value)}
                          placeholder="김가족"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`emergencyPhone-${selectedTraveler.id}`}>비상연락처 전화번호</Label>
                        <Input
                          id={`emergencyPhone-${selectedTraveler.id}`}
                          type="tel"
                          value={selectedTraveler.emergencyPhone}
                          onChange={(e) => updateTraveler(selectedTraveler.id, "emergencyPhone", e.target.value)}
                          placeholder="010-9876-5432"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 특별 요청사항 */}
                  <div>
                    <h3 className="text-lg font-semibold text-navy-900 mb-4">특별 요청사항</h3>
                    <div className="space-y-2">
                      <Label htmlFor={`specialRequests-${selectedTraveler.id}`}>특별 요청사항</Label>
                      <Textarea
                        id={`specialRequests-${selectedTraveler.id}`}
                        value={selectedTraveler.specialRequests}
                        onChange={(e) => updateTraveler(selectedTraveler.id, "specialRequests", e.target.value)}
                        placeholder="식이요법, 휠체어 이용, 기타 특별한 요청사항이 있으시면 입력해주세요"
                        rows={4}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="mt-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  총 {travelers.length}명의 여행자 정보 중 {travelers.filter(isTravelerComplete).length}명 완료
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-navy-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(travelers.filter(isTravelerComplete).length / travelers.length) * 100}%` }}
                  />
                </div>
              </div>
              <Button type="submit" size="lg" disabled={!isFormValid()} className="bg-navy-600 hover:bg-navy-700 px-8">
                여행자 정보 제출
              </Button>
              <p className="text-xs text-gray-500 mt-2">* 표시된 항목은 필수 입력 사항입니다</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
