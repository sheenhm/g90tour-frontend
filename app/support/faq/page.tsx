"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, HelpCircle } from "lucide-react"
import { supportApi, type Faq } from "@/lib/api"

const faqCategories = [
    { id: "all", name: "전체" },
    { id: "booking", name: "예약/결제" },
    { id: "travel", name: "여행 정보" },
    { id: "cancel", name: "취소/환불" },
    { id: "account", name: "계정/회원" },
    { id: "other", name: "기타" },
]

export default function FAQPage() {
    const [faqs, setFaqs] = useState<Faq[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                setIsLoading(true)
                const data = await supportApi.getFaqs(selectedCategory)
                setFaqs(data)
            } catch (error) {
                console.error("Failed to fetch FAQs:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchFaqs()
    }, [selectedCategory])

    const filteredFAQs = faqs.filter(
        (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-navy-900 to-teal-800 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <HelpCircle className="w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold mb-4">자주묻는질문</h1>
                    <p className="text-xl text-gray-200">궁금한 점을 빠르게 해결하세요</p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16">
                {/* Search */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                placeholder="궁금한 내용을 검색해보세요..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Categories */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-navy-900">카테고리</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {faqCategories.map((category) => (
                                    <Button
                                        key={category.id}
                                        variant={selectedCategory === category.id ? "default" : "ghost"}
                                        className={`w-full justify-between ${
                                            selectedCategory === category.id ? "bg-navy-600 hover:bg-navy-700" : "hover:bg-gray-100"
                                        }`}
                                        onClick={() => setSelectedCategory(category.id)}
                                    >
                                        <span>{category.name}</span>
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* FAQ Content */}
                    <div className="lg:col-span-3 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-navy-900">
                                    {faqCategories.find((c) => c.id === selectedCategory)?.name}
                                </CardTitle>
                                <CardDescription>{filteredFAQs.length}개의 질문이 있습니다</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600 mx-auto mb-4"></div>
                                        <p>FAQ를 불러오는 중입니다...</p>
                                    </div>
                                ) : filteredFAQs.length > 0 ? (
                                    <Accordion type="single" collapsible className="w-full">
                                        {filteredFAQs.map((faq) => (
                                            <AccordionItem key={faq.id} value={faq.id.toString()}>
                                                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                                                <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">검색 결과가 없습니다.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}