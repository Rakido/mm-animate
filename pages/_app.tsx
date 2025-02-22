import type { AppProps } from 'next/app'
import { LenisProvider } from '../components/LenisProvider'
import '../styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/gh/Rakido/mm-animation-library@latest/css/mm-animation.css"
        />
      </Head>
      <LenisProvider>
        <Component {...pageProps} />
      </LenisProvider>
    </>
  )
} 