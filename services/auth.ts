import useSWR from 'swr'
import { User } from './types'
import { postJsonApi, apiFetcher } from './setup';

export const registerUser = (email: string, password: string) => {
  return postJsonApi("/api/users", { email, password })
}

export const useUser = (email: string | undefined | null) => {
  return useSWR<User>(email ? `/api/users?email=${email}` : null, apiFetcher)
}
