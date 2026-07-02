import { api } from "@/lib/api";
import type { Post, Comment, CreatePostPayload } from "@/types";

interface ApiEnvelope<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export const postApi = {
  createPost: (payload: CreatePostPayload) =>
    api.post<ApiEnvelope<Post>>("/api/v1/posts", payload),

  getFeed: (cursor?: string, limit = 10) => {
    const params = new URLSearchParams();
    if (cursor) params.set("cursor", cursor);
    params.set("limit", String(limit));
    return api.get<ApiEnvelope<Post[]>>(
      `/api/v1/posts/feed?${params.toString()}`
    );
  },

  getPostById: (id: string) =>
    api.get<ApiEnvelope<{ post: Post; comments: Comment[] }>>(
      `/api/v1/posts/${id}`
    ),

  searchPosts: (query: string, filter: "latest" | "top" = "latest") =>
    api.get<ApiEnvelope<Post[]>>(
      `/api/v1/posts/search?q=${encodeURIComponent(query)}&filter=${filter}`
    ),

  toggleLike: (id: string) =>
    api.post<ApiEnvelope<{ liked: boolean }>>(`/api/v1/posts/${id}/like`),

  deletePost: (id: string) =>
    api.delete<ApiEnvelope<null>>(`/api/v1/posts/${id}`),

  addComment: (postId: string, content: string, parentId?: string) =>
    api.post<ApiEnvelope<Comment>>(`/api/v1/posts/${postId}/comments`, {
      content,
      parentId,
    }),

  deleteComment: (commentId: string) =>
    api.delete<ApiEnvelope<null>>(`/api/v1/posts/comments/${commentId}`),

  getMyPosts: () => api.get<ApiEnvelope<Post[]>>("/api/v1/posts/mine/created"),

  getMyLikedPosts: () =>
    api.get<ApiEnvelope<Post[]>>("/api/v1/posts/mine/liked"),

  getMyCommentedPosts: () =>
    api.get<ApiEnvelope<Post[]>>("/api/v1/posts/mine/commented"),

  getPostsByUser: (userId: string) =>
    api.get<ApiEnvelope<Post[]>>(`/api/v1/posts/by-user/${userId}`),
};
