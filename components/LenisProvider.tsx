import { ReactNode, useEffect } from 'react'
import { useLenis } from '../hooks/useLenis'

interface LenisProviderProps {
  children: ReactNode
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenis = useLenis()

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gsap && lenis.current) {
      window.gsap.ticker.add((time: number) => {
        lenis.current?.raf(time * 1000)
      })

      window.gsap.ticker.lagSmoothing(0)
    }
  }, [lenis])

  return <>{children}</>
} 