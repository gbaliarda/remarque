import '../styles/globals.scss'
import "react-cmdk/dist/cmdk.css"
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useState, useCallback } from 'react'
import CommandPalette from 'react-cmdk'
import { useHandleOpenCommandPalette } from 'react-cmdk/dist/lib/utils'
import { useRouter } from 'next/router'
import DOMPurify from 'isomorphic-dompurify'
// @ts-ignore
import debounce from "lodash.debounce"
import { SessionProvider } from "next-auth/react"

const hits = [
  {
    _id: "365-opu",
    highlight: {
      title: [
        "Bases de <em>datos</em> 2"
      ],
      content: [
        "La base de <em>datos</em> mas rapida",
        "La velocidad de los <em>datos</em> es muy buena",
        "estan super cacheados todos los <em>datos</em>."
      ]
    }
  },
  {
    _id: "123-abc",
    highlight: {
      content: [
        "<em>datos</em> <em>datos</em> <em>datos</em> <em>datos</em>"
      ]
    }
  },
]

//@ts-ignore
export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")

  useHandleOpenCommandPalette(setIsOpen)

  const handleSearch = (phrase: string) => {
    setSearch(phrase)
    getSearchHits(phrase)
  }

  const getSearchHits = useCallback(debounce((phrase: string) => {
    // TODO: make elastic query
    console.log("Searching for:", phrase)
  }, 500), [])

  return  <>
    <Head>
      <title>Remarque</title>
      <meta name="description" content="The notes app by excellence." />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <CommandPalette
      onChangeSearch={handleSearch}
      onChangeOpen={setIsOpen}
      search={search}
      isOpen={isOpen}
    >
      <CommandPalette.List heading='My Notes'>
        {hits.map(({ _id, highlight }) =>
          (highlight.title?.map((text, index) => (
            <CommandPalette.ListItem key={_id} index={index} icon="BookOpenIcon" onClick={() => router.push(`/notes/${_id}`)}>
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text)}} />
            </CommandPalette.ListItem>
          )) ?? []).concat(
            highlight.content?.map((text, index) => (
              <CommandPalette.ListItem key={index} index={index} onClick={() => router.push(`/notes/${_id}`)}>
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text)}} />
              </CommandPalette.ListItem>
            ))
          )
        )}
      </CommandPalette.List>
    </CommandPalette>

    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  </>
}
