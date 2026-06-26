export function truncateWords(text: string, maxWords: number): { text: string; isTruncated: boolean } {
  const words = text.trim().split(/\s+/)
  if (words.length <= maxWords) {
    return { text, isTruncated: false }
  }
  return { text: words.slice(0, maxWords).join(" ") + "...", isTruncated: true }
}