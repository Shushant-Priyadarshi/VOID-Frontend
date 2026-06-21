export type UserRole = "USER" | "MENTOR" | "ADMIN"

export interface UserProfile {
  id: string
  name: string
  email: string
  bio: string | null
  profileImage: string | null
  role: "USER" | "MENTOR" | "ADMIN"
  college: string | null
  hospital: string | null
  emailVerified: boolean
  createdAt: string
}

export interface UpdateProfilePayload {
  name?: string
  bio?: string
  profileImage?: string
  college?: string
  hospital?: string
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

export interface PostAuthor {
  id: string
  name: string
  profileImage: string | null
}

export interface Post {
  id: string
  content: string
  imageUrl?: string | null
  isAnonymous: boolean
  createdAt: string
  author: PostAuthor | null
  anonymousLabel?: string
  likeCount: number
  commentCount: number
  likedByMe: boolean
}

export interface Comment {
  id: string
  content: string
  authorId: string
  parentId: string | null
  createdAt: string
  author: PostAuthor
  replies: Comment[]
}

export interface CreatePostPayload {
  content: string
  isAnonymous: boolean
  imageUrl?: string
}

export type UpdateProfileFn = (payload: UpdateProfilePayload) => Promise<UserProfile>

export interface PublicUserProfile {
  id: string
  name: string
  bio: string | null
  profileImage: string | null
  role: "USER" | "MENTOR" | "ADMIN"
  college: string | null
  hospital: string | null
  createdAt: string
}

export interface FollowCounts {
  followers: number
  following: number
  isFollowing: boolean
}

export interface FollowUser {
  id: string
  name: string
  profileImage: string | null
  role: "USER" | "MENTOR" | "ADMIN"
  college: string | null
  hospital: string | null
  isFollowedByMe: boolean
}