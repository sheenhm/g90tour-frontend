import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"

// Spa 세부 정보 타입 정의
interface SpaDetails {
    treatmentType?: string
    durationMinutes?: number
    treatmentOptions?: string[]
    facilities?: string[]
}

interface Props {
    data?: SpaDetails
    onChange: (data: SpaDetails) => void
}

export default function SpaForm({ data, onChange }: Props) {
    const details = data || {}

    const handleChange = (
        field: keyof SpaDetails,
        value: string | number | string[] | undefined
    ) => {
        onChange({ ...details, [field]: value })
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
                <div className="md:col-span-1 space-y-2">
                    <Label>옵션</Label>
                    {(details.treatmentOptions?.length ? details.treatmentOptions : [""]).map((item, index) => (
                        <div key={index} className="flex gap-2">
                            <Input
                                value={item}
                                onChange={(e) => {
                                    const newOptions = [...(details.treatmentOptions || [""])]
                                    newOptions[index] = e.target.value
                                    handleChange("treatmentOptions", newOptions)
                                }}
                            />
                            <Button type="button" size="icon" variant="outline" onClick={() => {
                                const newOptions = (details.treatmentOptions || []).filter((_, i) => i !== index)
                                handleChange("treatmentOptions", newOptions)
                            }}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" size="sm" variant="outline" onClick={() => {
                        handleChange("treatmentOptions", [...(details.treatmentOptions || []), ""])
                    }}>
                        <Plus className="w-4 h-4 mr-1" /> 항목 추가
                    </Button>
                </div>

                {/* 시설 */}
                <div className="md:col-span-1 space-y-2">
                    <Label>시설</Label>
                    {(details.facilities?.length ? details.facilities : [""]).map((item, index) => (
                        <div key={index} className="flex gap-2">
                            <Input
                                value={item}
                                onChange={(e) => {
                                    const newFacilities = [...(details.facilities || [""])]
                                    newFacilities[index] = e.target.value
                                    handleChange("facilities", newFacilities)
                                }}
                            />
                            <Button type="button" size="icon" variant="outline" onClick={() => {
                                const newFacilities = (details.facilities || []).filter((_, i) => i !== index)
                                handleChange("facilities", newFacilities)
                            }}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" size="sm" variant="outline" onClick={() => {
                        handleChange("facilities", [...(details.facilities || []), ""])
                    }}>
                        <Plus className="w-4 h-4 mr-1" /> 항목 추가
                    </Button>
                </div>
            </div>
        </CardContent>
    )
}