export const isValidContent = (content: any[]) => {
  if (Array.isArray(content)) {
    return content.every((item: any) => typeof item === 'string')
  }
  return false
}