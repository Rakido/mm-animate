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

// Helper function to generate unique IDs
const generateUniqueId = () => `stagger-cards-${Math.random().toString(36).substr(2, 9)}`;

export default function NxStaggerCardsAnimation({ 
  className = '',
  button = false,
  closeButton = false,
  triggerId: propTriggerId,
  ...props 
}: NxStaggerCardsAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // Generate a unique ID if none is provided
  const triggerId = useRef(propTriggerId || generateUniqueId())

  useEffect(() => {
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Remove any existing script with this src
        const existingScript = document.querySelector(`script[src*="mm-stagger-animation.js"]`);
        if (existingScript) {
          existingScript.remove();
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        script.onload = () => {
          // Reset the global instance
          if (window.moonMoonStagger) {
            delete window.moonMoonStagger;
          }
          resolve();
        };
        script.onerror = (error) => reject(error);
        document.body.appendChild(script);
      });
    };

    const initAnimation = async () => {
      try {
        // Load dependencies
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/CustomEase.min.js');
        
        // Force reload the stagger animation library from jsDelivr
        await loadScript('https://cdn.jsdelivr.net/gh/Rakido/mm-animation-library@main/js/mm-stagger-animation.js');
        
        // Wait a bit for initialization
        await new Promise(resolve => setTimeout(resolve, 100));

        if (window.moonMoonStagger && containerRef.current) {
          window.moonMoonStagger.initStaggerAnimation(containerRef.current);
        }
      } catch (error) {
        console.error('Error loading animation scripts:', error);
      }
    };

    initAnimation();

    return () => {
      // Cleanup
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach(st => {
          if (st.vars.trigger === containerRef.current) {
            st.kill();
          }
        });
      }
      // Clean up the script tag
      const scriptTag = document.querySelector(`script[src*="mm-stagger-animation.js"]`);
      if (scriptTag) {
        scriptTag.remove();
      }
    };
  }, []);

  return (
    <div className="nx-relative nx-w-full nx-overflow-hidden">
      <div className="nx-relative nx-my-8 nx-mx-auto nx-bg-gray-800 nx-rounded-xl nx-border nx-border-gray-700">
        <div className="nx-flex nx-justify-between nx-items-center nx-p-4 nx-border-b nx-border-gray-700">
          {button && (
            <button
              data-stagger-trigger={triggerId.current}
              className="nx-px-4 nx-py-2 nx-bg-white nx-text-gray-900 nx-rounded-lg nx-font-medium hover:nx-bg-gray-100 nx-transition-colors"
            >
              Trigger Animation
            </button>
          )}
          
          <div className="nx-flex nx-gap-2">
            {closeButton && (
              <button
                data-stagger-close={triggerId.current}
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
          id={triggerId.current}
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