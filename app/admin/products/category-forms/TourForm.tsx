import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"

// Tour 세부 정보 타입 정의
interface TourDetails {
    tourType?: string
    departurePlace?: string
    durationDays?: number
    majorCities?: string[]
    majorSpots?: string[]
}

interface Props {
    data?: TourDetails
    onChange: (data: TourDetails) => void
}

export default function TourForm({ data, onChange }: Props) {
    const details = data || {}

    const handleChange = (
        field: keyof TourDetails,
        value: string | number | string[] | undefined
    ) => {
        onChange({ ...details, [field]: value })
    }

    return (
        <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* 투어 타입 */}
                <div className="space-y-2">
                    <Label htmlFor="tourType">투어 타입</Label>
                    <Input
                        id="tourType"
                        value={details.tourType || ""}
                        onChange={(e) => handleChange("tourType", e.target.value)}
                    />
                </div>

                {/* 출발 장소 */}
                <div className="space-y-2">
                    <Label htmlFor="departurePlace">출발 장소</Label>
                    <Input
                        id="departurePlace"
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
                    <Label>주요 도시</Label>
                    {(details.majorCities?.length ? details.majorCities : [""]).map((item, index) => (
                        <div key={index} className="flex gap-2">
                            <Input
                                value={item}
                                onChange={(e) => {
                                    const newCities = [...(details.majorCities || [""])]
                                    newCities[index] = e.target.value
                                    handleChange("majorCities", newCities)
                                }}
                            />
                            <Button type="button" size="icon" variant="outline" onClick={() => {
                                const newCities = (details.majorCities || []).filter((_, i) => i !== index)
                                handleChange("majorCities", newCities)
                            }}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" size="sm" variant="outline" onClick={() => {
                        handleChange("majorCities", [...(details.majorCities || []), ""])
                    }}>
                        <Plus className="w-4 h-4 mr-1" /> 항목 추가
                    </Button>
                </div>

                {/* 주요 명소 */}
                <div className="md:col-span-2 space-y-2">
                    <Label>주요 명소</Label>
                    {(details.majorSpots?.length ? details.majorSpots : [""]).map((item, index) => (
                        <div key={index} className="flex gap-2">
                            <Input
                                value={item}
                                onChange={(e) => {
                                    const newSpots = [...(details.majorSpots || [""])]
                                    newSpots[index] = e.target.value
                                    handleChange("majorSpots", newSpots)
                                }}
                            />
                            <Button type="button" size="icon" variant="outline" onClick={() => {
                                const newSpots = (details.majorSpots || []).filter((_, i) => i !== index)
                                handleChange("majorSpots", newSpots)
                            }}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" size="sm" variant="outline" onClick={() => {
                        handleChange("majorSpots", [...(details.majorSpots || []), ""])
                    }}>
                        <Plus className="w-4 h-4 mr-1" /> 항목 추가
                    </Button>
                </div>
            </div>
        </CardContent>
    )
}