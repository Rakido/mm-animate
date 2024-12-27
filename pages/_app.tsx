import type { AppProps } from 'next/app'
import { LenisProvider } from '../components/LenisProvider'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LenisProvider>
      <Component {...pageProps} />
    </LenisProvider>
  )
} 