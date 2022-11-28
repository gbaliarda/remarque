import { FormEvent } from "react"
import s from "./AuthForm.module.scss"

interface Props {
  actionText: string
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<any>
}

export default function AuthForm({ onSubmit, actionText }: Props) {

  return (
    <form className={s.form} onSubmit={onSubmit}>
      <input required placeholder="Email..." type="email" />
      <input required placeholder="Password..." type="password" />
      <button type="submit">{actionText}</button>
    </form>
  )

}