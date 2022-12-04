import { postJsonApi, patchJsonApi, apiFetcher } from './setup';
import { Note, IndexedNote } from './types';

export const createNote = () => {
  return postJsonApi<Note>("/api/notes", {})
}

export const updateNote = (id: string, note: Partial<Note>) => {
  return patchJsonApi<Note>(`/api/notes/${id}`, note)
}

export const deleteNote = (id: string) => {
  return apiFetcher(`/api/notes/${id}`, { method: "DELETE" })
}

export const shareNote = (id: string, share: boolean) => {
  return patchJsonApi<Note>(`/api/notes/${id}`, { isPublic: share })
}

export const duplicateNote = (id: string) => {
  return postJsonApi<Note>(`/api/notes/${id}`, {})
}

export const searchPhraseInNotes = (userId: string, phrase: string) => {
  return apiFetcher<IndexedNote[]>(`/api/users/${userId}/notes?phrase=${phrase}`)
}
