import { useEffect, useRef, useCallback, useState } from 'react'
import { useRouter } from 'next/router'

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
    if (!window.moonMoonImage || !containerRef.current) return;

    // Kill existing animations
    if (window.ScrollTrigger) {
      window.ScrollTrigger.getAll().forEach(st => st.kill());
    }

    // Initialize animation
    requestAnimationFrame(() => {
      window.moonMoonImage.initScrollImageReveal(containerRef.current);
    });
  }, []);

  // Load scripts
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
        await loadScript('https://cdn.jsdelivr.net/gh/Rakido/mm-animation-library@main/js/mm-image-reveal.js');
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait for library
        setIsReady(true);
      } catch (error) {
        console.error('Error loading animation scripts:', error);
      }
    };

    loadScripts();
  }, []);

  // Initialize animation when ready
  useEffect(() => {
    if (!isReady) return;
    
    // Initial animation
    const timer = setTimeout(initializeAnimation, 100);

    // Handle route changes
    const handleRouteChange = () => {
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach(st => st.kill());
      }
    };

    const handleRouteComplete = () => {
      setTimeout(initializeAnimation, 100);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleRouteComplete);
    
    return () => {
      clearTimeout(timer);
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', handleRouteComplete);
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach(st => st.kill());
      }
    };
  }, [isReady, initializeAnimation, router.events]);

  return (
    <div className="nx-relative nx-w-full">
      <div className="nx-relative nx-my-8 nx-mx-auto nx-max-w-4xl nx-bg-gray-800 nx-rounded-xl nx-border nx-border-gray-900">
        <div className="nx-absolute nx-top-4 nx-right-4 nx-z-10">
          <button
            onClick={initializeAnimation}
            className="nx-p-2 nx-rounded-lg nx-bg-gray-700 hover:nx-bg-gray-600 nx-transition-colors"
            aria-label="Reload animation"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="nx-text-white"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
            </svg>
          </button>
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