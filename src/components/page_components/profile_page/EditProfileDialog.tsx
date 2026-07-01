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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil } from "lucide-react"
import { uploadApi } from "@/api/upload.api"
import type { UserProfile, UpdateProfileFn } from "@/types"

interface Props {
  profile: UserProfile
  onSave: UpdateProfileFn
}

export default function EditProfileDialog({ profile, onSave }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.profileImage)

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)

    try {
      let profileImage = profile.profileImage ?? undefined

      if (avatarFile) {
        const res = await uploadApi.uploadAvatar(avatarFile)
        profileImage = res.data.url
      }

      await onSave({
        name: form.get("name") as string,
        bio: form.get("bio") as string,
        college: form.get("college") as string,
        hospital: form.get("hospital") as string,
        profileImage,
      })
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Pencil className="h-3.5 w-3.5" />
          Edit profile
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarPreview ?? undefined} />
              <AvatarFallback className="text-xl">{profile.name[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <Label htmlFor="avatar" className="cursor-pointer text-xs font-medium text-primary">
              Change photo
            </Label>
            <input id="avatar" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" defaultValue={profile.name} required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={profile.bio ?? ""}
              rows={3}
              placeholder="Tell others a bit about yourself"
              className="resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="college">College</Label>
            <Input id="college" name="college" defaultValue={profile.college ?? ""} placeholder="e.g. AIIMS Delhi" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="hospital">Hospital / Workplace</Label>
            <Input id="hospital" name="hospital" defaultValue={profile.hospital ?? ""} placeholder="e.g. Fortis Hospital" />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}