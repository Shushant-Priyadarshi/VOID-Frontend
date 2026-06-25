import { api } from "@/lib/api"
import type { MentorProfile, MentorCategory, CreateMentorPayload } from "@/types"

interface ApiEnvelope<T> {
  statusCode: number
  data: T
  message: string
  success: boolean
}

export const mentorApi = {
  listMentors: (category?: MentorCategory, search?: string) => {
    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (search) params.set("search", search)
    return api.get<ApiEnvelope<MentorProfile[]>>(`/api/v1/mentors?${params.toString()}`)
  },

  getCategories: () =>
    api.get<ApiEnvelope<MentorCategory[]>>("/api/v1/mentors/categories"),

  getMentorByUserId: (userId: string) =>
    api.get<ApiEnvelope<MentorProfile>>(`/api/v1/mentors/user/${userId}`),

  getMyMentorProfile: () =>
    api.get<ApiEnvelope<MentorProfile | null>>("/api/v1/mentors/me"),

  becomeMentor: (payload: CreateMentorPayload) =>
    api.post<ApiEnvelope<MentorProfile>>("/api/v1/mentors", payload),

  updateMentorProfile: (payload: Partial<CreateMentorPayload> & { bookingUrl?: string }) =>
    api.patch<ApiEnvelope<MentorProfile>>("/api/v1/mentors", payload),
}