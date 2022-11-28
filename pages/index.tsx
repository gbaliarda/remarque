import Link from 'next/link'
import s from '../styles/Home.module.scss'

const NOTES = [
  { id: "123-abc", title: "TPE Bases de Datos 2"},
  { id: "424-fde", title: "Apuntes Metodos Numericos"},
  { id: "984-ftw", title: "Apuntes Economia"},
]

export default function Home() {
  return (
    <main className={s.main}>
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
