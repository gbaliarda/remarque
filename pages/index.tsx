import Link from 'next/link'
import { signIn, signOut } from "next-auth/react"
import { GetServerSideProps } from 'next'
import { unstable_getServerSession } from "next-auth/next"
// @ts-ignore
import { authOptions } from 'pages/api/auth/[...nextauth]'
import s from '../styles/Home.module.scss'
import { createNote } from '../services/notes'
import { useRouter } from 'next/router'
import { apiFetcher } from '../services/setup';
import { Note, User } from '../services/types'
import { getRelativeDays } from '../utils/parseDate';

interface Props {
  user: User | null
  notes: Note[]
}

export default function Home({ user, notes }: Props) {
  const router = useRouter()

  const handleCreate = async () => {
    try {
      const note = await createNote()
      router.push(`/notes/${note._id}`)
    } catch(e) {
      console.log(e)
    }
  }
  
  if (!user) return (
    <div className={s.login}>
      <p>Not signed in</p>
      <button className={s.button} onClick={() => signIn()}>Sign in</button>
      <Link passHref href="/register">
        <a>Don&apos;t have an account? <span style={{ color: "blueviolet" }}>Register</span></a>
      </Link>
    </div>
  )

  return (
    <>
      <nav className={s.nav}>
        <p>Signed in as {user.email}</p>
        <button className={s.button} onClick={() => signOut()}>Sign out</button>
      </nav>
      <main className={s.main}>
        <h1>My Notes</h1>
        <div className={s.notes}>
          {notes.map(note => (
            <div key={note._id} className={s.note}>
              <Link passHref href={`/notes/${note._id}`}>
                <a>{note.title}</a>
              </Link>
              <span>{getRelativeDays(note.lastModified)}</span>
            </div>
          ))}
        </div>
        <button onClick={handleCreate} className={s.create}>+ New</button>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      props: { user: null, notes: [] }
    }
  }

  const userEmail = session.user!!.email!!
  // If an error is thrown inside getServerSideProps, it will show the pages/500.js file. Check out the documentation for 500 page to learn more on how to create it. During development this file will not be used and the dev overlay will be shown instead.
  try {
    const user = await apiFetcher<User>(`/api/users?email=${userEmail}`)
    user.email = userEmail
    // https://github.com/nextauthjs/next-auth/issues/4238#issuecomment-1251750371
    const notes = await apiFetcher<Note[]>(`/api/users/${user._id}/notes`, {
      // @ts-ignore
      headers: {
        Cookie: context.req.headers.cookie
      }
    })
    return {
      props: { user, notes }
    }
  } catch(e: any) {
    console.log(e)
    return {
      redirect: {
        destination: '/register',
        permanent: false,
      },
    }
  }

}
