import { useState, useRef, useCallback, useEffect } from 'react'
import NxReloadAnimation from './NxReloadAnimation'

const EASING_OPTIONS = {
  'GSAP Defaults': {
    'Power1 Out': 'power1.out',
    'Power2 Out': 'power2.out',
    'Power3 Out': 'power3.out',
    'Power4 Out': 'power4.out'
  },
  'Bounce & Elastic': {
    'Bounce Out': 'bounce.out',
    'Elastic Out': 'elastic.out(1, 0.3)',
    'Back Out': 'back.out(1.7)'
  },
  'Custom Curves': {
    'Moon Bounce': 'M0,0 C0.791,0.232 0.04,0.737 0.212,0.885 0.42,1.065 0.779,1.011 1,0.824',
    'Slow Start': 'M0,0 C0.02,0.2 0.4,0.8 1,1',
    'Quick Pause': 'M0,0 C0.4,0 0.5,0.8 1,1',
    'Double Jump': 'M0,0 C0.5,0.5 0.7,0.1 0.8,0.8 0.9,1 1,1 1,1',
    'Smooth Bounce': 'M0,0 C0.3,1 0.7,0.5 1,1',
    'Elastic Snap': 'M0,0 C0.2,0 0.4,1.6 0.6,0.8 0.8,0.2 1,1 1,1'
  }
}

const formatHTMLAttributes = (attributes: Record<string, string | undefined>) => {
  return Object.entries(attributes)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
}

const STAGGER_METHODS = [
  { value: 'start', label: 'From Start' },
  { value: 'center', label: 'From Center' },
  { value: 'end', label: 'From End' },
  { value: 'random', label: 'Random' }
];

