import { useEffect, useRef, useState } from 'react'

interface NxParallaxAnimationProps {
  src: string;
  imageFull?: boolean;
  height?: string | number;
  'data-parallax'?: boolean;
  'data-parallax-direction'?: 'x' | 'y' | 'xy';
  'data-scrub'?: boolean | number;
  'data-speed'?: string | number;
  'data-zoom'?: boolean | number;
  [key: string]: any;
}

declare global {
  interface Window {
    moonMoonParallax: any;
    gsap: any;
    ScrollTrigger: any;
  }
}

export default function NxParallaxAnimation({ 
  src, 
  imageFull = false,
  height = '400px',
  'data-parallax': parallax = true,
  'data-parallax-direction': direction = 'y',
  'data-scrub': scrub = true,
  'data-speed': speed = 35,
  'data-zoom': zoom = true,
  ...props 
}: NxParallaxAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)

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
        if (!window.gsap) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        if (!window.ScrollTrigger) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        await loadScript('https://cdn.jsdelivr.net/gh/Rakido/mm-animation-library@main/js/mm-parallax-animation.js');
        await new Promise(resolve => setTimeout(resolve, 100));

        if (window.moonMoonParallax) {
          // Kill existing ScrollTrigger instances
          if (window.ScrollTrigger) {
            window.ScrollTrigger.getAll().forEach(st => st.kill());
          }
          
          setIsReady(true);
          
          // Need to wait a bit for the DOM to be ready
          setTimeout(() => {
            window.moonMoonParallax.initParallax();
          }, 100);
        }
      } catch (error) {
        console.error('Error loading animation scripts:', error);
      }
    };

    initAnimation();

    return () => {
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach(st => st.kill());
      }
    };
  }, []);

  return (
    <div className="nx-relative nx-w-full nx-mt-4 nx-rounded-xl nx-overflow-hidden">
      <div 
        ref={containerRef}
        className={`
          nx-relative 
          nx-overflow-hidden
          ${!imageFull && 'nx-flex nx-items-center nx-justify-center'}
        `}
        style={{ 
          height: typeof height === 'number' ? `${height}px` : height,
          visibility: isReady ? 'visible' : 'hidden'
        }}
      >
        <div 
          data-parallax="true"
          data-parallax-direction={direction}
          data-speed={speed}
          data-scrub={scrub}
          data-image-parallax="true"
        >
          <img 
            src={src}
            className={`
              ${imageFull ? 'nx-w-full nx-h-[120%] nx-object-cover' : 'nx-w-[200px] nx-h-[200px] nx-object-cover'}
            `}
            style={{
              willChange: 'transform',
              transformOrigin: 'center center'
            }}
          />
        </div>
      </div>
    </div>
  )
} 