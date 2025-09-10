import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Booking, adminBookingApi } from "@/lib/admin"

export const BookingCard = ({ booking, onRefresh }: { booking: Booking; onRefresh?: () => void }) => {

    const handleApprove = async () => {
        await adminBookingApi.approve(booking.bookingId)
        onRefresh?.()
    }

    const handleCancelApprove = async () => {
        await adminBookingApi.confirmCancellation(booking.bookingId)
        onRefresh?.()
    }

    return (
        <Card className="shadow-md hover:shadow-lg transition-shadow border border-gray-200">
            <CardHeader>
                <div>
                    <CardTitle className="text-sm font-semibold text-gray-700">
                        예약 #{booking.bookingId} - {booking.customerName}
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500">{booking.productName}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm text-gray-600">
                <div className="flex justify-between">
                    <span>여행일</span>
                    <span>{booking.travelDate}</span>
                </div>
                <div className="flex justify-between">
                    <span>인원</span>
                    <span>{booking.counts}명</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-800">
                    <span>금액</span>
                    <span>{booking.totalPrice.toLocaleString()}원</span>
                </div>

                <div className="flex gap-2 mt-2">
                    {booking.status === "QUOTE_REQUESTED" && (
                        <Button size="sm" variant="default" className="bg-blue-600 hover:bg-blue-700" onClick={handleApprove}>
                            승인
                        </Button>
                    )}
                    {booking.status === "CANCEL_PENDING" && (
                        <Button size="sm" variant="default" className="bg-orange-600 hover:bg-orange-700" onClick={handleCancelApprove}>
                            취소 승인
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}