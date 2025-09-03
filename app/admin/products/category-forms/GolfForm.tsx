import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent } from "@/components/ui/card"

// Golf 세부 정보 타입 정의
interface GolfDetails {
    golfClubName?: string[]
    round?: number
    difficulty?: string
}

interface Props {
    data: { golfDetails?: GolfDetails }
    onChange: (data: { golfDetails: GolfDetails }) => void
}

export default function GolfForm({ data, onChange }: Props) {
    const details = data.golfDetails || {}

    // 필드 변경 핸들러
    const handleChange = (
        field: keyof GolfDetails,
        value: string | number | string[] | undefined
    ) => {
        onChange({ golfDetails: { ...details, [field]: value } })
    }

    return (
        <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* 골프장 이름 */}
                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="golfClubName">골프장 이름 (쉼표로 구분)</Label>
                    <Input
                        id="golfClubName"
                        placeholder="예: 스카이힐, 블랙스톤"
                        value={details.golfClubName?.join(", ") || ""}
                        onChange={(e) =>
                            handleChange(
                                "golfClubName",
                                e.target.value
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter(Boolean)
                            )
                        }
                    />
                </div>

                {/* 라운드 수 */}
                <div className="space-y-2">
                    <Label htmlFor="round">라운드 수</Label>
                    <Input
                        id="round"
                        type="number"
                        min={1}
                        placeholder="예: 2"
                        value={details.round || ""}
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
