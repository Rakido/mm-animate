import { useEffect, useRef, useState, useCallback } from 'react'
import NxReloadAnimation from './NxReloadAnimation'

interface NxStaggerCardsAnimationProps {
  className?: string;
  button?: boolean;
  closeButton?: boolean;
  triggerId?: string;
  [key: string]: any;
}

declare global {
  interface Window {
    moonMoonStagger: any;
    gsap: any;
    ScrollTrigger: any;
  }
}

// Create a stable counter outside React's lifecycle
let COUNTER = 0;
const getStableId = () => `stagger-cards-${++COUNTER}`;

export default function NxStaggerCardsAnimation({ 
  className = '',
  button = false,
  closeButton = false,
  triggerId: propTriggerId,
  ...props 
}: NxStaggerCardsAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isScriptsLoaded, setIsScriptsLoaded] = useState(false)
  const idRef = useRef<string | undefined>(undefined)
  
  if (!idRef.current) {
    idRef.current = propTriggerId || getStableId()
  }

  const handleTrigger = useCallback(() => {
    if (containerRef.current && window.moonMoonStagger) {
      // First reset the elements
      if (window.gsap) {
        window.gsap.set(containerRef.current.querySelectorAll('[data-stagger-item]'), {
          clearProps: 'all',
          opacity: 0,
          y: 50
        });
      }
      // Then trigger the animation
      setTimeout(() => {
        window.moonMoonStagger.initStaggerAnimation(containerRef.current);
      }, 100);
    }
  }, []);

  const handleClose = useCallback(() => {
    if (containerRef.current && window.ScrollTrigger) {
      // Kill any existing ScrollTrigger instances
      window.ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === containerRef.current) {
          st.kill();
        }
      });
      // Reset elements to their initial state
      if (window.gsap) {
        window.gsap.set(containerRef.current.querySelectorAll('[data-stagger-item]'), {
          clearProps: 'all',
          opacity: 0,
          y: 50
        });
      }
    }
  }, []);

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
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/CustomEase.min.js');
        await loadScript('https://cdn.jsdelivr.net/gh/Rakido/mm-animation-library@latest/js/mm-stagger-animation.js');
        
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsScriptsLoaded(true);

        if (containerRef.current && window.moonMoonStagger) {
          // Set initial state for button trigger
          if (button) {
            window.gsap.set(containerRef.current.querySelectorAll('[data-stagger-item]'), {
              opacity: 0,
              y: 50
            });
          } else {
            // Auto-initialize if not using button trigger
            window.moonMoonStagger.initStaggerAnimation(containerRef.current);
          }
        }
      } catch (error) {
        console.error('Error loading animation scripts:', error);
      }
    };

    initAnimation();
  }, [button]);

  return (
    <div className="nx-relative nx-w-full nx-overflow-hidden">
      <div className="nx-relative nx-my-8 nx-mx-auto nx-bg-gray-800 nx-rounded-xl nx-border nx-border-gray-700">
        <div className="nx-flex nx-justify-between nx-items-center nx-p-4 nx-border-b nx-border-gray-700">
          {button && (
            <button
              onClick={handleTrigger}
              className="nx-px-4 nx-py-2 nx-bg-white nx-text-gray-900 nx-rounded-lg nx-font-medium hover:nx-bg-gray-100 nx-transition-colors"
            >
              Trigger Animation
            </button>
          )}
          
          <div className="nx-flex nx-gap-2">
            {closeButton && (
              <button
                onClick={handleClose}
                className="nx-px-4 nx-py-2 nx-bg-gray-700 nx-text-white nx-rounded-lg nx-font-medium hover:nx-bg-gray-600 nx-transition-colors"
                aria-label="Close animation"
              >
                Close Animation
              </button>
            )}
            <NxReloadAnimation targetRef={containerRef} type="stagger" />
          </div>
        </div>
        
        <div 
          ref={containerRef}
          data-stagger-reveal="true"
          data-click-event={button ? "true" : undefined}
          id={idRef.current}
          className={`
            nx-w-full nx-space-y-4 nx-p-4
            ${className}
          `}
          style={{
            minWidth: 'fit-content',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center'
          }}
          {...props}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <div 
              key={index}
              data-stagger-item
              style={{
                width: '100px',
                height: '100px',
                backgroundColor: 'white',
                borderRadius: '10px',
                textAlign: 'center',
                lineHeight: '100px',
              }}
              className="
                nx-bg-white nx-w-[100px] nx-h-[100px] nx-rounded-lg nx-text-gray-900 nx-flex nx-items-center nx-justify-center
              "
            />
          ))}
        </div>
      </div>
    </div>
  )
} 