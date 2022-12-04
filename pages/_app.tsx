import '../styles/globals.scss'
import "react-cmdk/dist/cmdk.css"
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { SessionProvider } from "next-auth/react"
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';

const SearchCommandPalette = dynamic(() => import('../components/SearchCommandPalette'), {
  ssr: false,
})

//@ts-ignore
export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter()

  return  <>
    <Head>
      <title>Remarque</title>
      <meta name="description" content="The notes app by excellence." />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <SessionProvider session={session}>
      {/* Using `key` to refresh the state when navigating directly from one note to another via search palette */}
      <Component key={router.asPath} {...pageProps} />
      <SearchCommandPalette />
    </SessionProvider>
  </>
}
