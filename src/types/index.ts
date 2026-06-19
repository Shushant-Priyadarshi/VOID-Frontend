export type UserRole = "USER" | "MENTOR" | "ADMIN"

export interface UserProfile {
  id: string
  name: string
  email: string
  bio: string | null
  profileImage: string | null
  role: UserRole
  college?: string | null
  hospital?: string | null
  emailVerified: boolean
  createdAt: string
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