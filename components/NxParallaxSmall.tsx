import { useEffect, useRef } from 'react'
import NxReloadAnimation from './NxReloadAnimation'

interface NxParallaxSmallProps {
  src?: string;
  direction?: 'x' | 'y' | 'xy';
  speed?: number;
  scrub?: number | boolean;
  className?: string;
  [key: string]: any;
}

export default function NxParallaxSmall({
  src = 'https://picsum.photos/200/200',
  direction = 'x',
  speed = 0.8,
  scrub = 1.5,
  className = '',
  ...props
}: NxParallaxSmallProps) {
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
        await loadScript('https://cdn.jsdelivr.net/gh/Rakido/mm-animation-library@main/js/mm-parallax-animation.js');

        if (window.moonMoonParallax && containerRef.current) {
          window.moonMoonParallax.initParallax(containerRef.current);
        }
      } catch (error) {
        console.error('Error loading animation scripts:', error);
      }
    };

    initAnimation();
  }, []);

  return (
    <div className="nx-relative nx-w-full nx-h-[400px] nx-flex nx-items-center nx-justify-center">
      <div className="nx-relative nx-my-8 nx-mx-auto nx-bg-gray-800 nx-rounded-xl nx-border nx-border-gray-700">
        <div className="nx-absolute nx-top-4 nx-right-4 nx-z-10">
          <NxReloadAnimation targetRef={containerRef} type="parallax" />
        </div>
        
        <div 
          ref={containerRef}
          className={`
            nx-relative 
            nx-w-[200px] 
            nx-h-[200px] 
            nx-overflow-hidden 
            nx-border 
            nx-border-gray-600 
            nx-rounded-lg
            ${className}
          `}
          {...props}
        >
          <img 
            src={src}
            alt="Parallax element"
            className="nx-w-full nx-h-full nx-object-cover"
            data-parallax="true"
            data-parallax-direction={direction}
            data-speed={speed}
            data-scrub={scrub}
          />
        </div>
      </div>
    </div>
  )
} 