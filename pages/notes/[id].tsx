import { useState } from 'react'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { unstable_getServerSession } from "next-auth/next"
// @ts-ignore
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { PencilSquareIcon, TrashIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import Swal from 'sweetalert2'
import Editor from '../../components/Editor'
import s from "../../styles/Editor.module.scss"
import { apiFetcher } from '../../services/setup'
import { Note } from '../../services/types'
import { updateNote, deleteNote, shareNote, duplicateNote } from '../../services/notes';
import { useRouter } from 'next/router';

interface Props {
  user: string
  note: Note
}

export default function EditorPage({ user, note }: Props) {
  // if there's no content, set it to true
  const [editing, setEditing] = useState(note.content.length === 0 && user === note.owner)
  const [content, setContent] = useState(() => note.content.length === 0 ? [""] : note.content)
  const [title, setTitle] = useState(note.title)
  const [isPublic, setIsPublic] = useState(note.isPublic)
  const router = useRouter()

  const saveNote = async () => {
    try {
      await updateNote(note._id, { title, content })
      Swal.fire({ title: "Note saved", icon: "success" })
    } catch(e: any) {
      Swal.fire({ title: "Error saving note", text: e, icon: "error" })
    }
  }

  const handleDelete = async () => {
    try {
      await deleteNote(note._id)
      router.replace("/")
    } catch(e: any) {
      Swal.fire({ title: "Error deleting note", text: e, icon: "error" })
    }
  }

  const handleShare = async () => {
    try {
      await shareNote(note._id, !isPublic)
      setIsPublic(p => !p)
      Swal.fire({ title: `Note ${isPublic ? "unshared" : "shared"}`, icon: "success" })
    } catch(e: any) {
      Swal.fire({ title: `Error ${isPublic ? "unsharing" : "sharing"} note`, text: e, icon: "error" })
    }
  }

  const handleDuplicate = async () => {
    try {
      await duplicateNote(note._id)
      Swal.fire({ title: `Note duplicated`, icon: "success" })
    } catch(e: any) {
      Swal.fire({ title: `Error duplicating note`, text: e, icon: "error" })
    }
  }

  return (
    <div className={s.container}>
      <nav>
        <div className={s.navLeft}>
          <Link href="/">&larr; Back to notes</Link>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className={s.navRight}>
          {user === note.owner ?
            <>
              <button onClick={saveNote}>Save</button>
              <button className={`${s.icon} ${editing ? "" : s.inactive}`} onClick={() => setEditing(p => !p)}>
                <PencilSquareIcon />
              </button>
              <button className={`${s.icon} ${isPublic ? "" : s.inactive}`} onClick={handleShare}>
                <GlobeAltIcon />
              </button>
              <button className={`${s.icon} ${s.delete}`} onClick={handleDelete}>
                <TrashIcon />
              </button> 
            </>
          :
            <button onClick={handleDuplicate}>Duplicate</button>
          }
        </div>
      </nav>
      <Editor content={content} setContent={setContent} editing={editing} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const noteId = context.params?.id

  try {
    // https://github.com/nextauthjs/next-auth/issues/4238#issuecomment-1251750371
    const note = await apiFetcher<Note>(`/api/notes/${noteId}`, {
      // @ts-ignore
      headers: {
        Cookie: context.req.headers.cookie
      }
    })
    return { props: { user: session.user!!.email!!, note } }
  } catch (e) {
    console.log(e)
    return { notFound: true }
  }

}
