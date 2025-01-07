import { useEffect, useRef } from 'react'

interface NxParallaxMarqueeProps {
  children: React.ReactNode;
  direction?: 'x' | '-x' | 'y' | '-y';
  infinite?: boolean;
  speed?: number;
  easing?: string;
  fontSize?: number;
  repeat?: number;
  gap?: number;
  className?: string;
  [key: string]: any;
}

declare global {
  interface Window {
    moonMoonParallax: any;
    gsap: any;
    ScrollTrigger: any;
  }
}

export default function NxParallaxMarquee({ 
  children,
  direction = '-y',
  infinite = true,
  speed = 25,
  easing = 'none',
  fontSize = 40,
  repeat = 5,
  gap = 0,
  className = '',
  ...props 
}: NxParallaxMarqueeProps) {
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
    <div 
      className="nx-relative nx-w-full nx-mt-4 nx-rounded-xl nx-overflow-hidden"
      style={{ height: '500px' }}
    >
      <div 
        ref={containerRef}
        className={`
          nx-relative 
          nx-w-full
          nx-h-full
          nx-max-h-full
          nx-overflow-hidden
          nx-flex
          nx-flex-col
          nx-flex-nowrap
          nx-items-center
          nx-justify-start
          ${className}
        `}
        data-parallax="true"
        data-animate="marquee"
        data-direction={direction}
        data-marquee-infinite={infinite}
        data-marquee-speed={speed}
        data-easing={easing}
        style={{ gap: `${gap}px` }}
        {...props}
      >
        {Array.from({ length: repeat }).map((_, index) => (
          <h1 
            key={index}
            className="nx-m-0 nx-flex-shrink-0"
            style={{ fontSize: `${fontSize}px` }}
          >
            {children}
          </h1>
        ))}
      </div>
    </div>
  )
} 