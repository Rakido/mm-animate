import { useEffect, useRef } from 'react'
import NxReloadAnimation from './NxReloadAnimation'

interface NxStaggerMixingProps {
  className?: string;
  [key: string]: any;
}

export default function NxStaggerMixing({ 
  className = '',
  ...props 
}: NxStaggerMixingProps) {
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
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/CustomEase.min.js');
        await loadScript('https://cdn.jsdelivr.net/gh/Rakido/mm-animation-library@main/js/mm-stagger-animation.js');

        if (window.moonMoonStagger && containerRef.current) {
          window.moonMoonStagger.initStaggerAnimation(containerRef.current);
        }
      } catch (error) {
        console.error('Error loading animation scripts:', error);
      }
    };

    initAnimation();
  }, []);

  return (
    <div className="nx-relative nx-w-full">
      <div className="nx-relative nx-my-8 nx-mx-auto nx-max-w-4xl nx-bg-gray-800 nx-rounded-xl nx-border nx-border-gray-700">
        <div className="nx-absolute nx-top-4 nx-right-4 nx-z-10">
          <NxReloadAnimation targetRef={containerRef} type="stagger" />
        </div>
        
        <div 
          ref={containerRef}
          data-stagger-reveal="true"
          data-stagger="0.1"
          className={`nx-p-8 ${className}`}
          {...props}
        >
          <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h1>Hello world</h1>
            <div 
              style={{ width: '100%', height: '2px', backgroundColor: 'white' }}
              data-scale="0.0" 
              data-scale-axis="x" 
              data-scale-position="left"
            />
            <h1>Hello world</h1>
            <div 
              style={{ width: '100%', height: '2px', backgroundColor: 'white' }}
              data-scale="0.0" 
              data-scale-axis="x" 
              data-scale-position="left"
            />
            <h1>Hello world</h1>
            <div 
              style={{ width: '100%', height: '2px', backgroundColor: 'white' }}
              data-scale="0.0" 
              data-scale-axis="x" 
              data-scale-position="left"
            />
            <h1>Hello world</h1>
            <div 
              style={{ width: '100%', height: '2px', backgroundColor: 'white' }}
              data-scale="0.0" 
              data-scale-axis="x" 
              data-scale-position="left"
            />
          </section>
        </div>
      </div>
    </div>
  )
} 