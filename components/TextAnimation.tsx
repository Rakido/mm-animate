import { useEffect, useRef } from 'react'
import Script from 'next/script'
import { MoonMoonText } from '../utils/MoonMoonText'
import ReloadAnimation from './ReloadAnimation'

interface TextAnimationProps {
  children: React.ReactNode;
  [key: string]: any;
}

export default function TextAnimation({ children, ...props }: TextAnimationProps) {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let scriptLoadCheck: NodeJS.Timeout;
    let isLoading = true;

    const initAnimation = () => {
      if (!isLoading) return;
      
      if (
        typeof window !== 'undefined' &&
        window.gsap &&
        window.ScrollTrigger &&
        window.CustomEase &&
        window.SplitType &&
        textRef.current
      ) {
        isLoading = false;
        clearInterval(scriptLoadCheck);
        
        setTimeout(() => {
          if (!window.moonMoonText) {
            window.moonMoonText = new MoonMoonText();
          } else {
            window.moonMoonText.initTextAnimation();
          }
        }, 100);
      }
    };

    scriptLoadCheck = setInterval(initAnimation, 100);

    return () => {
      isLoading = false;
      clearInterval(scriptLoadCheck);
    };
  }, []);

  return (
    <div className="relative">
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" 
        strategy="afterInteractive"
      />
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"
        strategy="afterInteractive"
      />
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/CustomEase.min.js"
        strategy="afterInteractive"
      />
      <Script 
        src="https://unpkg.com/split-type"
        strategy="afterInteractive"
      />

      <div className="relative w-full max-w-4xl mx-auto my-8">
        <div className="absolute right-6 top-6 z-[100]">
          <ReloadAnimation />
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-xl">
          <div 
            ref={textRef} 
            className="min-h-[200px] p-12 text-5xl font-bold text-gray-800 flex items-center justify-center text-center"
            {...props}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
} 