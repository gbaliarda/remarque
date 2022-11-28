import { FormEvent } from "react"
import AuthForm from "../components/AuthForm"
import s from "../styles/Auth.module.scss"

export default function Register() {

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: api call
  }

  return (
    <div className={s.container}>
      <h1>Register</h1>
      <AuthForm actionText="Register" onSubmit={handleRegister} />
    </div>
  )

}