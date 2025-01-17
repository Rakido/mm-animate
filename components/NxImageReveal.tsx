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
  const [key, setKey] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const initializeAnimation = useCallback(() => {
    if (!window.moonMoonImage || !containerRef.current || isAnimating) return;

    setIsAnimating(true);

    // Kill existing animations
    if (window.ScrollTrigger) {
      window.ScrollTrigger.getAll().forEach(st => st.kill());
    }

    // Use RAF to batch DOM operations
    requestAnimationFrame(() => {
      if (containerRef.current) {
        window.moonMoonImage.initScrollImageReveal(containerRef.current);
        // Reset animation state after animation duration
        setTimeout(() => setIsAnimating(false), duration * 1000);
      }
    });
  }, [duration, isAnimating]);

  // Load scripts once
  useEffect(() => {
    let mounted = true;
    
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
        if (mounted) {
          setIsReady(true);
        }
      } catch (error) {
        console.error('Error loading animation scripts:', error);
      }
    };

    loadScripts();
    return () => { mounted = false; };
  }, []);

  // Initialize animation when ready or key changes
  useEffect(() => {
    if (!isReady) return;
    
    const timer = setTimeout(initializeAnimation, 50);
    return () => {
      clearTimeout(timer);
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach(st => st.kill());
      }
    };
  }, [isReady, key, initializeAnimation]);

  // Handle route changes
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach(st => st.kill());
      }
    };

    const handleRouteComplete = () => {
      requestAnimationFrame(() => {
        setKey(k => k + 1);
      });
    };

    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleRouteComplete);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', handleRouteComplete);
    };
  }, [router.asPath]);

  return (
    <div className="nx-relative nx-w-full">
      <div className="nx-relative nx-my-8 nx-mx-auto nx-max-w-4xl nx-bg-gray-800 nx-rounded-xl nx-border nx-border-gray-900">
        <div className="nx-absolute nx-top-4 nx-right-4 nx-z-10">
          <button
            onClick={() => {
              if (!isAnimating) {
                requestAnimationFrame(() => {
                  setKey(k => k + 1);
                });
              }
            }}
            disabled={isAnimating}
            className={`nx-p-2 nx-rounded-lg nx-bg-gray-700 hover:nx-bg-gray-600 nx-transition-colors ${
              isAnimating ? 'nx-opacity-50 nx-cursor-not-allowed' : ''
            }`}
            aria-label="Reload animation"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="nx-text-white"
            >
              <path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
            </svg>
          </button>
        </div>
        
        <div className="nx-p-[100px] nx-flex nx-items-center nx-justify-center nx-p-8 reveal">
          <div 
            key={key}
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