import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { CardContent } from "@/components/ui/card"

// Vehicle 세부 정보 타입을 정의하여 안정성 확보
interface VehicleDetails {
    vehicleType?: string
    carName?: string
    passengerCapacity?: number
    gasType?: string
    isDriverIncluded?: boolean
}

interface Props {
    data: VehicleDetails
    onChange: (data: VehicleDetails) => void
}

export default function VehicleForm({ data, onChange }: Props) {
    // 필드 변경을 처리하는 핸들러
    const handleChange = (field: keyof VehicleDetails, value: string | number | boolean | undefined) => {
        onChange({ ...data, [field]: value })
    }

    return (
        <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* 차량 종류 */}
                <div className="space-y-2">
                    <Label htmlFor="vehicleType">차량 종류</Label>
                    <Input
                        id="vehicleType"
                        placeholder="예: SUV, 세단"
                        value={data.vehicleType || ""}
                        onChange={(e) => handleChange("vehicleType", e.target.value)}
                    />
                </div>

                {/* 차량 이름 */}
                <div className="space-y-2">
                    <Label htmlFor="carName">차량 이름</Label>
                    <Input
                        id="carName"
                        placeholder="예: 현대 팰리세이드"
                        value={data.carName || ""}
                        onChange={(e) => handleChange("carName", e.target.value)}
                    />
                </div>

                {/* 승객 수 */}
                <div className="space-y-2">
                    <Label htmlFor="passengerCapacity">승객 수</Label>
                    <Input
                        id="passengerCapacity"
                        type="number"
                        placeholder="예: 4"
                        value={data.passengerCapacity || ""}
                        onChange={(e) => handleChange("passengerCapacity", e.target.value === '' ? undefined : +e.target.value)}
                    />
                </div>

                {/* 연료 종류 */}
                <div className="space-y-2">
                    <Label htmlFor="gasType">연료 종류</Label>
                    <Input
                        id="gasType"
                        placeholder="예: 휘발유, 경유"
                        value={data.gasType || ""}
                        onChange={(e) => handleChange("gasType", e.target.value)}
                    />
                </div>

                {/* 운전기사 포함 여부 */}
                <div className="md:col-span-2 flex items-center space-x-2 pt-2">
                    <Checkbox
                        id="isDriverIncluded"
                        checked={data.isDriverIncluded || false}
                        onCheckedChange={(checked) => handleChange("isDriverIncluded", !!checked)}
                    />
                    <Label htmlFor="isDriverIncluded" className="font-medium cursor-pointer">
                        운전기사 포함
                    </Label>
                </div>
            </div>
        </CardContent>
    )
}