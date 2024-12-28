import { useEffect, useRef } from 'react'
import NxReloadAnimation from './NxReloadAnimation'

interface NxStaggerAnimationProps {
  children: React.ReactNode[];
  className?: string;
  [key: string]: any;
}

declare global {
  interface Window {
    moonMoonStagger: any;
    gsap: any;
    ScrollTrigger: any;
    CustomEase: any;
  }
}

export default function NxStaggerAnimation({ children, className = '', ...props }: NxStaggerAnimationProps) {
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
        await loadScript('https://lefutoir.fr/lib/mm-stagger-animation.js');

        if (window.moonMoonStagger && containerRef.current) {
          window.moonMoonStagger.initStaggerAnimation(containerRef.current as HTMLElement);
        }
      } catch (error) {
        console.error('Error loading animation scripts:', error);
      }
    };

    initAnimation();
  }, []);

  return (
    <div className="nx-relative nx-w-full">
      <div className="nx-relative nx-my-8 nx-mx-auto nx-max-w-4xl nx-bg-gray-800 nx-rounded-xl nx-border nx-border-gray-700">
        <div className="nx-absolute nx-top-4 nx-right-4 nx-z-10">
          <NxReloadAnimation targetRef={containerRef} />
        </div>
        
        <div 
          ref={containerRef}
          className={`nx-p-8 ${className}`}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  )
} 