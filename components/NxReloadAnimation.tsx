import { useCallback } from 'react'

interface NxReloadAnimationProps {
  className?: string;
  targetRef: React.RefObject<HTMLElement>;
  type?: 'text' | 'stagger' | 'image';
  onReload?: () => void;
}

export default function NxReloadAnimation({ 
  className = '', 
  targetRef, 
  type = 'text',
  onReload 
}: NxReloadAnimationProps) {
  const handleReload = useCallback(() => {
    if (onReload) {
      onReload();
      return;
    }

    if (typeof window !== 'undefined' && targetRef.current) {
      switch(type) {
        case 'stagger':
          if (window.moonMoonStagger) {
            window.moonMoonStagger.initStaggerAnimation(targetRef.current);
          }
          break;
        case 'image':
          if (window.moonMoonImage) {
            window.moonMoonImage.initScrollImageReveal(targetRef.current);
          }
          break;
        default:
          if (window.moonMoonText) {
            window.moonMoonText.initTextAnimation(targetRef.current);
          }
      }
    }
  }, [targetRef, type, onReload]);

  return (
    <button
      onClick={handleReload}
      className={`
        nx-inline-flex nx-items-center nx-justify-center nx-p-3 
        nx-bg-gray-700 hover:nx-bg-gray-600 
        nx-text-white nx-shadow-lg hover:nx-shadow-xl 
        nx-rounded-xl hover:nx-scale-105
        nx-transition-all nx-duration-200
        nx-border-2 nx-border-gray-600
        ${className}
      `}
      aria-label="Reload Animation"
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
    </button>
  )
} 