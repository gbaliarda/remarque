import { useState } from 'react'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { unstable_getServerSession } from "next-auth/next"
// @ts-ignore
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import Editor from '../../components/Editor'
import s from "../../styles/Editor.module.scss"

interface Props {
  userId: number
  id: number
  title: string
  completed: boolean
  user: string
}

export default function EditorPage(props: Props) {
  const [editing, setEditing] = useState(false)

  // TODO: use getServerSideProps() to get note data
  console.log("PROPS", props)

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

export const getServerSideProps: GetServerSideProps<{ data: Props }> = async (context) => {
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
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${noteId}`)
  const data = await res.json()

  if (!data) return { notFound: true }

  return {
    props: { data, user: session.user!!.email }, // will be passed to the page component as props
  }
}
