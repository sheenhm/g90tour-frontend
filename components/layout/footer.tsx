import Link from "next/link";
import Image from "next/image";
import {
    MapPin,
    MessageSquare,
    Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function InfoItem({
                      icon: Icon,
                      title,
                      content,
                      href,
                  }: {
    icon: React.ElementType;
    title: string;
    content: React.ReactNode;
    href?: string;
}) {
    const contentElement = href ? (
        <a
            href={href}
            className="hover:text-white transition-colors"
            target={href.startsWith("http") || href.startsWith("mailto") ? "_blank" : undefined}
            rel="noopener noreferrer"
        >
            {content}
        </a>
    ) : (
        <span>{content}</span>
    );

    return (
        <div className="flex items-start space-x-3">
            <Icon className="h-5 w-5 shrink-0 mt-1 text-yellow-400" />
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-300">{title}</span>
                <span className="text-base">{contentElement}</span>
            </div>
        </div>
    );
}

const footerLinks = [
    { name: "이용약관", href: "/terms" },
    { name: "개인정보처리방침", href: "/privacy" },
    { name: "고객센터", href: "/support" },
];

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400">
            <div className="container mx-auto px-4 py-16">
                {/* 상단: 좌측(회사), 우측(지사+고객센터) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* 회사 소개 */}
                    <div>
                        <div className="flex items-center space-x-3 mb-4">
                            <Image
                                src="/logo.png"
                                alt="G90 Entertainment"
                                width={50}
                                height={50}
                                className="rounded-full bg-white p-1"
                            />
                            <div>
                                <p className="text-xl font-bold text-white">(주)지구공엔터테인먼트</p>
                                <p className="text-sm text-gray-300">여행의 모든 것, 지구공투어</p>
                            </div>
                        </div>
                    </div>

                    {/* 우측: 지사 정보 + 고객센터 */}
                    <div className="grid sm:grid-cols-2 gap-8">
                        {/* 지사 정보 */}
                        <div>
                            <h3 className="font-semibold text-white mb-4 text-lg">지사 정보</h3>
                            <div className="space-y-4 not-italic text-gray-300">
                                <InfoItem icon={MapPin} title="한국 지사" content="서울특별시 강서구 마곡중앙6로 21, 727호" />
                                <InfoItem icon={MapPin} title="태국 지사" content="P23 Building, Level 10, Soi Sukhumvit 23, Sukhumvit Road, North Klongtoey, Wattana, Bangkok" />
                            </div>
                        </div>

                        {/* 고객센터 */}
                        <div>
                            <h3 className="font-semibold text-white mb-4 text-lg">고객센터</h3>
                            <div className="space-y-4 not-italic text-gray-300">
                                <InfoItem
                                    icon={Phone}
                                    title="대표번호"
                                    content="02-2662-2110"
                                    href="tel:02-2662-2110"
                                />
                                <InfoItem
                                    icon={MessageSquare}
                                    title="카카오톡 채널"
                                    content="@g90tour"
                                    href="https://pf.kakao.com/_xofrzn/chat"
                                />
                                <p className="text-xs pt-2">운영시간: 평일 09:00 - 18:00 (점심시간 12:00 - 13:00)</p>
                            </div>

                            {/* CTA 버튼 */}
                            <div className="mt-6 flex flex-wrap gap-2">
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
                </div>

                <hr className="border-gray-800 my-10" />

                {/* 하단 바: 좌측 저작권 / 우측 링크 */}
                <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
                    <p className="text-sm text-gray-500 mb-4 sm:mb-0">
                        &copy; {new Date().getFullYear()} G90 ENTERTAINMENT. All Rights Reserved.
                    </p>
                    <div className="flex space-x-6 text-sm">
                        {footerLinks.map(({ name, href }) => (
                            <Link
                                key={name}
                                href={href}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                {name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}