"use client"

import {useEffect, useState} from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Users, Calendar, Waves } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ActivityCard from "@/components/ActivityCard";
import {Product, productApi} from "@/lib/product";
import SpaCard from "@/components/SpaCard";

export default function SpaPage() {
  const [spas, setSpas] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [destination, setDestination] = useState("")
  const [duration, setDuration] = useState("")
  const [guests, setGuests] = useState("2")
  const [spaType, setSpaType] = useState("")

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                setIsLoading(true)
                const response = await productApi.search({ category: "SPA", size: 10 })
                setSpas(response.content)
            } catch (error) {
                console.error("Failed to fetch vehicles:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchVehicles()
    }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-navy-900 to-teal-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Waves className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">스파 & 웰니스</h1>
            <p className="text-xl text-gray-200">몸과 마음의 완전한 힐링을 경험하세요</p>
          </div>

          {/* Search Form */}
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">목적지</Label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger>
                      <SelectValue placeholder="스파 목적지" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bali">발리</SelectItem>
                      <SelectItem value="thailand">태국</SelectItem>
                      <SelectItem value="japan">일본</SelectItem>
                      <SelectItem value="korea">한국</SelectItem>
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
                      <SelectItem value="2-3">2박 3일</SelectItem>
                      <SelectItem value="3-4">3박 4일</SelectItem>
                      <SelectItem value="4-5">4박 5일</SelectItem>
                      <SelectItem value="5+">5박 이상</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guests">인원</Label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1명</SelectItem>
                      <SelectItem value="2">2명</SelectItem>
                      <SelectItem value="3-4">3-4명</SelectItem>
                      <SelectItem value="group">그룹</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spaType">스파 타입</Label>
                  <Select value={spaType} onValueChange={setSpaType}>
                    <SelectTrigger>
                      <SelectValue placeholder="스파 종류" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="luxury">럭셔리</SelectItem>
                      <SelectItem value="wellness">웰니스</SelectItem>
                      <SelectItem value="traditional">전통</SelectItem>
                      <SelectItem value="medical">메디컬</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full mt-6 bg-teal-600 hover:bg-teal-700">스파 검색</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Spa Packages */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-navy-900">인기 스파 패키지</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {isLoading
                  ? Array.from({ length: 6 }).map((_, idx) => (
                      <Card key={idx} className="w-full h-80 bg-gray-200 animate-pulse" />
                  ))
                  : spas.map((spa) => <SpaCard key={spa.id} product={spa} />)}
          </div>
        </div>
      </section>
    </div>
  )
}
