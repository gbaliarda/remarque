import Link from 'next/link'
import { useSession, signIn, signOut } from "next-auth/react"
import s from '../styles/Home.module.scss'

const NOTES = [
  { id: "123-abc", title: "TPE Bases de Datos 2"},
  { id: "424-fde", title: "Apuntes Metodos Numericos"},
  { id: "984-ftw", title: "Apuntes Economia"},
]

export default function Home() {
  const { data: session } = useSession()
  
  if (!session) return (
    <div className={s.login}>
      <p>Not signed in</p>
      <button className={s.button} onClick={() => signIn()}>Sign in</button>
    </div>
  )

  return (
    <>
      <nav className={s.nav}>
        <p>Signed in as {session.user!!.email}</p>
        <button className={s.button} onClick={() => signOut()}>Sign out</button>
      </nav>
      <main className={s.main}>
        
        <h1>My Notes</h1>
        <div className={s.notes}>
          {NOTES.map(note => (
            <Link key={note.id} passHref href={`/notes/${note.id}`}>
              <a className={s.note}>{note.title}</a>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}
