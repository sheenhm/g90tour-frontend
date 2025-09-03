import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent } from "@/components/ui/card"

// Tour 세부 정보 타입 정의
interface TourDetails {
    tourType?: string
    departurePlace?: string
    durationDays?: number
    majorCities?: string[]
    majorSpots?: string[]
}

interface Props {
    data: { tourDetails?: TourDetails }
    onChange: (data: { tourDetails: TourDetails }) => void
}

export default function TourForm({ data, onChange }: Props) {
    const details = data.tourDetails || {}

    // 필드 변경 핸들러
    const handleChange = (
        field: keyof TourDetails,
        value: string | number | string[] | undefined
    ) => {
        onChange({ tourDetails: { ...details, [field]: value } })
    }

    return (
        <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* 투어 타입 */}
                <div className="space-y-2">
                    <Label htmlFor="tourType">투어 타입</Label>
                    <Input
                        id="tourType"
                        placeholder="예: 자유 여행, 패키지"
                        value={details.tourType || ""}
                        onChange={(e) => handleChange("tourType", e.target.value)}
                    />
                </div>

                {/* 출발 장소 */}
                <div className="space-y-2">
                    <Label htmlFor="departurePlace">출발 장소</Label>
                    <Input
                        id="departurePlace"
                        placeholder="예: 인천 국제공항"
                        value={details.departurePlace || ""}
                        onChange={(e) => handleChange("departurePlace", e.target.value)}
                    />
                </div>

                {/* 여행 기간 */}
                <div className="space-y-2">
                    <Label htmlFor="durationDays">여행 기간 (일)</Label>
                    <Input
                        id="durationDays"
                        type="number"
                        min={1}
                        placeholder="예: 7"
                        value={details.durationDays || ""}
                        onChange={(e) =>
                            handleChange(
                                "durationDays",
                                e.target.value === "" ? undefined : +e.target.value
                            )
                        }
                    />
                </div>

                {/* 주요 도시 */}
                <div className="space-y-2">
                    <Label htmlFor="majorCities">주요 도시 (쉼표로 구분)</Label>
                    <Input
                        id="majorCities"
                        placeholder="예: 파리, 로마, 바르셀로나"
                        value={details.majorCities?.join(", ") || ""}
                        onChange={(e) =>
                            handleChange(
                                "majorCities",
                                e.target.value
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter(Boolean)
                            )
                        }
                    />
                </div>

                {/* 주요 명소 */}
                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="majorSpots">주요 명소 (쉼표로 구분)</Label>
                    <Input
                        id="majorSpots"
                        placeholder="예: 에펠탑, 콜로세움"
                        value={details.majorSpots?.join(", ") || ""}
                        onChange={(e) =>
                            handleChange(
                                "majorSpots",
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