import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

interface HotelDetails {
    capacity?: number
    roomType?: string
}

interface Props {
    data: HotelDetails
    onChange: (data: HotelDetails) => void
}

export default function HotelForm({ data, onChange }: Props) {
    // 필드 변경을 처리하는 핸들러
    const handleChange = (field: keyof HotelDetails, value: string | number | undefined) => {
        onChange({ ...data, [field]: value })
    }

    return (
        <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 수용 인원 필드 */}
                <div className="space-y-2">
                    <Label htmlFor="capacity">수용 인원</Label>
                    <Input
                        id="capacity"
                        type="number"
                        placeholder="예: 2"
                        value={data.capacity || ""}
                        onChange={(e) => handleChange("capacity", e.target.value === '' ? undefined : +e.target.value)}
                    />
                </div>

                {/* 룸 타입 필드 */}
                <div className="space-y-2">
                    <Label htmlFor="roomType">룸 타입</Label>
                    <Input
                        id="roomType"
                        placeholder="예: 디럭스 더블"
                        value={data.roomType || ""}
                        onChange={(e) => handleChange("roomType", e.target.value)}
                    />
                </div>
            </div>
        </CardContent>
    )
}