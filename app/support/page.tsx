import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, HelpCircle, Bell, Phone, Mail, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const supportOptions = [
    {
        title: "자주묻는질문 (FAQ)",
        description: "가장 자주 묻는 질문에 대한 답변을 모아두었어요.",
        icon: HelpCircle,
        href: "/support/faq",
        color: "text-teal-600",
        bgColor: "bg-teal-50",
    },
    {
        title: "1:1 문의하기",
        description: "궁금한 점을 직접 문의하고 답변을 받아보세요.",
        icon: MessageCircle,
        href: "/support/inquiry",
        color: "text-navy-600",
        bgColor: "bg-navy-50",
    },
    {
        title: "공지사항",
        description: "G90 투어의 최신 소식과 중요한 정보를 확인하세요.",
        icon: Bell,
        href: "/support/notice",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
    },
]

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative h-[400px] w-full flex items-center justify-center">
                <Image
                    src="https://images.unsplash.com/photo-1556740772-1a741367b93e?q=80&w=2070&auto=format&fit=crop"
                    alt="Customer support"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 container mx-auto px-4 text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">무엇을 도와드릴까요?</h1>
                    <p className="text-lg md:text-xl text-gray-200">G90 투어 고객센터는 언제나 여러분의 궁금증을 해결해 드립니다.</p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Support Options */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {supportOptions.map((option) => (
                            <Card key={option.title} className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                                <CardHeader className="items-center text-center">
                                    <div className={`w-16 h-16 ${option.bgColor} rounded-full flex items-center justify-center mb-4`}>
                                        <option.icon className={`w-8 h-8 ${option.color}`} />
                                    </div>
                                    <CardTitle className="text-navy-900 text-xl">{option.title}</CardTitle>
                                    <CardDescription>{option.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button asChild variant="outline" className="w-full bg-transparent group">
                                        <Link href={option.href} className="flex items-center justify-center">
                                            바로가기 <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"/>
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Contact Info */}
                    <Card className="overflow-hidden">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl text-navy-900">실시간 상담 안내</CardTitle>
                            <CardDescription>전화 또는 이메일로 문의하시면 신속하게 답변해 드립니다.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                {/* 전화 상담 */}
                                <div className="p-8 text-center border-b md:border-b-0 md:border-r">
                                    <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Phone className="w-8 h-8 text-navy-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-navy-900">전화 상담</h3>
                                    <p className="text-3xl font-bold text-navy-800 mb-2 tracking-tight">02-2662-2110</p>
                                    <div className="text-gray-600 flex items-center justify-center gap-2">
                                        <Clock className="w-4 h-4"/>
                                        <span>평일 09:00 - 18:00 (한국시간 기준)</span>
                                    </div>
                                </div>

                                {/* 이메일 문의 */}
                                <div className="p-8 text-center">
                                    <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Mail className="w-8 h-8 text-teal-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-navy-900">이메일 문의</h3>
                                    <p className="text-xl font-medium text-teal-700 mb-2">help@g90tour.com</p>
                                    <div className="text-gray-600 flex items-center justify-center gap-2">
                                        <Clock className="w-4 h-4"/>
                                        <span>24시간 접수 가능 (영업일 기준 답변)</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}