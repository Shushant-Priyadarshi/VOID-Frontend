export type UserRole = "USER" | "MENTOR" | "ADMIN"

//User types
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

export interface SearchUser {
  id: string
  name: string
  profileImage: string | null
  role: "USER" | "MENTOR" | "ADMIN"
  college: string | null
  hospital: string | null
  bio: string | null
}

//Post types
export interface PostAuthor {
  id: string
  name: string
  profileImage: string | null
  image:string | null
}

export interface Post {
  id: string
  title: string
  content: string
  imageUrls: string[]
  isAnonymous: boolean
  createdAt: string
  author: PostAuthor | null
  anonymousLabel?: string
  likeCount: number
  commentCount: number
  likedByMe: boolean
}

export interface CreatePostPayload {
  title: string
  content: string
  isAnonymous: boolean
  imageUrls?: string[]
}

//Comment
export interface Comment {
  id: string
  content: string
  authorId: string
  parentId: string | null
  createdAt: string
  author: PostAuthor
  replies: Comment[]
}


//Profile
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

//Follow
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

//Categories
export type MentorCategory =
  | "CARDIOLOGY"
  | "NEUROLOGY"
  | "ONCOLOGY"
  | "PEDIATRICS"
  | "ORTHOPEDICS"
  | "DERMATOLOGY"
  | "PSYCHIATRY"
  | "GENERAL_MEDICINE"
  | "SURGERY"
  | "RADIOLOGY"
  | "CAREER_GUIDANCE"
  | "EXAM_PREPARATION"
  | "OTHER"

//Mentor
export interface MentorUser {
  id: string
  name: string
  profileImage: string | null
  bio: string | null
  college: string | null
  hospital: string | null
}

export interface MentorProfile {
  id: string
  userId: string
  category: MentorCategory
  specialization: string
  experienceYears: number
  organization: string | null
  consultationFee: number | null
  about: string | null
  bookingUrl: string | null
  user: MentorUser
}

export interface CreateMentorPayload {
  category: MentorCategory
  specialization: string
  experienceYears: number
  organization?: string
  consultationFee?: number
  about?: string
}



// WebSocket message shapes
export type WSMessage =
  | { type: "UNREAD_COUNT"; data: { count: number } }
  | { type: "NEW_NOTIFICATION"; data: { notification: AppNotification; unreadCount: number } }
  | { type: "NEW_MESSAGE"; data: { conversationId: string; message: Message } }
  | { type: "MESSAGE_DELIVERED"; data: { conversationId: string; messageId: string } }
  | { type: "MESSAGE_READ"; data: { conversationId: string } }
  | { type: "TYPING"; data: { conversationId: string; userId: string; isTyping: boolean } }
  | { type: "TOTAL_UNREAD_MESSAGES"; data: { count: number } }

//notifications 
export type NotificationType = "LIKE" | "COMMENT" | "FOLLOW"

export interface NotificationActor {
  id: string
  name: string
  profileImage: string | null
}

export interface AppNotification {
  id: string
  type: NotificationType
  read: boolean
  createdAt: string
  actor: NotificationActor
  post: { id: string; title: string } | null
  comment: { id: string; content: string } | null
}


// Message

export type MessageStatus = "SENT" | "DELIVERED" | "READ"

export interface MessageSender {
  id: string
  name: string
  profileImage: string | null
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  sender: MessageSender
  content: string
  status: MessageStatus
  createdAt: string
}

export interface ConversationParticipant {
  id: string
  name: string
  profileImage: string | null
  role: "USER" | "MENTOR" | "ADMIN"
}

export interface Conversation {
  id: string
  otherUser: ConversationParticipant
  lastMessagePreview: string | null
  lastMessageAt: string
  unreadCount: number
  lastMessage: Message | null
}
