import { Badge } from "@/components/ui/badge"
import { CATEGORY_LABELS } from "@/lib/mentorCategories"
import type { MentorCategory } from "@/types"

interface Props {
  selected: MentorCategory | null
  onSelect: (category: MentorCategory | null) => void
}

export default function CategoryFilter({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <Badge
        variant={selected === null ? "default" : "outline"}
        className="shrink-0 cursor-pointer"
        onClick={() => onSelect(null)}
      >
        All
      </Badge>
      {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
        <Badge
          key={value}
          variant={selected === value ? "default" : "outline"}
          className="shrink-0 cursor-pointer"
          onClick={() => onSelect(value as MentorCategory)}
        >
          {label}
        </Badge>
      ))}
    </div>
  )
}