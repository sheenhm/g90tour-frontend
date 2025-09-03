import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent } from "@/components/ui/card"

// Spa 세부 정보 타입 정의
interface SpaDetails {
    treatmentType?: string
    durationMinutes?: number
    treatmentOptions?: string[]
    facilities?: string[]
}

interface Props {
    data: { spaDetails?: SpaDetails }
    onChange: (data: { spaDetails: SpaDetails }) => void
}

export default function SpaForm({ data, onChange }: Props) {
    const details = data.spaDetails || {}

    // 필드 변경 핸들러
    const handleChange = (
        field: keyof SpaDetails,
        value: string | number | string[] | undefined
    ) => {
        onChange({ spaDetails: { ...details, [field]: value } })
    }

    return (
        <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* 테라피 타입 */}
                <div className="space-y-2">
                    <Label htmlFor="treatmentType">테라피 타입</Label>
                    <Input
                        id="treatmentType"
                        placeholder="예: 아로마, 스톤 마사지"
                        value={details.treatmentType || ""}
                        onChange={(e) => handleChange("treatmentType", e.target.value)}
                    />
                </div>

                {/* 시간(분) */}
                <div className="space-y-2">
                    <Label htmlFor="durationMinutes">시간 (분)</Label>
                    <Input
                        id="durationMinutes"
                        type="number"
                        min={10}
                        step={5}
                        placeholder="예: 60"
                        value={details.durationMinutes || ""}
                        onChange={(e) =>
                            handleChange(
                                "durationMinutes",
                                e.target.value === "" ? undefined : +e.target.value
                            )
                        }
                    />
                </div>

                {/* 옵션 */}
                <div className="space-y-2">
                    <Label htmlFor="treatmentOptions">옵션 (쉼표로 구분)</Label>
                    <Input
                        id="treatmentOptions"
                        placeholder="예: 핫스톤, 아로마 오일"
                        value={details.treatmentOptions?.join(", ") || ""}
                        onChange={(e) =>
                            handleChange(
                                "treatmentOptions",
                                e.target.value
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter(Boolean)
                            )
                        }
                    />
                </div>

                {/* 시설 */}
                <div className="space-y-2">
                    <Label htmlFor="facilities">시설 (쉼표로 구분)</Label>
                    <Input
                        id="facilities"
                        placeholder="예: 사우나, 자쿠지, 휴게실"
                        value={details.facilities?.join(", ") || ""}
                        onChange={(e) =>
                            handleChange(
                                "facilities",
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