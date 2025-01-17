import { useEffect, useRef } from 'react'

interface ParallaxImage {
  src: string;
  pin?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  'data-parallax'?: boolean;
  'data-parallax-direction'?: 'x' | 'y' | 'xy';
  'data-speed'?: string | number;
  'data-scrub'?: boolean | number;
  alt?: string;
}

interface NxParallaxSpreadProps {
  images: ParallaxImage[];
  height?: string | number;
  className?: string;
  [key: string]: any;
}

export default function NxParallaxSpread({ 
  images,
  height = '600px',
  className = '',
  ...props 
}: NxParallaxSpreadProps) {
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

  const getPositionClasses = (pin?: string) => {
    switch(pin) {
      case 'top-left':
        return 'nx-top-8 nx-left-8';
      case 'top-right':
        return 'nx-top-8 nx-right-8';
      case 'bottom-left':
        return 'nx-bottom-8 nx-left-8';
      case 'bottom-right':
        return 'nx-bottom-8 nx-right-8';
      case 'center':
      default:
        return 'nx-top-1/2 nx-left-1/2 -nx-translate-x-1/2 -nx-translate-y-1/2';
    }
  };

  return (
    <div className="nx-relative nx-w-full nx-mt-4 nx-rounded-xl nx-overflow-hidden">
      <div 
        ref={containerRef}
        data-parallax="true"
        className={`
          nx-relative 
          nx-overflow-hidden
          ${className}
        `}
        style={{ 
          height: typeof height === 'number' ? `${height}px` : height
        }}
        {...props}
      >
        {images.map((image, index) => (
          <img 
            key={index}
            src={image.src}
            className={`
              nx-absolute 
              nx-w-[200px] 
              nx-h-[200px] 
              nx-object-cover
              nx-rounded-xl
              ${getPositionClasses(image.pin)}
            `}
            data-parallax="true"
            data-parallax-direction={image['data-parallax-direction']}
            data-parallax-pin={image.pin}
            data-speed={image['data-speed']}
            data-scrub={image['data-scrub']}
          />
        ))}
      </div>
    </div>
  )
} 