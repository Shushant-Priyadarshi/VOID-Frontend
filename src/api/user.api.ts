import { api } from "@/lib/api"
import type { UserProfile, UpdateProfilePayload } from "@/types"

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
}