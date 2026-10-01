import React, { useEffect, useRef, useState, useCallback } from 'react';

export interface GlyphAnnotation {
  char: string;
  label: string;
  sub?: string;
}

export interface GlyphPortalProps {
  word: string;
  focusChar?: string;
  interactive?: boolean;
  background?: React.ReactNode;
  front?: React.ReactNode;
  children?: React.ReactNode;
  scrollLength?: number; // in pixels or vh multiplier
  fontFamily?: string;
  fontWeight?: string | number;
  annotations?: GlyphAnnotation[];
  enterLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  onProgress?: (progress: number) => void;
  onLetterClick?: (index: number, letter: string) => void;
  onEnterClick?: () => void;
}

export const GlyphPortal: React.FC<GlyphPortalProps> = ({
  word = 'HARSHU',
  focusChar = 'R',
  interactive = true,
  background,
  front,
  children,
  scrollLength = 1500,
  fontFamily = 'Plus Jakarta Sans, system-ui, sans-serif',
  fontWeight = 800,
  annotations = [],
  enterLabel = 'Enter HARSHU',
  className = '',
  style,
  onProgress,
  onLetterClick,
  onEnterClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const portalStageRef = useRef<HTMLDivElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeCharIndex, setActiveCharIndex] = useState<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isPassedThrough, setIsPassedThrough] = useState(false);

  const progressRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Update transform and camera zoom based on scroll progress
  const updatePortalTransform = useCallback((progress: number) => {
    progressRef.current = progress;
    if (onProgress) onProgress(progress);

    if (!textLayerRef.current) return;

    if (prefersReducedMotion) {
      textLayerRef.current.style.transform = 'none';
      textLayerRef.current.style.opacity = `${Math.max(0, 1 - progress * 1.5)}`;
      setIsPassedThrough(progress > 0.4);
      return;
    }

    // Camera 3D movement: starts at scale 1, zooms into the portal letters
    // Zoom factor exponentially accelerates as scroll approaches 1
    const zoom = Math.pow(1 + progress * 5.5, 2.8);
    const zOffset = progress * 400;
    const opacity = Math.max(0, 1 - Math.pow(progress, 1.8) * 1.3);

    textLayerRef.current.style.transform = `translate3d(0, 0, ${zOffset}px) scale(${zoom})`;
    textLayerRef.current.style.opacity = `${opacity}`;

    setIsPassedThrough(progress > 0.55);
  }, [onProgress, prefersReducedMotion]);

  // Scroll listener loop using requestAnimationFrame
  useEffect(() => {
    const handleScroll = () => {
      if (rafIdRef.current) return;

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        if (!trackRef.current) return;

        const rect = trackRef.current.getBoundingClientRect();
        const totalScrollable = rect.height - window.innerHeight;
        if (totalScrollable <= 0) return;

        const currentScroll = -rect.top;
        const rawProgress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
        updatePortalTransform(rawProgress);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll(); // Initial pass

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [updatePortalTransform]);

  // Letter characters array
  const characters = word.split('');

  return (
    <div
      ref={trackRef}
      className={`relative w-full ${className}`}
      style={{ height: `${scrollLength}px`, ...style }}
    >
      {/* Sticky portal viewport */}
      <div
        ref={containerRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-[#faf8f5]"
      >
        {/* Background layer */}
        {background && (
          <div className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-700">
            {background}
          </div>
        )}

        {/* 3D Perspective Scene */}
        <div
          ref={portalStageRef}
          className="glyph-scene relative z-10 w-full max-w-6xl h-full flex flex-col items-center justify-center px-4"
        >
          {/* Zoomable HARSHU text layer */}
          <div
            ref={textLayerRef}
            className="flex items-center justify-center gap-1 sm:gap-3 md:gap-5 select-none transition-transform duration-75 will-change-transform"
            style={{
              fontFamily,
              fontWeight,
            }}
          >
            {characters.map((char, index) => {
              const isFocus = char === focusChar;
              const annotation = annotations[index];
              const isHovered = activeCharIndex === index;

              return (
                <div
                  key={`${char}-${index}`}
                  className="relative group flex flex-col items-center cursor-pointer"
                  tabIndex={interactive ? 0 : -1}
                  role={interactive ? 'button' : undefined}
                  aria-label={`${char}: ${annotation?.label || ''}`}
                  onMouseEnter={() => interactive && setActiveCharIndex(index)}
                  onMouseLeave={() => interactive && setActiveCharIndex(null)}
                  onClick={() => {
                    if (interactive && onLetterClick) {
                      onLetterClick(index, char);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (interactive && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      if (onLetterClick) onLetterClick(index, char);
                    }
                  }}
                >
                  {/* The Big Letter */}
                  <span
                    className={`text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] leading-none tracking-tight transition-all duration-300 ${
                      isHovered
                        ? 'text-harshu-600 scale-105 drop-shadow-md'
                        : isFocus
                        ? 'text-harshu-900'
                        : 'text-harshu-800'
                    }`}
                  >
                    {char}
                  </span>

                  {/* Letter Meaning Card on Hover or active */}
                  {annotation && (
                    <div
                      className={`absolute -bottom-16 sm:-bottom-20 z-30 flex flex-col items-center pointer-events-none transition-all duration-300 ${
                        isHovered
                          ? 'opacity-100 transform translate-y-0 scale-100'
                          : 'opacity-0 transform translate-y-2 scale-95'
                      }`}
                    >
                      <div className="bg-harshu-900 text-white px-3 py-1.5 rounded-xl shadow-lg flex flex-col items-center text-center whitespace-nowrap border border-harshu-700">
                        <span className="text-sm font-bold text-harshu-200">
                          {char} — {annotation.label}
                        </span>
                        {annotation.sub && (
                          <span className="text-xs text-harshu-300 font-normal">
                            {annotation.sub}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Canvas for precise glyph contour measurements if needed */}
          <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

          {/* Children / UI overlay content inside portal viewport */}
          <div
            className={`relative z-20 w-full flex flex-col items-center transition-all duration-500 mt-6 sm:mt-10 ${
              isPassedThrough ? 'opacity-100 transform translate-y-0' : 'opacity-90'
            }`}
          >
            {children}
          </div>
        </div>

        {/* Foreground / Reveal overlay */}
        {front && (
          <div
            className={`absolute inset-0 z-20 transition-all duration-700 pointer-events-auto ${
              isPassedThrough ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {front}
          </div>
        )}
      </div>
    </div>
  );
};
