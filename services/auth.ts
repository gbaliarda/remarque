import { postJsonApi } from "./setup"

export const registerUser = (email: string, password: string) => {
  return postJsonApi("/api/users", { email, password })
}