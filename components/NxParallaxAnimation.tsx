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
    moonMoonParallaxInitialized?: boolean;
  }
}

export default function NxParallaxAnimation({ 
  src, 
  imageFull = false,
  height = '400px',
  'data-parallax': parallax = true,
  'data-parallax-direction': direction = 'y',
  'data-scrub': scrub = true,
  'data-speed': speed,
  'data-zoom': zoom,
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
        // Load GSAP and ScrollTrigger only if not already loaded
        if (!window.gsap) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        if (!window.ScrollTrigger) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Load parallax library only if not initialized
        if (!window.moonMoonParallaxInitialized) {
          await loadScript('https://cdn.jsdelivr.net/gh/Rakido/mm-animation-library@main/js/mm-parallax-animation.js');
          window.moonMoonParallaxInitialized = true;
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        setIsReady(true);

        // Initialize animation
        if (containerRef.current && window.moonMoonParallax) {
          // Kill existing ScrollTrigger instances for this container
          if (window.ScrollTrigger) {
            window.ScrollTrigger.getAll().forEach(st => {
              if (st.vars.trigger === containerRef.current) {
                st.kill();
              }
            });
          }
          
          window.moonMoonParallax.initParallax(containerRef.current);
        }
      } catch (error) {
        console.error('Error loading animation scripts:', error);
      }
    };

    initAnimation();

    // Cleanup function
    return () => {
      if (window.ScrollTrigger && containerRef.current) {
        window.ScrollTrigger.getAll().forEach(st => {
          if (st.vars.trigger === containerRef.current) {
            st.kill();
          }
        });
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
        {...(imageFull ? props : {})}
      >
        <img 
          src={src}
          className={`
            ${imageFull ? 'nx-w-full nx-h-[120%] nx-object-cover' : 'nx-w-[200px] nx-h-[200px] nx-object-cover'}
          `}
          data-parallax={parallax ? "true" : "false"}
          data-parallax-direction={direction}
          data-scrub={scrub ? "true" : "false"}
          data-speed={speed}
          data-zoom={zoom}
          data-image-parallax="true"
          {...(!imageFull ? props : {})}
        />
      </div>
    </div>
  )
} 