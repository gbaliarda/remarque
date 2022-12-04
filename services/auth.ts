import useSWR from 'swr'
import { User } from './types'
import { postJsonApi, apiFetcher } from './setup';

export const registerUser = (email: string, password: string) => {
  return postJsonApi("/api/users", { email, password })
}

export const useUserId = (email: string | undefined | null) => {
  const { data } = useSWR<{ _id: string }>(email ? `/api/users?email=${email}` : null, apiFetcher)
  return { id: data?._id }
}
