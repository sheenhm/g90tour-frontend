import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"

interface GolfDetails {
    golfClubName?: string[]
    round?: number
    difficulty?: string
}

interface Props {
    data?: GolfDetails
    onChange: (data: GolfDetails) => void
}

export default function GolfForm({ data, onChange }: Props) {
    const details = data || {}

    const handleChange = (field: keyof GolfDetails, value: string | number | string[] | undefined) => {
        onChange({ ...details, [field]: value })
    }

    return (
        <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* 골프장 이름 */}
                <div className="md:col-span-2 space-y-2">
                    <Label>골프장 이름</Label>
                    <div className="space-y-2">
                        {(details.golfClubName && details.golfClubName.length > 0 ? details.golfClubName : [""]).map((club, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    value={club}
                                    onChange={(e) => {
                                        const newClubs = [...(details.golfClubName || [""])]
                                        newClubs[index] = e.target.value
                                        handleChange("golfClubName", newClubs)
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                        const newClubs = (details.golfClubName || []).filter((_, i) => i !== index)
                                        handleChange("golfClubName", newClubs)
                                    }}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleChange("golfClubName", [...(details.golfClubName || []), ""])}
                        >
                            <Plus className="w-4 h-4 mr-1" /> 항목 추가
                        </Button>
                    </div>
                </div>

                {/* 라운드 수 */}
                <div className="space-y-2">
                    <Label htmlFor="round">라운드 수</Label>
                    <Input
                        id="round"
                        type="number"
                        min={1}
                        placeholder="예: 2"
                        value={details.round ?? ""}
                        onChange={(e) =>
                            handleChange(
                                "round",
                                e.target.value === "" ? undefined : +e.target.value
                            )
                        }
                    />
                </div>

                {/* 난이도 */}
                <div className="space-y-2">
                    <Label htmlFor="difficulty">난이도</Label>
                    <Input
                        id="difficulty"
                        placeholder="예: 쉬움, 보통, 어려움"
                        value={details.difficulty || ""}
                        onChange={(e) => handleChange("difficulty", e.target.value)}
                    />
                </div>
            </div>
        </CardContent>
    )
}