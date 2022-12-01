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
  
  // TODO: fix login styles
  if (!session) return (
    <>
      <p>Not signed in</p>
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )

  return (
    <main className={s.main}>
      <p>Signed in as {session.user!!.email}</p>

      <button onClick={() => fetch("/api/hello").then(res => res.json()).then(json => console.log(json))}>Hello</button>
      
      <button onClick={() => signOut()}>Sign out</button>
      <h1>My Notes</h1>
      <div className={s.notes}>
        {NOTES.map(note => (
          <Link key={note.id} className={s.note} href={`/notes/${note.id}`}>
            {note.title}
          </Link>
        ))}
      </div>
    </main>
  )
}
