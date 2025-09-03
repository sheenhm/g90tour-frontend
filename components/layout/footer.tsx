import Link from "next/link"
import Image from "next/image"
import {
    UserRound,
    Mail,
    MapPin,
    Briefcase,
    Lock,
    MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"

function InfoItem({
                      icon: Icon,
                      children,
                      href,
                  }: {
    icon: React.ElementType
    children: React.ReactNode
    href?: string
}) {
    const content = href ? (
        <a
            href={href}
            className="hover:text-white transition-colors"
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
            {children}
        </a>
    ) : (
        <span>{children}</span>
    )

    return (
        <div className="flex items-center space-x-3">
            <Icon className="h-4 w-4 shrink-0" />
            {content}
        </div>
    )
}

const footerLinks = [
    { name: "이용약관", href: "/terms", icon: Briefcase },
    { name: "개인정보처리방침", href: "/privacy", icon: Lock },
]

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400">
            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* 로고 + 회사명 + 슬로건 */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-3 mb-3">
                            <Image
                                src="/logo.png"
                                alt="G90 Entertainment"
                                width={80}
                                height={40}
                                className="rounded-full bg-white p-1"
                            />
                            <div>
                                <p className="text-lg font-bold text-white">(주)지구공엔터테인먼트</p>
                                <p className="text-sm text-gray-300">여행의 모든 것, 지구공투어</p>
                            </div>
                        </div>

                        {/* 회사 정보 */}
                        <address className="not-italic space-y-3 text-sm text-gray-300">
                            <InfoItem icon={UserRound}>대표이사: 신근주</InfoItem>
                            <InfoItem icon={Mail} href="mailto:help@g90tour.com">
                                help@g90tour.com
                            </InfoItem>
                            <InfoItem icon={MapPin}>
                                서울특별시 강서구 마곡중앙6로 21, 727호
                            </InfoItem>
                        </address>
                    </div>

                    {/* Spacer */}
                    <div className="hidden lg:block" />

                    {/* 주요 링크 */}
                    <div className="lg:col-span-1 lg:text-right">
                        <h3 className="font-semibold text-white mb-4">LINK</h3>
                        <div className="space-y-3">
                            {footerLinks.map(({ name, href, icon: Icon }) => (
                                <Link
                                    key={name}
                                    href={href}
                                    className="flex items-center lg:justify-end gap-3 hover:text-white transition-colors"
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{name}</span>
                                </Link>
                            ))}
                        </div>

                        {/* 버튼 링크 */}
                        <div className="mt-6 flex lg:justify-end gap-2">
                            <Button
                                asChild
                                variant="outline"
                                className="bg-transparent border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900"
                            >
                                <Link href="/kakao" target="_blank" rel="noopener noreferrer">
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    카카오톡 채널
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="bg-transparent border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900"
                            >
                                <Link href="/chat" target="_blank" rel="noopener noreferrer">
                                    채널 상담
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-800 my-8" />

                <div className="text-center text-sm text-gray-500">
                    <p>&copy; 2025 G90 ENTERTAINMENT. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    )
}