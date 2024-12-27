import { useCallback } from 'react'

interface ReloadAnimationProps {
  className?: string;
}

export default function ReloadAnimation({ className = '' }: ReloadAnimationProps) {
  const handleReload = useCallback(() => {
    if (typeof window !== 'undefined' && window.moonMoonText) {
      window.moonMoonText.initTextAnimation();
    }
  }, []);

  return (
    <button
      onClick={handleReload}
      className={`
        inline-flex items-center justify-center p-3 
        bg-blue-500 hover:bg-blue-600 
        text-white shadow-lg hover:shadow-xl 
        rounded-xl transform hover:scale-105
        transition-all duration-200
        border-2 border-white/20
        ${className}
      `}
      aria-label="Reload Animation"
    >
      <svg 
        className="w-6 h-6" 
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