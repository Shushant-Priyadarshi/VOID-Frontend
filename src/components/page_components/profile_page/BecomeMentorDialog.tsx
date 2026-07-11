import { useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
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
    if (!category) { setError("Please select a category"); return }

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
        <Button variant="outline" size="sm" className="gap-1.5 text-xs border-border/60">
          <Stethoscope className="h-3.5 w-3.5" />
          Become a Mentor
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Create your mentor profile</DialogTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Help others in the medical community by sharing your knowledge and experience.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Specialty area</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as MentorCategory)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select a specialty" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="specialization" className="text-sm font-medium">Specialization</Label>
            <Input id="specialization" name="specialization" placeholder="e.g. Pediatric Cardiac Surgery" required className="h-10" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="experienceYears" className="text-sm font-medium">Years of experience</Label>
              <Input id="experienceYears" name="experienceYears" type="number" min="0" required className="h-10" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="consultationFee" className="text-sm font-medium">Fee in ₹ <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Input id="consultationFee" name="consultationFee" type="number" min="0" placeholder="0 for free" className="h-10" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="organization" className="text-sm font-medium">Organization <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Input id="organization" name="organization" placeholder="e.g. AIIMS Delhi" className="h-10" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="about" className="text-sm font-medium">About your mentorship <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Textarea
              id="about"
              name="about"
              rows={3}
              placeholder="What can mentees expect from a session with you?"
              className="resize-none text-sm"
            />
          </div>

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <DialogFooter className="mt-1">
            <Button type="submit" disabled={loading} className="w-full bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500">
              {loading ? "Creating profile…" : "Create mentor profile"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}