export default function NxStaggerFreePlay() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [easing, setEasing] = useState('elastic.out(1, 0.3)')
  const [animation, setAnimation] = useState('fade-in')
  const [stagger, setStagger] = useState('0.1')
  const [duration, setDuration] = useState('1')
  const [rotate, setRotate] = useState('0')
  const [delay, setDelay] = useState('0')
  const [axis, setAxis] = useState('x')
  const [scale, setScale] = useState('1')
  const [distance, setDistance] = useState('100')
  const [staggerMethod, setStaggerMethod] = useState('start')

  const replayAnimation = useCallback(() => {
    if (typeof window !== 'undefined' && window.moonMoonStagger && containerRef.current) {
      setTimeout(() => {
        window.moonMoonStagger.initStaggerAnimation(containerRef.current);
      }, 100);
    }
  }, []);

  // Function to generate random parameters
  const generateRandomParams = useCallback(() => {
    const randomAnimation = getRandomItem(['fade-in', 'slide', 'scale']);
    const randomAxis = getRandomItem(['x', 'x-', 'y', 'y-']);
    const randomMethod = getRandomItem(['start', 'center', 'end', 'random']);
    
    setEasing('elastic.out(1, 0.3)');
    setAnimation(randomAnimation);
    setAxis(randomAxis);
    setStaggerMethod(randomMethod);
    setStagger(getRandomNumber(0.01, 0.4));
    setDuration(getRandomNumber(0, 2));
    setRotate(getRandomNumber(-45, 45));
    setScale(getRandomNumber(0.5, 1.5));
    setDelay('0');
  }, []);

  // Helper function to get random item from array
  const getRandomItem = <T,>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)]
  }

  // Helper function to get random number between min and max
  const getRandomNumber = (min: number, max: number, decimals: number = 2): string => {
    return (Math.random() * (max - min) + min).toFixed(decimals)
  }

  const handleExportHTML = useCallback(() => {
    const attributes = {
      'data-stagger-reveal': 'true',
      'data-animate': animation,
      'data-easing': easing,
      'data-stagger': stagger,
      'data-stagger-method': staggerMethod,
      'data-duration': duration,
      'data-rotate': rotate,
      'data-delay': delay,
      'data-axis': animation === 'slide' ? axis.charAt(0) : undefined,
      'data-axis-value': animation === 'slide' ? (axis.includes('-') ? '-100%' : '100%') : undefined,
      'data-scale': scale !== '1' ? scale : undefined
    };

    const itemHtml = `  <div data-stagger-item class="stagger-item">Item</div>\n`.repeat(5);
    const htmlCode = `<div ${formatHTMLAttributes(attributes)}>\n${itemHtml}</div>`;
    
    navigator.clipboard.writeText(htmlCode).then(() => {
      alert('HTML code copied to clipboard!');
    });
  }, [animation, easing, stagger, duration, rotate, delay, axis, scale, staggerMethod]);

  // Add useEffect to trigger initial animation
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (window.moonMoonStagger && containerRef.current) {
        window.moonMoonStagger.initStaggerAnimation(containerRef.current);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array to run only once on mount

  return (
    <div className="nx-relative nx-w-full">
      <div className="nx-relative nx-my-8 nx-mx-auto nx-max-w-6xl nx-bg-gray-800 nx-rounded-xl nx-border nx-border-gray-700"
      style={{
        overflow: 'hidden',
      }}
      >
        <div className="nx-grid nx-grid-cols-1 md:nx-grid-cols-2 nx-gap-0">
          {/* Animation Preview */}
          <div className="nx-relative nx-p-8 nx-min-h-[400px] nx-flex nx-items-center nx-justify-center nx-bg-gray-900">
            <div className="nx-absolute" style={{top: '1rem', right: '1rem', zIndex: 10}}>
              <NxReloadAnimation targetRef={containerRef} type="stagger" />
            </div>
            
            <div 
              ref={containerRef}
              data-stagger-reveal="true"
              data-animate={animation}
              data-easing={easing}
              data-stagger={stagger}
              data-stagger-method={staggerMethod}
              data-duration={duration}
              data-rotate={rotate}
              data-delay={delay}
              data-direction={animation === 'slide' ? axis.charAt(0) : undefined}
              data-distance={animation === 'slide' ? distance : undefined}
              data-scale={scale !== '1' ? scale : undefined}
              className="nx-w-full nx-space-y-4"
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
              }}
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <div 
                  key={index}
                  data-stagger-item
                  className="nx-bg-white nx-w-[100px] nx-h-[100px] nx-rounded-lg nx-text-gray-900 nx-flex nx-items-center nx-justify-center"
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    textAlign: 'center',
                    lineHeight: '100px',
                  }}
                >
                  
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="nx-p-8 nx-bg-gray-900 md:nx-rounded-r-xl nx-space-y-6">
            <h3 className="nx-text-lg nx-font-bold nx-text-white">Stagger Controls</h3>
            
            {/* Two Column Grid for Controls */}
            <div className="nx-grid nx-grid-cols-2 nx-gap-4" style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
              {/* Left Column */}
              <div className="nx-space-y-4">
                {/* Animation Type */}
                <div className="nx-space-y-2">
                  <label className="nx-block nx-text-sm nx-font-medium nx-text-gray-400">Animation Type</label>
                  <select
                    value={animation}
                    onChange={(e) => setAnimation(e.target.value)}
                    className="nx-w-full nx-p-2 nx-rounded nx-bg-gray-800 nx-text-white nx-border nx-border-gray-700 focus:nx-border-blue-500 focus:nx-ring-1 focus:nx-ring-blue-500"
                  >
                    <option value="fade-in">Fade In</option>
                    <option value="slide">Slide</option>
                    <option value="scale">Scale</option>
                  </select>
                </div>

                {/* Conditional Axis Selector */}
                {animation === 'slide' && (
                  <>
                    <div className="nx-space-y-2">
                      <label className="nx-block nx-text-sm nx-font-medium nx-text-gray-400">Slide Direction</label>
                      <select
                        value={axis}
                        onChange={(e) => setAxis(e.target.value)}
                        className="nx-w-full nx-p-2 nx-rounded nx-bg-gray-800 nx-text-white nx-border nx-border-gray-700 focus:nx-border-blue-500 focus:nx-ring-1 focus:nx-ring-blue-500"
                      >
                        <option value="x">From Right</option>
                        <option value="x-">From Left</option>
                        <option value="y">From Bottom</option>
                        <option value="y-">From Top</option>
                      </select>
                    </div>

                    <div className="nx-space-y-2">
                      <label className="nx-block nx-text-sm nx-font-medium nx-text-gray-400">Distance (px)</label>
                      <input
                        type="number"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        className="nx-w-full nx-p-2 nx-rounded nx-bg-gray-800 nx-text-white nx-border nx-border-gray-700 focus:nx-border-blue-500 focus:nx-ring-1 focus:nx-ring-blue-500"
                        step="10"
                        min="0"
                        max="500"
                      />
                    </div>
                  </>
                )}

                {/* Duration */}
                <div className="nx-space-y-2">
                  <label className="nx-block nx-text-sm nx-font-medium nx-text-gray-400">Duration (s)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="nx-w-full nx-p-2 nx-rounded nx-bg-gray-800 nx-text-white nx-border nx-border-gray-700 focus:nx-border-blue-500 focus:nx-ring-1 focus:nx-ring-blue-500"
                    step="0.1"
                    min="0"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="nx-space-y-4">
                {/* Easing */}
                <div className="nx-space-y-2">
                  <label className="nx-block nx-text-sm nx-font-medium nx-text-gray-400">Easing</label>
                  <select
                    value={easing}
                    onChange={(e) => setEasing(e.target.value)}
                    className="nx-w-full nx-p-2 nx-rounded nx-bg-gray-800 nx-text-white nx-border nx-border-gray-700 focus:nx-border-blue-500 focus:nx-ring-1 focus:nx-ring-blue-500"
                  >
                    {Object.entries(EASING_OPTIONS).map(([category, easings]) => (
                      <optgroup label={category} key={category}>
                        {Object.entries(easings).map(([name, value]) => (
                          <option key={name} value={value}>
                            {name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* Stagger */}
                <div className="nx-space-y-2">
                  <label className="nx-block nx-text-sm nx-font-medium nx-text-gray-400">Stagger (s)</label>
                  <input
                    type="number"
                    value={stagger}
                    onChange={(e) => setStagger(e.target.value)}
                    className="nx-w-full nx-p-2 nx-rounded nx-bg-gray-800 nx-text-white nx-border nx-border-gray-700 focus:nx-border-blue-500 focus:nx-ring-1 focus:nx-ring-blue-500"
                    step="0.1"
                    min="0"
                  />
                </div>

                {/* Scale */}
                <div className="nx-space-y-2">
                  <label className="nx-block nx-text-sm nx-font-medium nx-text-gray-400">Scale</label>
                  <input
                    type="number"
                    value={scale}
                    onChange={(e) => setScale(e.target.value)}
                    className="nx-w-full nx-p-2 nx-rounded nx-bg-gray-800 nx-text-white nx-border nx-border-gray-700 focus:nx-border-blue-500 focus:nx-ring-1 focus:nx-ring-blue-500"
                    step="0.1"
                    min="0"
                    max="2"
                  />
                </div>

                {/* Rotation */}
                <div className="nx-space-y-2">
                  <label className="nx-block nx-text-sm nx-font-medium nx-text-gray-400">Rotation (deg)</label>
                  <input
                    type="number"
                    value={rotate}
                    onChange={(e) => setRotate(e.target.value)}
                    className="nx-w-full nx-p-2 nx-rounded nx-bg-gray-800 nx-text-white nx-border nx-border-gray-700 focus:nx-border-blue-500 focus:nx-ring-1 focus:nx-ring-blue-500"
                    step="1"
                  />
                </div>

                {/* Stagger Method */}
                <div className="nx-space-y-2">
                  <label className="nx-block nx-text-sm nx-font-medium nx-text-gray-400">Stagger Method</label>
                  <select
                    value={staggerMethod}
                    onChange={(e) => setStaggerMethod(e.target.value)}
                    className="nx-w-full nx-p-2 nx-rounded nx-bg-gray-800 nx-text-white nx-border nx-border-gray-700 focus:nx-border-blue-500 focus:nx-ring-1 focus:nx-ring-blue-500"
                  >
                    {STAGGER_METHODS.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="nx-grid nx-grid-cols-2 nx-gap-4 nx-mt-6">
              <button
                onClick={() => {
                  generateRandomParams();
                  setTimeout(replayAnimation, 100);
                }}
                className="nx-w-full nx-p-3 nx-bg-white hover:nx-bg-gray-100 nx-text-gray-900 nx-rounded-lg nx-transition-all nx-duration-200 nx-flex nx-items-center nx-justify-center nx-gap-2 nx-shadow-lg hover:nx-shadow-xl hover:nx-scale-[1.02] nx-font-medium"
              >
                <svg 
                  className="nx-w-5 nx-h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
                Randomize
              </button>

              <button
                onClick={handleExportHTML}
                className="nx-w-full nx-p-3 nx-bg-gray-800 hover:nx-bg-gray-700 nx-text-white nx-rounded-lg nx-transition-all nx-duration-200 nx-flex nx-items-center nx-justify-center nx-gap-2 nx-shadow-lg hover:nx-shadow-xl hover:nx-scale-[1.02] nx-font-medium nx-border nx-border-gray-700"
              >
                <svg 
                  className="nx-w-5 nx-h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
                  />
                </svg>
                Export HTML
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 