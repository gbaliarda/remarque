import { FormEvent } from "react"
import AuthForm from "../components/AuthForm"
import s from "../styles/Auth.module.scss"

export default function Login() {

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: api call
  }

  return (
    <div className={s.container}>
      <h1>Login</h1>
      <AuthForm actionText="Login" onSubmit={handleLogin} />
    </div>
  )

}