import { useEffect, useRef, useCallback, useState } from 'react'
import NxReloadAnimation from './NxReloadAnimation'

interface NxStaggerAnimationProps {
  children: React.ReactNode[];
  className?: string;
  [key: string]: any;
}

declare global {
  interface Window {
    moonMoonStagger: any;
    moonMoonText: any;
    moonMoonImage: any;
    gsap: any;
    ScrollTrigger: any;
    CustomEase: any;
    SplitType: any;
  }
}

export default function NxStaggerAnimation({ children, className = '', ...props }: NxStaggerAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)

  const initializeAnimation = useCallback(() => {
    if (!window.moonMoonStagger || !containerRef.current) return;
    window.moonMoonStagger.initStaggerAnimation(containerRef.current);
  }, []);

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

    const loadScripts = async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait for GSAP
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/CustomEase.min.js');
        await loadScript('https://cdn.jsdelivr.net/gh/Rakido/mm-animation-library@latest/js/mm-stagger-animation.js');
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait for library
        setIsReady(true);
      } catch (error) {
        console.error('Error loading animation scripts:', error);
      }
    };

    loadScripts();
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const timer = setTimeout(initializeAnimation, 100);
    return () => clearTimeout(timer);
  }, [isReady, initializeAnimation]);

  return (
    <div className="nx-relative nx-w-full">
      <div className="nx-relative nx-my-8 nx-mx-auto nx-max-w-4xl nx-bg-gray-800 nx-rounded-xl nx-border nx-border-gray-700">
        <div className="nx-absolute nx-top-4 nx-right-4 nx-z-10">
          <NxReloadAnimation 
            targetRef={containerRef} 
            type="stagger" 
            onReload={initializeAnimation}
          />
        </div>
        
        <div 
          ref={containerRef}
          data-stagger-reveal="true"
          className={`nx-p-8 ${className}`}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  )
} 