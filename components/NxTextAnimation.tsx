import { useEffect, useRef } from 'react'
import NxReloadAnimation from './NxReloadAnimation'

interface NxTextAnimationProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

declare global {
  interface Window {
    moonMoonText: any;
    gsap: any;
    ScrollTrigger: any;
    CustomEase: any;
    SplitType: any;
  }
}

export default function NxTextAnimation({ children, className = '', ...props }: NxTextAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        script.onload = () => resolve();
        script.onerror = (error) => reject(error);
        document.body.appendChild(script);
      });
    };

    const initAnimation = async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/CustomEase.min.js');
        await loadScript('https://unpkg.com/split-type');
        await loadScript('https://lefutoir.fr/lib/mm-text-animation.js');

        if (window.moonMoonText && containerRef.current) {
          window.moonMoonText.initTextAnimation(containerRef.current as HTMLElement);
        }
      } catch (error) {
        console.error('Error loading animation scripts:', error);
      }
    };

    initAnimation();
  }, []);

  return (
    <div className="nx-relative nx-w-full">
      <div className="nx-relative nx-my-8 nx-mx-auto nx-max-w-4xl nx-bg-gray-800 nx-rounded-xl nx-bg-gray-500 nx-border-gray-800">
        <div className="nx-absolute" style={{top: '1rem', right: '1rem', zIndex: 10}}>
          <NxReloadAnimation targetRef={containerRef} />
        </div>
        
        <div 
          ref={containerRef}
          data-scroll-text-reveal="true"
          className="nx-text-2xl nx-text-white nx-p-8 nx-m-0 nx-border nx-rounded-xl nx-bg-gray-100/20 nx-border-gray-800 dark:nx-bg-gray-800 dark:nx-border-gray-700"
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  )
} 