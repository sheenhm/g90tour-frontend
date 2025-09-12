"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, HelpCircle, MessageSquare } from "lucide-react"
import { supportApi, type Faq } from "@/lib/api"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
            <section className="relative h-[400px] w-full flex items-center justify-center">
                <Image
                    src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop"
                    alt="FAQ"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 container mx-auto px-4 text-center text-white">
                    <HelpCircle className="w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">자주 묻는 질문</h1>
                    <p className="text-lg md:text-xl text-gray-200">궁금한 점을 빠르게 해결하세요.</p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 max-w-4xl">
                {/* Search */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                        placeholder="궁금한 내용을 검색해보세요..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-12 text-lg rounded-full shadow-md"
                    />
                </div>

                <Card>
                    <CardContent className="p-6">
                        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6">
                                {faqCategories.map((category) => (
                                    <TabsTrigger key={category.id} value={category.id}>
                                        {category.name}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            <TabsContent value={selectedCategory}>
                                {isLoading ? (
                                    <div className="text-center py-20">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600 mx-auto mb-4"></div>
                                        <p>FAQ를 불러오는 중입니다...</p>
                                    </div>
                                ) : filteredFAQs.length > 0 ? (
                                    <Accordion type="single" collapsible className="w-full space-y-2">
                                        {filteredFAQs.map((faq, index) => (
                                            <AccordionItem key={faq.id} value={`item-${index}`} className="border rounded-lg bg-white">
                                                <AccordionTrigger className="text-left font-semibold text-navy-900 px-6 py-4 hover:no-underline">
                                                    <span className="text-teal-600 mr-3">Q.</span>{faq.question}
                                                </AccordionTrigger>
                                                <AccordionContent className="px-6 pb-4 text-gray-700 leading-relaxed border-t pt-4">
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-navy-600 font-bold">A.</span>
                                                        <p>{faq.answer}</p>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                ) : (
                                    <div className="text-center py-20">
                                        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                                        <p className="text-gray-500">검색 결과가 없습니다.</p>
                                        <p className="text-sm text-gray-400 mt-2">다른 검색어나 카테고리를 선택해보세요.</p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}