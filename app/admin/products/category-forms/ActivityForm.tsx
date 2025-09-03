import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent } from "@/components/ui/card"

// Activity 세부 정보 타입 정의
interface ActivityDetails {
    activityType?: string
    reservationDeadline?: string // yyyy-MM-dd 형태
    activities?: string[]
}

interface Props {
    data?: ActivityDetails
    onChange: (data: ActivityDetails) => void
}

export default function ActivityForm({ data, onChange }: Props) {
    const details = data || {}

    const handleChange = (field: keyof ActivityDetails, value: string | string[] | undefined) => {
        onChange({ ...details, [field]: value })
    }

    return (
        <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* 액티비티 타입 */}
                <div className="space-y-2">
                    <Label htmlFor="activityType">액티비티 타입</Label>
                    <Input
                        id="activityType"
                        placeholder="예: 수상 스포츠, 등산"
                        value={details.activityType || ""}
                        onChange={(e) => handleChange("activityType", e.target.value)}
                    />
                </div>

                {/* 예약 마감일 */}
                <div className="space-y-2">
                    <Label htmlFor="reservationDeadline">예약 마감일</Label>
                    <Input
                        id="reservationDeadline"
                        type="date"
                        value={details.reservationDeadline || ""}
                        onChange={(e) => handleChange("reservationDeadline", e.target.value)}
                    />
                </div>

                {/* 액티비티 목록 */}
                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="activities">액티비티 목록 (쉼표로 구분)</Label>
                    <Input
                        id="activities"
                        placeholder="예: 스쿠버다이빙, 패러글라이딩"
                        value={details.activities?.join(", ") || ""}
                        onChange={(e) =>
                            handleChange(
                                "activities",
                                e.target.value
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter(Boolean)
                            )
                        }
                    />
                </div>
            </div>
        </CardContent>
    )
}