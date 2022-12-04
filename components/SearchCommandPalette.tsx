import { useState, useCallback } from 'react'
import CommandPalette from 'react-cmdk'
import { useRouter } from 'next/router'
import DOMPurify from 'isomorphic-dompurify'
// @ts-ignore
import debounce from "lodash.debounce"
import Swal from 'sweetalert2'
import { useSession } from 'next-auth/react'
import { useHandleOpenCommandPalette } from 'react-cmdk/dist/lib/utils'
import { IndexedNote } from '../services/types'
import { searchPhraseInNotes } from '../services/notes'
import { useUser } from '../services/auth'

export default function SearchCommandPalette() {
  const router = useRouter()
  const { data: session } = useSession()
  const { data: user } = useUser(session?.user?.email)
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [hits, setHits] = useState<IndexedNote[]>([])

  useHandleOpenCommandPalette(setIsOpen)

  const handleSearch = (phrase: string) => {
    setSearch(phrase)
    getSearchHits(phrase)
  }

  const getSearchHits = useCallback(debounce(async (phrase: string) => {
    try {
      const notes = await searchPhraseInNotes(user!!._id, phrase)
      setHits(notes)
    } catch(e: any) {
      console.log(e)
      Swal.fire({ title: "Error fetching notes", text: e, icon: "error" })
    }
  }, 500), [user])

  if (!user) return null

  return (
    <CommandPalette
      onChangeSearch={handleSearch}
      onChangeOpen={setIsOpen}
      search={search}
      isOpen={isOpen}
    >
      {hits.map(({ _id, highlight, title }) =>
        <CommandPalette.List key={_id} heading={title}>
          {(highlight.title?.map((text, index) => (
            <CommandPalette.ListItem key={_id} showType={false} index={index} icon="BookOpenIcon" onClick={() => router.push(`/notes/${_id}`)}>
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text)}} />
            </CommandPalette.ListItem>
          )) ?? []).concat(!highlight.content ? [] :
            highlight.content?.map((text, index) => (
              <CommandPalette.ListItem key={index} showType={false} index={index} onClick={() => router.push(`/notes/${_id}`)}>
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text)}} />
              </CommandPalette.ListItem>
            ))
          )}
        </CommandPalette.List>
      )}
    </CommandPalette>
  )

}