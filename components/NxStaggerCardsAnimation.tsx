import { useEffect, useRef } from 'react'
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
  // Initialize ref with undefined to fix TypeScript error
  const idRef = useRef<string | undefined>(undefined)
  
  // Initialize the ID only once
  if (!idRef.current) {
    idRef.current = propTriggerId || getStableId()
  }

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
        // Load dependencies first
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/CustomEase.min.js');
        await loadScript('https://cdn.jsdelivr.net/gh/Rakido/mm-animation-library@main/js/mm-stagger-animation.js');
        
        await new Promise(resolve => setTimeout(resolve, 100));

        if (containerRef.current && window.moonMoonStagger) {
          window.moonMoonStagger.initStaggerAnimation(containerRef.current);
        }
      } catch (error) {
        console.error('Error loading animation scripts:', error);
      }
    };

    initAnimation();

    // Add click event listener for the trigger button
    const triggerButton = document.querySelector(`[data-stagger-trigger="${idRef.current}"]`);
    const closeButton = document.querySelector(`[data-stagger-close="${idRef.current}"]`);

    const handleTrigger = () => {
      if (containerRef.current && window.moonMoonStagger) {
        window.moonMoonStagger.initStaggerAnimation(containerRef.current);
      }
    };

    const handleClose = () => {
      if (containerRef.current && window.ScrollTrigger) {
        // Kill all ScrollTrigger instances associated with this container
        window.ScrollTrigger.getAll().forEach(st => {
          if (st.vars.trigger === containerRef.current) {
            st.kill();
          }
        });
        // Reset any GSAP animations
        if (window.gsap) {
          window.gsap.set(containerRef.current.querySelectorAll('[data-stagger-item]'), {
            clearProps: 'all'
          });
        }
      }
    };

    if (triggerButton) {
      triggerButton.addEventListener('click', handleTrigger);
    }
    if (closeButton) {
      closeButton.addEventListener('click', handleClose);
    }

    return () => {
      // Remove event listeners
      if (triggerButton) {
        triggerButton.removeEventListener('click', handleTrigger);
      }
      if (closeButton) {
        closeButton.removeEventListener('click', handleClose);
      }

      // Cleanup ScrollTrigger
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach(st => {
          if (st.vars.trigger === containerRef.current) {
            st.kill();
          }
        });
      }
    };
  }, []);

  return (
    <div className="nx-relative nx-w-full nx-overflow-hidden">
      <div className="nx-relative nx-my-8 nx-mx-auto nx-bg-gray-800 nx-rounded-xl nx-border nx-border-gray-700">
        <div className="nx-flex nx-justify-between nx-items-center nx-p-4 nx-border-b nx-border-gray-700">
          {button && (
            <button
              data-stagger-trigger={idRef.current}
              className="nx-px-4 nx-py-2 nx-bg-white nx-text-gray-900 nx-rounded-lg nx-font-medium hover:nx-bg-gray-100 nx-transition-colors"
            >
              Trigger Animation
            </button>
          )}
          
          <div className="nx-flex nx-gap-2">
            {closeButton && (
              <button
                data-stagger-close={idRef.current}
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