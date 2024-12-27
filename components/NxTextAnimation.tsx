import { useEffect, useRef } from 'react'
import { MoonMoonText } from '../utils/MoonMoonText'
import NxReloadAnimation from './NxReloadAnimation'

interface NxTextAnimationProps {
  children: React.ReactNode;
  [key: string]: any;
}

export default function NxTextAnimation({ children, ...props }: NxTextAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.body.appendChild(script);
      });
    };

    const initAnimation = async () => {
      try {
        // Load scripts in sequence
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/CustomEase.min.js');
        await loadScript('https://unpkg.com/split-type');

        // Wait a bit to ensure scripts are initialized
        setTimeout(() => {
          if (!window.moonMoonText) {
            window.moonMoonText = new MoonMoonText();
          } else {
            window.moonMoonText.initTextAnimation();
          }
        }, 100);
      } catch (error) {
        console.error('Error loading animation scripts:', error);
      }
    };

    initAnimation();

    return () => {
      if (window.moonMoonText?.cleanup) {
        window.moonMoonText.cleanup();
      }
    };
  }, []);

  return (
    <div className="nx-relative nx-w-full">
      <div className="nx-relative nx-my-8 nx-mx-auto nx-max-w-4xl nx-bg-gray-800 nx-rounded-xl nx-border nx-border-gray-700">
        {/* Reload button */}
        <div className="nx-absolute nx-top-4 nx-right-4 nx-z-10">
          <NxReloadAnimation targetRef={containerRef} />
        </div>
        
        <div 
          ref={containerRef}
          data-scroll-text-reveal="true"
          className="nx-text-3xl nx-text-white nx-p-8 nx-m-0"
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  )
} 