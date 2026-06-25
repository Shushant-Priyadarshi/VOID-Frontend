import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Stethoscope } from "lucide-react"
import { mentorApi } from "@/api/mentor.api"
import { CATEGORY_LABELS } from "@/lib/mentorCategories"
import type { MentorCategory, MentorProfile } from "@/types"

interface Props {
  onCreated: (profile: MentorProfile) => void
}

export default function BecomeMentorDialog({ onCreated }: Props) {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState<MentorCategory | "">("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!category) {
      setError("Please select a category")
      return
    }

    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)

    try {
      const res = await mentorApi.becomeMentor({
        category,
        specialization: form.get("specialization") as string,
        experienceYears: Number(form.get("experienceYears")),
        organization: (form.get("organization") as string) || undefined,
        consultationFee: form.get("consultationFee") ? Number(form.get("consultationFee")) : undefined,
        about: (form.get("about") as string) || undefined,
      })
      onCreated(res.data)
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create mentor profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Stethoscope className="h-3.5 w-3.5" />
          Become a Mentor
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create your mentor profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as MentorCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Input
              id="specialization"
              name="specialization"
              placeholder="e.g. Pediatric Cardiac Surgery"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="experienceYears">Years of experience</Label>
            <Input id="experienceYears" name="experienceYears" type="number" min="0" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="organization">Organization (optional)</Label>
            <Input id="organization" name="organization" placeholder="e.g. AIIMS Delhi" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="consultationFee">Consultation fee in ₹ (optional)</Label>
            <Input id="consultationFee" name="consultationFee" type="number" min="0" placeholder="0 for free" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="about">About your mentorship (optional)</Label>
            <Textarea
              id="about"
              name="about"
              rows={3}
              placeholder="What can mentees expect from a session with you?"
              className="resize-none"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create mentor profile"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}