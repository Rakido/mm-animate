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

export default function NxFreePlay() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [text, setText] = useState('Type something')
  const [easing, setEasing] = useState('elastic.out(1, 0.3)')
  const [animation, setAnimation] = useState('fade-in')
  const [splitting, setSplitting] = useState('words')
  const [stagger, setStagger] = useState('0.1')
  const [duration, setDuration] = useState('1')
  const [rotate, setRotate] = useState('0')
  const [delay, setDelay] = useState('0')
  const [axis, setAxis] = useState('x')
  const [fontSize, setFontSize] = useState('40')

  const replayAnimation = useCallback(() => {
    if (typeof window !== 'undefined' && window.moonMoonText && containerRef.current) {
      setTimeout(() => {
        window.moonMoonText.initTextAnimation(containerRef.current);
      }, 100);
    }
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      replayAnimation();
    }
  }, [replayAnimation]);

  // Helper function to get random item from array
  const getRandomItem = <T,>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)]
  }

  // Helper function to get random number between min and max
  const getRandomNumber = (min: number, max: number, decimals: number = 2): string => {
    return (Math.random() * (max - min) + min).toFixed(decimals)
  }

  // Function to generate random parameters
  const generateRandomParams = useCallback(() => {
    const randomText = getRandomItem([
      "Un Voyage dans la Lune",
      "La Lune nous Observe",
      "Clair de Lune Magique",
      "Danse avec les Étoiles",
      "Au Clair de la Lune",
      "L'Astre de la Nuit",
      "Poussière d'Étoiles",
      "Rêves Lunaires",
      "Eclipse Enchantée",
      "Phases de Lune",
      "Voyage Cosmique",
      "Magie Céleste"
    ])

    const randomSplitting = getRandomItem(['chars', 'words'])
    const randomAnimation = getRandomItem(['fade-in', 'slide', 'shutter-word', 'scale'])
    const randomAxis = getRandomItem(['x', 'x-', 'y', 'y-'])
    
    // Always use elastic.out for easing and keep delay at 0
    setEasing('elastic.out(1, 0.3)')
    setText(randomText)
    setSplitting(randomSplitting)
    setAnimation(randomAnimation)
    setAxis(randomAxis)
    setStagger(getRandomNumber(0.01, 0.1))
    setDuration(getRandomNumber(0, 3))
    setRotate(getRandomNumber(-40, 40))
    setDelay('0')
  }, []);

  // Initialize with random parameters and trigger animation
  useEffect(() => {
    const initializeAnimation = async () => {
      // First, generate random parameters
      generateRandomParams();
      
      // Wait for a moment to ensure parameters are set
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Then trigger the animation
      replayAnimation();
    };

    initializeAnimation();
  }, [generateRandomParams, replayAnimation]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.CustomEase) {
      // Register custom easing curves
      Object.entries(EASING_OPTIONS['Custom Curves']).forEach(([name, path]) => {
        const safeName = name.toLowerCase().replace(/\s+/g, '-');
        window.CustomEase.create(safeName, path as string);
      });
    }
  }, []);

  const handleExportHTML = useCallback(() => {
    const attributes = {
      'data-scroll-text-reveal': 'true',
      'data-splitting': splitting,
      'data-animate': animation,
      'data-easing': easing,
      'data-stagger': stagger,
      'data-duration': duration,
      'data-rotate': rotate,
      'data-delay': delay,
      'data-axis': animation === 'slide' ? axis.charAt(0) : undefined,
      'data-axis-value': animation === 'slide' ? (axis.includes('-') ? '-100%' : '100%') : undefined,
      'data-color': animation === 'shutter-word' ? 'white' : undefined
    };

    const htmlCode = `<div ${formatHTMLAttributes(attributes)}>\n  ${text}\n</div>`;
    
    navigator.clipboard.writeText(htmlCode).then(() => {
      alert('HTML code copied to clipboard!');
    });
  }, [text, splitting, animation, easing, stagger, duration, rotate, delay, axis]);

  return (
    <div className="nx-relative nx-w-full" onKeyDown={handleKeyPress}>
      <div className="nx-relative nx-my-8 nx-mx-auto nx-max-w-6xl nx-bg-gray-800 nx-rounded-xl nx-border nx-border-gray-700"
      style={{
        overflow: 'hidden',
      }}
      >
        <div className="nx-grid nx-grid-cols-1 md:nx-grid-cols-2 nx-gap-0">
          {/* Animation Preview */}
          <div className="nx-relative nx-p-8 nx-min-h-[400px] nx-flex nx-items-center nx-justify-center nx-bg-gray-900">
            {/* Title and Font Size Control */}
            <div className="nx-absolute nx-top-4 nx-left-4 nx-right-16 nx-flex nx-items-center nx-gap-4" style={{position: 'absolute', right: '16px',  bottom: '0px', display: 'flex', flexDirection: 'row', gap: '16px'}}>
              <div className="nx-flex nx-items-center nx-gap-2 nx-flex-1">
                <span className="nx-text-sm nx-text-gray-400">Font Size</span>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="nx-w-full nx-h-2 nx-bg-gray-700 nx-rounded-lg nx-appearance-none cursor-pointer"
                />
                <span className="nx-text-sm nx-text-gray-400 nx-w-8">{fontSize}px</span>
              </div>
            </div>

            {/* Reload Button Wrapper */}
            <div className="nx-absolute" style={{top: '1rem', right: '1rem', zIndex: 10}}>
              <NxReloadAnimation targetRef={containerRef} />
            </div>
            
            {/* Text Output */}
            <div 
              ref={containerRef}
              data-scroll-text-reveal="true"
              data-splitting={splitting}
              data-animate={animation}
              data-easing={easing}
              data-stagger={stagger}
              data-duration={duration}
              data-rotate={rotate}
              data-delay={delay}
              data-axis={animation === 'slide' ? axis.charAt(0) : undefined}
              data-axis-value={animation === 'slide' ? (axis.includes('-') ? '-100%' : '100%') : undefined}
              data-color={animation === 'shutter-word' ? 'white' : undefined}
              className="nx-font-bold nx-text-white nx-tracking-tight nx-text-center"
              style={{ fontSize: `${fontSize}px` }}
            >
              {text}
            </div>
          </div>

          {/* Controls */}
          <div className="nx-p-8 nx-bg-gray-900 md:nx-rounded-r-xl nx-space-y-6">
            <h3 className="nx-text-lg nx-font-bold nx-text-white">Animation Controls</h3>
            
            {/* Text Input - Full Width */}
            <div className="nx-space-y-2">
              <label className="nx-block nx-text-sm nx-font-medium nx-text-gray-400">
                Text (press Enter to replay)
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyPress}
                className="nx-w-full nx-p-2 nx-rounded nx-bg-gray-800 nx-text-white nx-border nx-border-gray-700 focus:nx-border-blue-500 focus:nx-ring-1 focus:nx-ring-blue-500"
                placeholder="Type something"
              />
            </div>

            {/* Two Column Grid for Controls */}
            <div className="nx-grid nx-grid-cols-2 nx-gap-4" style={{marginTop: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px'}}>
              {/* Left Column */}
              <div className="nx-space-y-4" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                {/* Splitting Type */}
                <div className="nx-space-y-2">
                  <label className="nx-block nx-text-sm nx-font-medium nx-text-gray-400">Split Text By</label>
                  <select
                    value={splitting}
                    onChange={(e) => setSplitting(e.target.value)}
                    className="nx-w-full nx-p-2 nx-rounded nx-bg-gray-800 nx-text-white nx-border nx-border-gray-00 focus:nx-border-blue-500 focus:nx-ring-1 focus:nx-ring-blue-500"
                  >
                    <option value="chars">Characters</option>
                    <option value="words">Words</option>
                  </select>
                </div>

                {/* Animation Type */}
                <div className="nx-space-y-2">
                  <label className="nx-block nx-text-sm nx-font-medium nx-text-gray-400">Animation Type</label>
                  <select
                    value={animation}
                    onChange={(e) => setAnimation(e.target.value)}
                    className="nx-w-full nx-p-2 nx-rounded nx-bg-white-800 nx-text-white nx-border nx-border-gray-700 focus:nx-border-blue-500 focus:nx-ring-1 focus:nx-ring-blue-500"
                  >
                    <option value="fade-in">Fade In</option>
                    <option value="slide">Slide</option>
                    <option value="shutter-word">Shutter Word</option>
                  </select>
                </div>

                {/* Conditional Axis Selector */}
                {animation === 'slide' && (
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
                    max="5"
                  />
                </div>

                {/* Delay */}
                <div className="nx-space-y-2">
                  <label className="nx-block nx-text-sm nx-font-medium nx-text-gray-400">Delay (s)</label>
                  <input
                    type="number"
                    value={delay}
                    onChange={(e) => setDelay(e.target.value)}
                    className="nx-w-full nx-p-2 nx-rounded nx-bg-gray-800 nx-text-white nx-border nx-border-gray-700 focus:nx-border-blue-500 focus:nx-ring-1 focus:nx-ring-blue-500"
                    step="0.1"
                    min="0"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="nx-space-y-4" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
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
                            {name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
                    step="0.01"
                    min="0"
                    max="1"
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
                    min="-180"
                    max="180"
                  />
                </div>

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

                {/* Export HTML Button */}
                <button
                  onClick={handleExportHTML}
                  className="nx-w-full nx-mt-4 nx-p-3 nx-bg-gray-800 hover:nx-bg-gray-700 nx-text-white nx-rounded-lg nx-transition-all nx-duration-200 nx-flex nx-items-center nx-justify-center nx-gap-2 nx-shadow-lg hover:nx-shadow-xl hover:nx-scale-[1.02] nx-font-medium nx-border nx-border-gray-700"
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
    </div>
  )
} 