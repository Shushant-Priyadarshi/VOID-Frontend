import { api } from "@/lib/api"
import type { UserProfile, UpdateProfilePayload, PublicUserProfile } from "@/types"

interface ApiEnvelope<T> {
  statusCode: number
  data: T
  message: string
  success: boolean
}

export const userApi = {
  getProfile: () => {
    return api.get<ApiEnvelope<UserProfile>>("/api/v1/users/me")
  },

  updateProfile: (payload: UpdateProfilePayload) => {
    return api.patch<ApiEnvelope<UserProfile>>("/api/v1/users/update-user-profile", payload)
  },

  getPublicProfile: (userId: string) =>
  api.get<ApiEnvelope<PublicUserProfile>>(`/api/v1/users/${userId}/public`),
}