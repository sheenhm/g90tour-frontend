"use client"

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Calendar, Users, CreditCard, Hash, AlertCircle, Info,
    Mail, Phone, Home, MessageSquare, Loader2, Plane, Ticket, HelpCircle, User, CheckCircle
} from 'lucide-react';
import { bookingApi, BookingResponse, productApi, Product } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

const statusConfig: { [key: string]: { color: string; text: string; icon: React.ElementType } } = {
    QUOTE_REQUESTED: { color: "bg-blue-600", text: "견적 요청", icon: MessageSquare },
    PAYMENT_PENDING: { color: "bg-yellow-600", text: "결제 대기", icon: CreditCard },
    PAYMENT_COMPLETED: { color: "bg-green-600", text: "결제 완료", icon: CheckCircle },
    TRAVEL_COMPLETED: { color: "bg-gray-600", text: "여행 완료", icon: Plane },
    CANCEL_PENDING: { color: "bg-orange-600", text: "취소 요청", icon: AlertCircle },
    CANCELLED: { color: "bg-red-600", text: "취소 완료", icon: AlertCircle },
};

function BookingDetailComponent() {
    const params = useParams();
    const router = useRouter();
    const bookingId = params.id as string;

    const [booking, setBooking] = useState<BookingResponse | null>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (bookingId) {
            const fetchData = async () => {
                try {
                    setIsLoading(true);
                    // This is a placeholder, you'll need a real API endpoint
                    // For now, let's pretend mypage's booking history can be filtered
                    const myPageInfo = await bookingApi.getById(bookingId);
                    setBooking(myPageInfo);

                    if (myPageInfo.productId) {
                        const productInfo = await productApi.getById(myPageInfo.productId);
                        setProduct(productInfo);
                    }

                } catch (err) {
                    setError("예약 정보를 불러오는 데 실패했습니다.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [bookingId]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-navy-600" />
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="flex h-screen items-center justify-center text-center">
                <Card className="p-8 shadow-lg">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <CardTitle className="text-xl text-red-700">오류 발생</CardTitle>
                    <CardDescription className="mt-2">{error || "예약 정보를 찾을 수 없습니다."}</CardDescription>
                    <Button asChild className="mt-6">
                        <Link href="/mypage">마이페이지로 돌아가기</Link>
                    </Button>
                </Card>
            </div>
        );
    }

    const StatusIcon = statusConfig[booking.status]?.icon || Info;

    return (
        <div className="min-h-screen bg-gray-100">
            <section className="bg-navy-900 text-white py-10">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">예약 상세 정보</h1>
                            <p className="text-gray-300">예약번호: {booking.bookingId}</p>
                        </div>
                        <Badge className={`${statusConfig[booking.status]?.color} text-lg px-4 py-2 flex items-center gap-2`}>
                            <StatusIcon className="w-5 h-5"/>
                            {statusConfig[booking.status]?.text || booking.status}
                        </Badge>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Product Info */}
                        <Card className="shadow-lg">
                            <CardContent className="p-0 flex flex-col md:flex-row">
                                {product && (
                                    <Image src={product.imageUrl} alt={product.name} width={250} height={200} className="w-full md:w-1/3 h-48 md:h-auto object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"/>
                                )}
                                <div className="p-6 flex flex-col justify-center">
                                    <Badge variant="secondary" className="mb-2 w-fit">{product?.category}</Badge>
                                    <h2 className="text-2xl font-bold text-navy-900">{booking.productName}</h2>
                                    <div className="flex items-center gap-4 mt-2 text-gray-600 text-sm">
                                        <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/><span>{booking.travelDate}</span></div>
                                        <div className="flex items-center gap-1.5"><Users className="w-4 h-4"/><span>{booking.counts}명</span></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Booking Details */}
                        <Card className="shadow-lg">
                            <CardHeader><CardTitle>예약자 정보</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                <div className="flex items-center gap-3"><User className="w-5 h-5 text-teal-600"/><span className="font-medium">{booking.customerName}</span></div>
                            </CardContent>
                        </Card>

                        {/* Special Requests */}
                        {booking.specialRequests && (
                            <Card className="shadow-lg">
                                <CardHeader><CardTitle>특별 요청사항</CardTitle></CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{booking.specialRequests}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        <Card className="sticky top-28 shadow-lg">
                            <CardHeader><CardTitle>결제 정보</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span>상품 금액</span><span>{booking.originalPrice.toLocaleString()}원</span></div>
                                    <div className="flex justify-between"><span>할인 금액</span><span className="text-red-600">- {booking.discountedAmount.toLocaleString()}원</span></div>
                                </div>
                                <Separator/>
                                <div className="flex justify-between items-baseline font-bold text-xl">
                                    <span>총 결제 금액</span>
                                    <span className="text-navy-900">{booking.totalPrice.toLocaleString()}원</span>
                                </div>
                                <Separator/>
                                <div className="text-xs text-gray-500">
                                    <p>예약일: {new Date(booking.createdAt).toLocaleString()}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-lg">
                            <CardHeader><CardTitle>도움이 필요하신가요?</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                <Button asChild variant="outline" className="w-full"><Link href="/support/inquiry"><MessageSquare className="w-4 h-4 mr-2"/>1:1 문의하기</Link></Button>
                                <Button asChild variant="outline" className="w-full"><Link href="/support/faq"><HelpCircle className="w-4 h-4 mr-2"/>자주 묻는 질문</Link></Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BookingDetailPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-navy-600"/>
            </div>
        }>
            <BookingDetailComponent />
        </Suspense>
    )
}