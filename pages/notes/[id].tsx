import { useState } from 'react'
import Link from 'next/link'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import Editor from '../../components/Editor'
import s from "../../styles/Editor.module.scss"
import { useRouter } from 'next/router'

export default function EditorPage() {
  const router = useRouter()
  const noteId = router.query.id // TODO: use server side props with Next 13 server rendered components
  const [editing, setEditing] = useState(false)

  const saveNote = async () => {
    // TODO: api call
  }

  return (
    <div className={s.container}>
      <nav>
        <div className={s.navLeft}>
          <Link href="/">&larr; Back to notes</Link>
          <h1>My note title</h1>
        </div>
        <div className={s.navRight}>
          <button onClick={saveNote}>Save</button>
          <button className={`${s.edit} ${editing ? "" : s.notEditing}`} onClick={() => setEditing(p => !p)}>
            <PencilSquareIcon />
          </button>
        </div>
      </nav>
      <Editor editing={editing} />
    </div>
  )

}