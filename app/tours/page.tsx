"use client"

import {useEffect, useState} from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Users, Calendar, Plane } from "lucide-react"
import {Product, productApi} from "@/lib/product";
import TourCard from "@/components/TourCard";

export default function ToursPage() {
  const [tours, setTours] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [destination, setDestination] = useState("")
  const [duration, setDuration] = useState("")
  const [travelers, setTravelers] = useState("2")
  const [tourType, setTourType] = useState("")

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                setIsLoading(true)
                const response = await productApi.search({ category: "TOUR", size: 10 })
                setTours(response.content)
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
            <Plane className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">패키지 투어</h1>
            <p className="text-xl text-gray-200">전 세계 명소를 편안하게 여행하세요</p>
          </div>

          {/* Search Form */}
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">목적지</Label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger>
                      <SelectValue placeholder="여행 목적지" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="europe">유럽</SelectItem>
                      <SelectItem value="asia">아시아</SelectItem>
                      <SelectItem value="america">미주</SelectItem>
                      <SelectItem value="oceania">오세아니아</SelectItem>
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
                      <SelectItem value="3-5">3-5일</SelectItem>
                      <SelectItem value="6-8">6-8일</SelectItem>
                      <SelectItem value="9-12">9-12일</SelectItem>
                      <SelectItem value="over-12">12일 이상</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="travelers">인원</Label>
                  <Select value={travelers} onValueChange={setTravelers}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1명</SelectItem>
                      <SelectItem value="2">2명</SelectItem>
                      <SelectItem value="3-4">3-4명</SelectItem>
                      <SelectItem value="5+">5명 이상</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tourType">투어 타입</Label>
                  <Select value={tourType} onValueChange={setTourType}>
                    <SelectTrigger>
                      <SelectValue placeholder="투어 종류" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="package">패키지투어</SelectItem>
                      <SelectItem value="cultural">문화투어</SelectItem>
                      <SelectItem value="nature">자연투어</SelectItem>
                      <SelectItem value="food">미식투어</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full mt-6 bg-teal-600 hover:bg-teal-700">투어 검색</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tour Packages */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-navy-900">인기 투어 상품</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {isLoading
                    ? Array.from({ length: 6 }).map((_, idx) => (
                        <Card key={idx} className="w-full h-80 bg-gray-200 animate-pulse" />
                    ))
                    : tours.map((tour) => <TourCard key={tour.id} product={tour} />)}
            </div>
        </div>
      </section>
    </div>
  )
}
