export type UserRole = "USER" | "MENTOR" | "ADMIN"

export interface UserProfile {
  id: string
  name: string
  email: string
  bio: string | null
  profileImage: string | null
  role: "USER" | "MENTOR" | "ADMIN"
  emailVerified: boolean
  createdAt: string
}

export interface UpdateProfilePayload {
  name?: string
  bio?: string
  profileImage?: string
}

export interface Post {
  id: string
  content: string
  isAnonymous: boolean
  createdAt: string
  author: {
    id: string
    name: string
    profileImage: string | null
  } | null              // null when anonymous
  anonymousLabel?: string  // e.g. "Medical Student, AIIMS Delhi"
  likeCount: number
  commentCount: number
  likedByMe: boolean
}