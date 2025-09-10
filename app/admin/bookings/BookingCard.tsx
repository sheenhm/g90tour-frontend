import { adminBookingApi, Booking } from "@/lib/admin";
import { Badge, Check, Clock, CreditCard, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// API 상태 → UI 한글 표시
const apiToUiStatus: Record<Booking["status"], string> = {
    "QUOTE_REQUESTED": "견적요청",
    "PAYMENT_PENDING": "결제대기",
    "PAYMENT_COMPLETED": "결제완료",
    "CANCEL_PENDING": "취소요청",
    "CANCELLED": "취소완료",
    "TRAVEL_COMPLETED": "여행완료",
};

const BookingCard = ({ booking }: { booking: Booking }) => {
    const statusMap: Record<string, { color: string; icon: any }> = {
        QUOTE_REQUESTED: { color: "bg-blue-600", icon: Clock },
        PAYMENT_PENDING: { color: "bg-yellow-600", icon: CreditCard },
        PAYMENT_COMPLETED: { color: "bg-green-600", icon: Check },
        CANCEL_PENDING: { color: "bg-orange-600", icon: X },
        CANCELLED: { color: "bg-gray-600", icon: X },
        TRAVEL_COMPLETED: { color: "bg-purple-600", icon: Check },
    };

    const StatusIcon = statusMap[booking.status]?.icon || Clock;
    const statusColor = statusMap[booking.status]?.color || "bg-gray-600";

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{booking.id} - {booking.customerName}</CardTitle>
                        <CardDescription>{booking.productName}</CardDescription>
                    </div>
                    <Badge className={statusColor}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {apiToUiStatus[booking.status]} {/* 한글 표시 */}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <p>여행일: {booking.travelDate}</p>
                <p>인원: {booking.travelers}명</p>
                <p>금액: {booking.totalPrice.toLocaleString()}원</p>

                {/* 상태별 버튼 */}
                {booking.status === "QUOTE_REQUESTED" && (
                    <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => adminBookingApi.approve(booking.id)}
                    >
                        승인
                    </Button>
                )}
                {booking.status === "CANCEL_PENDING" && (
                    <Button
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={() => adminBookingApi.confirmCancellation(booking.id)}
                    >
                        취소 승인
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default BookingCard;