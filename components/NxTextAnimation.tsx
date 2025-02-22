import { useEffect, useRef, useCallback, useState } from 'react'
import NxReloadAnimation from './NxReloadAnimation'

interface NxTextAnimationProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export default function NxTextAnimation({ children, className = '', ...props }: NxTextAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)

  const initializeAnimation = useCallback(() => {
    if (!window.moonMoonText || !containerRef.current) return;
    window.moonMoonText.initTextAnimation(containerRef.current);
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
        // Load GSAP first
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait for GSAP
        
        // Load other dependencies
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/CustomEase.min.js');
        
        // Load SplitType before the animation library
        await loadScript('https://unpkg.com/split-type');
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait for SplitType
        
        // Load the animation library last
        await loadScript('https://cdn.jsdelivr.net/gh/Rakido/mm-animation-library@main/js/mm-text-animation.js');
        
        await new Promise(resolve => setTimeout(resolve, 100)); // Final wait
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
      <div className="nx-relative nx-my-8 nx-mx-auto nx-max-w-4xl nx-bg-gray-800 nx-rounded-xl nx-bg-gray-500 nx-border-gray-800">
        <div className="nx-absolute" style={{top: '1rem', right: '1rem', zIndex: 10}}>
          <NxReloadAnimation targetRef={containerRef} onReload={initializeAnimation} />
        </div>
        
        <div 
          ref={containerRef}
          data-scroll-text-reveal="true"
          className={`nx-text-2xl nx-text-white nx-p-8 nx-m-0 nx-border nx-rounded-xl nx-bg-gray-100/20 nx-border-gray-800 dark:nx-bg-gray-800 dark:nx-border-gray-700 ${className}`}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  )
} 