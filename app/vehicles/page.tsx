"use client"

import {useEffect, useState} from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Users, Calendar, Car, Fuel, Settings } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {Product, productApi} from "@/lib/product";
import VehicleCard from "@/components/VehicleCard";

export default function VehiclesPage() {
    const [vehicles, setVehicles] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [location, setLocation] = useState("")
    const [vehicleType, setVehicleType] = useState("")
    const [duration, setDuration] = useState("")
    const [passengers, setPassengers] = useState("4")

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                setIsLoading(true)
                const response = await productApi.search({ category: "VEHICLE", size: 10 })
                setVehicles(response.content)
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
            <Car className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">차량 렌탈</h1>
            <p className="text-xl text-gray-200">편안하고 안전한 여행을 위한 다양한 차량 서비스</p>
          </div>

          {/* Search Form */}
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">지역</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="렌탈 지역" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jeju">제주도</SelectItem>
                      <SelectItem value="seoul">서울</SelectItem>
                      <SelectItem value="busan">부산</SelectItem>
                      <SelectItem value="gangneung">강릉</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">차량 종류</Label>
                  <Select value={vehicleType} onValueChange={setVehicleType}>
                    <SelectTrigger>
                      <SelectValue placeholder="차량 타입" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">소형차</SelectItem>
                      <SelectItem value="sedan">중형차</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="van">승합차</SelectItem>
                      <SelectItem value="luxury">럭셔리</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">대여 기간</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="대여 기간" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1일</SelectItem>
                      <SelectItem value="2-3">2-3일</SelectItem>
                      <SelectItem value="4-7">4-7일</SelectItem>
                      <SelectItem value="weekly">1주일 이상</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passengers">승차 인원</Label>
                  <Select value={passengers} onValueChange={setPassengers}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2명</SelectItem>
                      <SelectItem value="4">4명</SelectItem>
                      <SelectItem value="7">7명</SelectItem>
                      <SelectItem value="11">11명</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full mt-6 bg-teal-600 hover:bg-teal-700">차량 검색</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Vehicle Packages */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-navy-900">인기 차량 렌탈</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {isLoading
                  ? Array.from({ length: 6 }).map((_, idx) => (
                      <Card key={idx} className="w-full h-80 bg-gray-200 animate-pulse" />
                  ))
                  : vehicles.map((vehicle) => <VehicleCard key={vehicle.id} product={vehicle} />)}
          </div>
        </div>
      </section>
    </div>
  )
}
