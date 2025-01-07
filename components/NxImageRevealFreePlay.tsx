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

const STAGGER_METHODS = [
  { value: 'start', label: 'From Start' },
  { value: 'center', label: 'From Center' },
  { value: 'end', label: 'From End' },
  { value: 'random', label: 'Random' }
];

export default function NxImageRevealFreePlay() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [animation, setAnimation] = useState('grid')
  const [easing, setEasing] = useState('elastic.out(1, 0.3)')
  const [duration, setDuration] = useState('1')
  const [scrub, setScrub] = useState('false')
  const [gridCells, setGridCells] = useState('9')
  const [gridColumns, setGridColumns] = useState('3')
  const [gridColor, setGridColor] = useState('#000000')
  const [stripesNumber, setStripesNumber] = useState('6')
  const [stripeColor, setStripeColor] = useState('#000000')
  const [staggerDirection, setStaggerDirection] = useState('start')

  const replayAnimation = useCallback(() => {
    if (typeof window !== 'undefined' && window.moonMoonImage && containerRef.current) {
      setTimeout(() => {
        window.moonMoonImage.initScrollImageReveal(containerRef.current);
      }, 100);
    }
  }, []);

  // Function to generate random parameters
  const generateRandomParams = useCallback(() => {
    const randomAnimation = getRandomItem(['grid', 'stripes', 'shutter']);
    const randomMethod = getRandomItem(['start', 'center', 'end', 'random']);
    
    setAnimation(randomAnimation);
    setEasing('elastic.out(1, 0.3)');
    setDuration(getRandomNumber(0.5, 2));
    setScrub('false');
    setStaggerDirection(randomMethod);
    setGridCells(getRandomNumber(4, 16, 0));
    setGridColumns(getRandomNumber(2, 4, 0));
    setStripesNumber(getRandomNumber(4, 8, 0));
  }, []);

  // Helper function to get random item from array
  const getRandomItem = <T,>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)]
  }

  // Helper function to get random number between min and max
  const getRandomNumber = (min: number, max: number, decimals: number = 2): string => {
    return (Math.random() * (max - min) + min).toFixed(decimals)
  }

  // Initialize with random parameters and trigger animation
  useEffect(() => {
    const initializeAnimation = async () => {
      generateRandomParams();
      await new Promise(resolve => setTimeout(resolve, 200));
      replayAnimation();
    };

    initializeAnimation();
  }, [generateRandomParams, replayAnimation]);

  return (
    <div className="nx-relative nx-w-full">
      <div className="nx-relative nx-my-8 nx-mx-auto nx-max-w-6xl nx-bg-gray-800 nx-rounded-xl nx-border nx-border-gray-700">
        <div className="nx-grid nx-grid-cols-1 md:nx-grid-cols-2 nx-gap-0">
          {/* Animation Preview */}
          <div className="nx-relative nx-p-8 nx-min-h-[400px] nx-flex nx-items-center nx-justify-center nx-bg-gray-900">
            <div className="nx-absolute" style={{top: '1rem', right: '1rem', zIndex: 10}}>
              <NxReloadAnimation targetRef={containerRef} type="image" onReload={replayAnimation} />
            </div>
            
            <div className="nx-p-[100px] nx-flex nx-items-center nx-justify-center reveal">
              <div 
                ref={containerRef}
                data-scroll-image-reveal="true"
                data-animate={animation}
                data-easing={easing}
                data-duration={duration}
                data-scrub={scrub}
                data-grid-cells={animation === 'grid' ? gridCells : undefined}
                data-grid-columns={animation === 'grid' ? gridColumns : undefined}
                data-grid-color={animation === 'grid' ? gridColor : undefined}
                data-stripes-number={animation === 'stripes' ? stripesNumber : undefined}
                data-stripe-color={animation === 'stripes' ? stripeColor : undefined}
                data-grid-stagger-direction={animation === 'grid' ? staggerDirection : undefined}
                data-stripes-stagger-direction={animation === 'stripes' ? staggerDirection : undefined}
                className="reveal"
              >
                <img 
                  src="/images/demo-1.jpg"
                  alt="Animation demo"
                  data-scroll-image-reveal-target="true"
                />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="nx-p-8 nx-bg-gray-900 md:nx-rounded-r-xl nx-space-y-6">
            <h3 className="nx-text-lg nx-font-bold nx-text-white">Image Reveal Controls</h3>
            
            {/* Two Column Grid for Controls */}
            <div className="nx-grid nx-grid-cols-2 nx-gap-4">
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
                    <option value="grid">Grid</option>
                    <option value="stripes">Stripes</option>
                    <option value="shutter">Shutter</option>
                  </select>
                </div>

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

                {/* Grid specific controls */}
                {animation === 'grid' && (
                  <>
                    <div className="nx-space-y-2">
                      <label className="nx-block nx-text-sm nx-font-medium nx-text-gray-400">Grid Cells</label>
                      <input
                        type="number"
                        value={gridCells}
                        onChange={(e) => setGridCells(e.target.value)}
                        className="nx-w-full nx-p-2 nx-rounded nx-bg-gray-800 nx-text-white nx-border nx-border-gray-700 focus:nx-border-blue-500 focus:nx-ring-1 focus:nx-ring-blue-500"
                        min="4"
                      />
                    </div>
                    <div className="nx-space-y-2">
                      <label className="nx-block nx-text-sm nx-font-medium nx-text-gray-400">Grid Columns</label>
                      <input
                        type="number"
                        value={gridColumns}
                        onChange={(e) => setGridColumns(e.target.value)}
                        className="nx-w-full nx-p-2 nx-rounded nx-bg-gray-800 nx-text-white nx-border nx-border-gray-700 focus:nx-border-blue-500 focus:nx-ring-1 focus:nx-ring-blue-500"
                        min="2"
                      />
                    </div>
                    <div className="nx-space-y-2">
                      <label className="nx-block nx-text-sm nx-font-medium nx-text-gray-400">Grid Color</label>
                      <input
                        type="color"
                        value={gridColor}
                        onChange={(e) => setGridColor(e.target.value)}
                        className="nx-w-full nx-p-2 nx-rounded nx-bg-gray-800 nx-text-white nx-border nx-border-gray-700 focus:nx-border-blue-500 focus:nx-ring-1 focus:nx-ring-blue-500"
                      />
                    </div>
                  </>
                )}

                {/* Stripes specific controls */}
                {animation === 'stripes' && (
                  <>
                    <div className="nx-space-y-2">
                      <label className="nx-block nx-text-sm nx-font-medium nx-text-gray-400">Number of Stripes</label>
                      <input
                        type="number"
                        value={stripesNumber}
                        onChange={(e) => setStripesNumber(e.target.value)}
                        className="nx-w-full nx-p-2 nx-rounded nx-bg-gray-800 nx-text-white nx-border nx-border-gray-700 focus:nx-border-blue-500 focus:nx-ring-1 focus:nx-ring-blue-500"
                        min="2"
                      />
                    </div>
                    <div className="nx-space-y-2">
                      <label className="nx-block nx-text-sm nx-font-medium nx-text-gray-400">Stripe Color</label>
                      <input
                        type="color"
                        value={stripeColor}
                        onChange={(e) => setStripeColor(e.target.value)}
                        className="nx-w-full nx-p-2 nx-rounded nx-bg-gray-800 nx-text-white nx-border nx-border-gray-700 focus:nx-border-blue-500 focus:nx-ring-1 focus:nx-ring-blue-500"
                      />
                    </div>
                  </>
                )}
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

                {/* Scrub */}
                <div className="nx-space-y-2">
                  <label className="nx-block nx-text-sm nx-font-medium nx-text-gray-400">Scrub</label>
                  <select
                    value={scrub}
                    onChange={(e) => setScrub(e.target.value)}
                    className="nx-w-full nx-p-2 nx-rounded nx-bg-gray-800 nx-text-white nx-border nx-border-gray-700 focus:nx-border-blue-500 focus:nx-ring-1 focus:nx-ring-blue-500"
                  >
                    <option value="false">Off</option>
                    <option value="true">On</option>
                  </select>
                </div>

                {/* Stagger Direction */}
                {(animation === 'grid' || animation === 'stripes') && (
                  <div className="nx-space-y-2">
                    <label className="nx-block nx-text-sm nx-font-medium nx-text-gray-400">Stagger Direction</label>
                    <select
                      value={staggerDirection}
                      onChange={(e) => setStaggerDirection(e.target.value)}
                      className="nx-w-full nx-p-2 nx-rounded nx-bg-gray-800 nx-text-white nx-border nx-border-gray-700 focus:nx-border-blue-500 focus:nx-ring-1 focus:nx-ring-blue-500"
                    >
                      {STAGGER_METHODS.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Randomize Button */}
                <button
                  onClick={() => {
                    generateRandomParams();
                    setTimeout(replayAnimation, 100);
                  }}
                  className="nx-w-full nx-mt-4 nx-p-3 nx-bg-white hover:nx-bg-gray-100 nx-text-gray-900 nx-rounded-lg nx-transition-all nx-duration-200 nx-flex nx-items-center nx-justify-center nx-gap-2 nx-shadow-lg hover:nx-shadow-xl hover:nx-scale-[1.02] nx-font-medium"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 