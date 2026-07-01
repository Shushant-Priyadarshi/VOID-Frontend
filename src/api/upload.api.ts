
const BASE_URL = import.meta.env.VITE_API_URL

interface ApiEnvelope<T> {
  statusCode: number
  data: T
  message: string
  success: boolean
}

async function uploadRequest<T>(path: string, formData: FormData): Promise<ApiEnvelope<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    credentials: "include",
    body: formData, // don't set Content-Type — browser sets multipart boundary automatically
  })

  const json = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(json?.message ?? "Upload failed")
  }

  return json
}

export const uploadApi = {
  uploadPostImages: (files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => formData.append("images", file))
    return uploadRequest<{ urls: string[] }>("/api/v1/uploads/post-images", formData)
  },

  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append("image", file)
    return uploadRequest<{ url: string }>("/api/v1/uploads/avatar", formData)
  },
}