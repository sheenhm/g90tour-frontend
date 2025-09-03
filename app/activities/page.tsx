"use client"

import {useEffect, useState} from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Users, Calendar, Dumbbell, Clock, AlertTriangle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import VehicleCard from "@/components/VehicleCard";
import ActivityCard from "@/components/ActivityCard";
import {Product, productApi} from "@/lib/product";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [location, setLocation] = useState("")
  const [activityType, setActivityType] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [participants, setParticipants] = useState("2")

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                setIsLoading(true)
                const response = await productApi.search({ category: "ACTIVITY", size: 10 })
                setActivities(response.content)
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
            <Dumbbell className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">액티비티 & 어드벤처</h1>
            <p className="text-xl text-gray-200">스릴 넘치는 모험과 특별한 경험을 만나보세요</p>
          </div>

          {/* Search Form */}
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">지역</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="활동 지역" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jeju">제주도</SelectItem>
                      <SelectItem value="gangwon">강원도</SelectItem>
                      <SelectItem value="busan">부산</SelectItem>
                      <SelectItem value="gyeonggi">경기도</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activityType">활동 종류</Label>
                  <Select value={activityType} onValueChange={setActivityType}>
                    <SelectTrigger>
                      <SelectValue placeholder="액티비티 타입" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="extreme">익스트림</SelectItem>
                      <SelectItem value="water">수상스포츠</SelectItem>
                      <SelectItem value="nature">자연체험</SelectItem>
                      <SelectItem value="culture">문화체험</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">난이도</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="난이도 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">초급</SelectItem>
                      <SelectItem value="intermediate">중급</SelectItem>
                      <SelectItem value="advanced">고급</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="participants">인원</Label>
                  <Select value={participants} onValueChange={setParticipants}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1명</SelectItem>
                      <SelectItem value="2">2명</SelectItem>
                      <SelectItem value="3-5">3-5명</SelectItem>
                      <SelectItem value="6+">6명 이상</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full mt-6 bg-teal-600 hover:bg-teal-700">액티비티 검색</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Activity Packages */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-navy-900">인기 액티비티</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {isLoading
                    ? Array.from({ length: 6 }).map((_, idx) => (
                        <Card key={idx} className="w-full h-80 bg-gray-200 animate-pulse" />
                    ))
                    : activities.map((activity) => <ActivityCard key={activity.id} product={activity} />)}
            </div>
        </div>
      </section>
    </div>
  )
}