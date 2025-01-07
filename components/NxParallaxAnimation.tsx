import { useEffect, useRef } from 'react'

interface NxParallaxAnimationProps {
  src: string;
  imageFull?: boolean;
  height?: string | number;
  'data-parallax'?: boolean;
  'data-parallax-direction'?: 'x' | 'y' | 'xy';
  'data-scrub'?: boolean;
  'data-speed'?: string | number;
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
  height = '200px',
  'data-parallax': parallax = true,
  'data-parallax-direction': direction = 'y',
  'data-scrub': scrub = true,
  'data-speed': speed,
  ...props 
}: NxParallaxAnimationProps) {
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
        await new Promise(resolve => setTimeout(resolve, 100));
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
        await loadScript('https://lefutoir.fr/lib/mm-parallax-animation.js');

        if (window.moonMoonParallax && containerRef.current) {
          setTimeout(() => {
            window.moonMoonParallax.initParallax(containerRef.current);
          }, 100);
        }
      } catch (error) {
        console.error('Error loading animation scripts:', error);
      }
    };

    initAnimation();
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
          height: typeof height === 'number' ? `${height}px` : height
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
          {...(!imageFull ? props : {})}
        />
      </div>
    </div>
  )
} 