import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'

const EASING_OPTIONS = {
  'power1.out': 'Power1.easeOut',
  'power2.out': 'Power2.easeOut',
  'power3.out': 'Power3.easeOut',
  'power4.out': 'Power4.easeOut',
  'back.out': 'Back.easeOut',
  'elastic.out': 'Elastic.easeOut',
  'bounce.out': 'Bounce.easeOut',
  'circ.out': 'Circ.easeOut',
  'expo.out': 'Expo.easeOut',
  'sine.out': 'Sine.easeOut'
};

const ANIMATION_OPTIONS = {
  'slide': 'Slide',
  'grid': 'Grid',
  'stripes': 'Stripes'
};

export default function NxImageRevealFreePlay() {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [key, setKey] = useState(0)
  
  // Form states
  const [animation, setAnimation] = useState('slide')
  const [axis, setAxis] = useState('y')
  const [easing, setEasing] = useState('power2.out')
  const [duration, setDuration] = useState(1)
  const [gridSize, setGridSize] = useState(8)
  const [stripesNumber, setStripesNumber] = useState(12)
  const [stripeColor, setStripeColor] = useState('#000000')
  const [staggerDirection, setStaggerDirection] = useState('start')

  const resetAndPlay = useCallback(() => {
    if (!window.moonMoonImage || !containerRef.current) return;

    // Start spin animation
    setIsSpinning(true);

    // Kill existing animations
    if (window.ScrollTrigger) {
      window.ScrollTrigger.getAll().forEach(st => st.kill());
    }

    // Force remount by updating key
    setKey(k => k + 1);

    // Stop spinning after animation should be complete
    setTimeout(() => setIsSpinning(false), 300);
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
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/CustomEase.min.js');
        await loadScript('https://cdn.jsdelivr.net/gh/Rakido/mm-animation-library@main/js/mm-image-reveal.js');
        setIsReady(true);
      } catch (error) {
        console.error('Error loading animation scripts:', error);
      }
    };

    loadScripts();
  }, []);

  // Initialize animation when ready or settings change
  useEffect(() => {
    if (!isReady || !window.moonMoonImage) return;
    
    const timer = setTimeout(() => {
      if (containerRef.current) {
        window.moonMoonImage.initScrollImageReveal(containerRef.current);
      }
    }, 100);
    
    return () => {
      clearTimeout(timer);
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach(st => st.kill());
      }
    };
  }, [isReady, key, animation, axis, easing, duration, gridSize, stripesNumber, stripeColor, staggerDirection]);

  return (
    <div className="nx-relative nx-w-full">
      <div className="nx-grid nx-grid-cols-2 nx-gap-8">
        <div>
          <div className="nx-relative nx-my-8 nx-mx-auto nx-bg-gray-800 nx-rounded-xl nx-border nx-border-gray-900">
            <div className="nx-absolute nx-top-4 nx-right-4 nx-z-10">
              <button
                onClick={resetAndPlay}
                className={`nx-p-2 nx-rounded-lg nx-bg-gray-700 hover:nx-bg-gray-600 nx-transition-colors ${
                  isSpinning ? 'nx-animate-spin' : ''
                }`}
                disabled={isSpinning}
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
            
            <div className="nx-p-8 reveal">
              <div 
                key={key}
                ref={containerRef}
                data-scroll-image-reveal="true"
                data-animate={animation}
                data-axis={axis}
                data-duration={duration}
                data-scroll-image-easing={easing}
                data-grid-size={gridSize}
                data-stripes-number={stripesNumber}
                data-stripe-color={stripeColor}
                data-stripes-stagger-direction={staggerDirection}
                className="reveal"
                style={{ visibility: isReady ? 'visible' : 'hidden' }}
              >
                <img 
                  src="/images/demo-1.jpg"
                  alt="Animation demo"
                  data-scroll-image-reveal-target="true"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="nx-space-y-4">
          {/* Controls */}
          <div className="nx-space-y-4">
            <div>
              <label className="nx-block nx-text-sm nx-font-medium nx-mb-1">Animation Type</label>
              <select 
                value={animation}
                onChange={(e) => setAnimation(e.target.value)}
                className="nx-block nx-w-full nx-rounded-md nx-border-gray-700 nx-bg-gray-800"
              >
                {Object.entries(ANIMATION_OPTIONS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="nx-block nx-text-sm nx-font-medium nx-mb-1">Axis</label>
              <select 
                value={axis}
                onChange={(e) => setAxis(e.target.value)}
                className="nx-block nx-w-full nx-rounded-md nx-border-gray-700 nx-bg-gray-800"
              >
                <option value="x">X</option>
                <option value="-x">-X</option>
                <option value="y">Y</option>
                <option value="-y">-Y</option>
              </select>
            </div>

            <div>
              <label className="nx-block nx-text-sm nx-font-medium nx-mb-1">Easing</label>
              <select 
                value={easing}
                onChange={(e) => setEasing(e.target.value)}
                className="nx-block nx-w-full nx-rounded-md nx-border-gray-700 nx-bg-gray-800"
              >
                {Object.entries(EASING_OPTIONS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="nx-block nx-text-sm nx-font-medium nx-mb-1">Duration (seconds)</label>
              <input 
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min="0.1"
                step="0.1"
                className="nx-block nx-w-full nx-rounded-md nx-border-gray-700 nx-bg-gray-800"
              />
            </div>

            {animation === 'grid' && (
              <div>
                <label className="nx-block nx-text-sm nx-font-medium nx-mb-1">Grid Size</label>
                <input 
                  type="number"
                  value={gridSize}
                  onChange={(e) => setGridSize(Number(e.target.value))}
                  min="1"
                  className="nx-block nx-w-full nx-rounded-md nx-border-gray-700 nx-bg-gray-800"
                />
              </div>
            )}

            {animation === 'stripes' && (
              <>
                <div>
                  <label className="nx-block nx-text-sm nx-font-medium nx-mb-1">Number of Stripes</label>
                  <input 
                    type="number"
                    value={stripesNumber}
                    onChange={(e) => setStripesNumber(Number(e.target.value))}
                    min="1"
                    className="nx-block nx-w-full nx-rounded-md nx-border-gray-700 nx-bg-gray-800"
                  />
                </div>

                <div>
                  <label className="nx-block nx-text-sm nx-font-medium nx-mb-1">Stripe Color</label>
                  <input 
                    type="color"
                    value={stripeColor}
                    onChange={(e) => setStripeColor(e.target.value)}
                    className="nx-block nx-w-full nx-rounded-md nx-border-gray-700 nx-bg-gray-800"
                  />
                </div>

                <div>
                  <label className="nx-block nx-text-sm nx-font-medium nx-mb-1">Stagger Direction</label>
                  <select 
                    value={staggerDirection}
                    onChange={(e) => setStaggerDirection(e.target.value)}
                    className="nx-block nx-w-full nx-rounded-md nx-border-gray-700 nx-bg-gray-800"
                  >
                    <option value="start">Start</option>
                    <option value="center">Center</option>
                    <option value="end">End</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 