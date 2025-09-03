import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, HelpCircle, Bell, Phone, Mail, Clock } from "lucide-react"
import Link from "next/link"

const supportOptions = [
  {
    title: "공지사항",
    description: "최신 소식과 중요한 공지사항을 확인하세요",
    icon: Bell,
    href: "/support/notice",
    color: "bg-navy-600",
  },
  {
    title: "자주묻는질문",
    description: "궁금한 점을 빠르게 해결하세요",
    icon: HelpCircle,
    href: "/support/faq",
    color: "bg-teal-600",
  },
  {
    title: "1:1 문의",
    description: "개인적인 문의사항을 남겨주세요",
    icon: MessageCircle,
    href: "/support/inquiry",
    color: "bg-navy-600",
  },
]

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-navy-900 to-teal-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">고객센터</h1>
          <p className="text-xl text-gray-200">언제든지 도움이 필요하시면 연락주세요</p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Support Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportOptions.map((option) => (
              <Link key={option.title} href={option.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
                  <CardHeader className="text-center">
                    <div
                      className={`w-16 h-16 ${option.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <option.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-navy-900">{option.title}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button variant="outline" className="w-full bg-transparent">
                      바로가기
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

            {/* Contact Info */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <Card className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                                {/* 전화 상담 */}
                                <div className="p-6 text-center">
                                    <div className="w-16 h-16 bg-navy-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Phone className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">전화 상담</h3>
                                    <p className="text-2xl font-bold text-navy-900 mb-2">02-2662-2110</p>
                                    <p className="text-gray-600">평일 09:00 - 18:00 (한국시간 기준)</p>
                                </div>

                                {/* 이메일 문의 */}
                                <div className="p-6 text-center">
                                    <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Mail className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">이메일 문의</h3>
                                    <p className="text-lg font-medium text-navy-900 mb-2">help@g90tour.com</p>
                                    <p className="text-gray-600">24시간 접수 가능</p>
                                </div>

                                {/* 홈페이지 문의 */}
                                <div className="p-6 text-center">
                                    <div className="w-16 h-16 bg-navy-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Clock className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">홈페이지 문의</h3>
                                    <p className="text-gray-600">24시간 접수 가능</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
      </section>
    </div>
  )
}
