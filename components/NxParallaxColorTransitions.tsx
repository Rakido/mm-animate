import { useEffect, useRef, useState } from 'react'

interface NxParallaxColorTransitionsProps {
  color: string; // Single color for the container
  className?: string;
}

export default function NxParallaxColorTransitions({ 
  color,
  className = ''
}: NxParallaxColorTransitionsProps) {
  const [isReady, setIsReady] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptsRef = useRef<HTMLScriptElement[]>([])

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
        scriptsRef.current.push(script);
      });
    };

    const initAnimation = async () => {
      try {
        if (!window.gsap) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        if (!window.ScrollTrigger) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (window.gsap && window.ScrollTrigger && containerRef.current) {
          window.gsap.registerPlugin(window.ScrollTrigger);
          
          const sections = containerRef.current.querySelectorAll('.color-section');
          sections.forEach((section, i) => {
            window.gsap.to(section, {
              backgroundColor: color,
              scrollTrigger: {
                trigger: section,
                start: "top center",
                end: "bottom center",
                scrub: true,
              }
            });
          });
          
          setIsReady(true);
        }
      } catch (error) {
        console.error('Error loading animation scripts:', error);
      }
    };

    initAnimation();

    return () => {
      scriptsRef.current.forEach(script => {
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
      scriptsRef.current = [];

      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach(st => st.kill());
      }
    };
  }, [color]);

  return (
    <section 
      ref={containerRef}
      data-parallax
      data-parallax-color={color}
      style={{ 
        height: '100vh',
        overflow: 'hidden',
        visibility: isReady ? 'visible' : 'hidden'
      }}
    >
      <div className="relative h-full">
        <h2 className="relative z-10">Section</h2>
      </div>
    </section>
  );
} 