import { FormEvent, useRef } from "react"
import { signIn } from "next-auth/react"
import s from "../styles/Auth.module.scss"
import { registerUser } from '../services/auth'

export default function Register() {
  const emailRef = useRef<HTMLInputElement>(null) 
  const passwordRef = useRef<HTMLInputElement>(null) 

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = emailRef.current!!.value
    const password = passwordRef.current!!.value
    try {
      await registerUser(email, password)
      // sign in automatically and redirect to home page
      signIn("credentials", { email, password, callbackUrl: "/" })
    } catch(e) {
      console.log(e)
    }
  }

  return (
    <div className={s.container}>
      <h1>Register</h1>
      <form className={s.form} onSubmit={handleRegister}>
        <input ref={emailRef} required placeholder="Email..." type="email" />
        <input ref={passwordRef} required placeholder="Password..." type="password" />
        <button type="submit">Register</button>
      </form>
    </div>
  )

}