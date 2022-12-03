import { postJsonApi } from "./setup"
import { Note } from "./types"

export const createNote = () => {
  return postJsonApi<Note>("/api/notes", {})
}