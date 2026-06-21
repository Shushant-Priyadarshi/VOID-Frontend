import { api } from "@/lib/api"
import type { FollowCounts, FollowUser } from "@/types"

interface ApiEnvelope<T> {
  statusCode: number
  data: T
  message: string
  success: boolean
}

export const followApi = {
  follow: (userId: string) =>
    api.post<ApiEnvelope<{ following: boolean }>>(`/api/v1/users/${userId}/follow`),

  unfollow: (userId: string) =>
    api.delete<ApiEnvelope<{ following: boolean }>>(`/api/v1/users/${userId}/follow`),

  getCounts: (userId: string) =>
    api.get<ApiEnvelope<FollowCounts>>(`/api/v1/users/${userId}/follow-counts`),

  getFollowers: (userId: string) =>
    api.get<ApiEnvelope<FollowUser[]>>(`/api/v1/users/${userId}/followers`),

  getFollowing: (userId: string) =>
    api.get<ApiEnvelope<FollowUser[]>>(`/api/v1/users/${userId}/following`),
}