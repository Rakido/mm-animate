import { useEffect, useRef, useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import NxReloadAnimation from './NxReloadAnimation'

interface NxImageRevealProps {
  className?: string;
  animate?: string;
  axis?: 'x' | '-x' | 'y' | '-y';
  duration?: number;
  stripesEasing?: string;
  scrollImageEasing?: string;
  zoom?: string | number | boolean;
  scrub?: boolean | number | string;
  start?: string;
  end?: string;
  src?: string;
  [key: string]: any;
}

declare global {
  interface Window {
    moonMoonImage: any;
    gsap: any;
    ScrollTrigger: any;
    CustomEase: any;
  }
}

export default function NxImageReveal({ 
  className = '',
  animate,
  axis = 'y',
  duration = 0.95,
  scrollImageEasing,
  stripesEasing,
  zoom = 1.3,
  scrub = false,
  start = "top bottom",
  end = "bottom top",
  src = '/images/demo-image.jpg',
  ...props 
}: NxImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  const initializeAnimation = useCallback(() => {
    // Wait for next tick to ensure library is loaded
    setTimeout(() => {
      if (!window.moonMoonImage || !containerRef.current) return;

      // Kill existing animations
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach(st => st.kill());
      }

      // Reset container state
      const container = containerRef.current;
      if (container) {
        // Reset any transforms
        container.style.transform = '';
        container.style.opacity = '';
        
        // Force reflow
        void container.offsetHeight;

        // Initialize with fresh state
        if (typeof window.moonMoonImage.initScrollImageReveal === 'function') {
          window.moonMoonImage.initScrollImageReveal(container);
        }
      }
    }, 50);
  }, []);

  // Load scripts first
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
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/CustomEase.min.js');
        await loadScript('https://cdn.jsdelivr.net/gh/Rakido/mm-animation-library@main/js/mm-image-reveal.js');
        
        // Wait for scripts to be properly initialized
        setTimeout(() => {
          setIsReady(true);
        }, 100);
      } catch (error) {
        console.error('Error loading animation scripts:', error);
      }
    };

    loadScripts();
  }, []);

  // Initialize animation when ready
  useEffect(() => {
    if (!isReady) return;

    const timer = setTimeout(initializeAnimation, 100);

    const handleRouteChange = () => {
      if (containerRef.current) {
        containerRef.current.style.visibility = 'hidden';
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.visibility = 'visible';
            initializeAnimation();
          }
        }, 100);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      clearTimeout(timer);
      router.events.off('routeChangeComplete', handleRouteChange);
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach(st => st.kill());
      }
    };
  }, [router.events, initializeAnimation, isReady]);

  return (
    <div className="nx-relative nx-w-full">
      <div className="nx-relative nx-my-8 nx-mx-auto nx-max-w-4xl nx-bg-gray-800 nx-rounded-xl nx-border nx-border-gray-900">
        <div className="nx-absolute nx-top-4 nx-right-4 nx-z-10">
          <NxReloadAnimation 
            targetRef={containerRef} 
            type="image" 
            onReload={() => {
              if (containerRef.current && window.moonMoonImage?.initScrollImageReveal) {
                window.moonMoonImage.initScrollImageReveal(containerRef.current);
              }
            }}
          />
        </div>
        
        <div className="nx-p-[100px] nx-flex nx-items-center nx-justify-center nx-p-8 reveal">
          <div 
            ref={containerRef}
            data-scroll-image-reveal="true"
            data-animate={animate}
            data-axis={axis}
            data-duration={duration}
            data-scroll-image-easing={scrollImageEasing}
            data-stripes-easing={stripesEasing}
            data-zoom={zoom}
            data-scrub={scrub}
            data-start={start}
            data-end={end}
            className="reveal"
            style={{ visibility: isReady ? 'visible' : 'hidden' }}
            {...props}
          >
            <img 
              src={src}
              alt="Animation demo"
              data-scroll-image-reveal-target="true"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 