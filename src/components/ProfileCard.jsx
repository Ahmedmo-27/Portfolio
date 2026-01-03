import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import './ProfileCard.css';
import SkeletonLoader from './SkeletonLoader'
import batchSetProperty from '../utils/batchStyle'

// Default gradient adapts to theme via CSS variables
const DEFAULT_INNER_GRADIENT = 'linear-gradient(145deg, rgba(96, 73, 110, 0.55) 0%, rgba(113, 196, 255, 0.27) 100%)';

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: 180
};

const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v, precision = 3) => parseFloat(v.toFixed(precision));
const adjust = (v, fMin, fMax, tMin, tMax) =>
  round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

const ProfileCardComponent = ({
  avatarUrl = '/Ahmed Mostafa.webp',
  iconUrl = '/Geometric AM logo design.webp',
  grainUrl = '/Grain.webp',
  innerGradient,
  behindGlowEnabled = true,
  behindGlowColor,
  behindGlowSize,
  className = '',
  enableTilt = true,
  enableMobileTilt = true,
  mobileTiltSensitivity = 1,
  name = 'Ahmed Mostafa',
  title = 'Junior Software Engineer'
}) => {
  const wrapRef = useRef(null);
  const shellRef = useRef(null);

  const enterTimerRef = useRef(null);
  const leaveRafRef = useRef(null);

  const [tiltReady, setTiltReady] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef(null);

  // Check if image is already loaded (cached) when component mounts
  useEffect(() => {
    const checkImageLoaded = () => {
      if (imageRef.current && imageRef.current.complete && imageRef.current.naturalHeight !== 0) {
        setImageLoaded(true);
      }
    };

    // Check immediately
    checkImageLoaded();

    // Also check after a short delay in case image loads very quickly
    const timeoutId = setTimeout(() => {
      checkImageLoaded();
      // If still not loaded after timeout, set loaded anyway to prevent infinite loading
      setImageLoaded(true);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []); // Empty dependency array - only run on mount

  // Defer tilt engine initialization to after LCP
  useEffect(() => {
    // Wait for idle callback or fallback to setTimeout to not block LCP
    // Increased timeout to ensure it doesn't interfere with critical rendering
    const id = 'requestIdleCallback' in window
      ? window.requestIdleCallback(() => setTiltReady(true), { timeout: 3000 })
      : setTimeout(() => setTiltReady(true), 500);
    return () => {
      if ('requestIdleCallback' in window) {
        window.cancelIdleCallback(id);
      } else {
        clearTimeout(id);
      }
    };
  }, []);

  // Detect if device is touch-capable
  const isTouchDevice = useMemo(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  }, []);

  // Disable tilt on mobile touch devices unless explicitly enabled
  const shouldEnableTilt = useMemo(() => {
    if (!enableTilt) return false;
    if (isTouchDevice && !enableMobileTilt) return false;
    return true;
  }, [enableTilt, enableMobileTilt, isTouchDevice]);

  const tiltEngine = useMemo(() => {
    if (!shouldEnableTilt || !tiltReady) return null;

    let rafId = null;
    let running = false;
    let lastTs = 0;

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const DEFAULT_TAU = 0.14;
    const INITIAL_TAU = 0.6;
    let initialUntil = 0;

    // Cache dimensions to avoid repeated DOM queries
    let cachedWidth = 0;
    let cachedHeight = 0;
    let dimensionsDirty = true;

    const getDimensions = () => {
      if (dimensionsDirty) {
        const shell = shellRef.current;
        if (shell) {
          cachedWidth = shell.clientWidth || 1;
          cachedHeight = shell.clientHeight || 1;
          dimensionsDirty = false;
        }
      }
      return { width: cachedWidth, height: cachedHeight };
    };

      // Cache last values to avoid redundant style updates
      let lastPercentX = -1;
      let lastPercentY = -1;
      let pendingStyleUpdate = null;
      let styleRafId = null;
      
      const setVarsFromXY = (x, y) => {
        const wrap = wrapRef.current;
        if (!wrap) return;

        const { width, height } = getDimensions();
        const invWidth = 100 / width;
        const invHeight = 100 / height;

        const percentX = clamp(invWidth * x);
        const percentY = clamp(invHeight * y);
        
        // Skip update if values haven't changed significantly (reduces style recalcs)
        if (Math.abs(percentX - lastPercentX) < 1 && Math.abs(percentY - lastPercentY) < 1) {
          return;
        }
        lastPercentX = percentX;
        lastPercentY = percentY;

        // Store pending update
        pendingStyleUpdate = { percentX, percentY };

        // Batch style updates using requestAnimationFrame to reduce layout work
        if (!styleRafId) {
          styleRafId = requestAnimationFrame(() => {
            styleRafId = null;
            if (!pendingStyleUpdate || !wrapRef.current) return;
            
            const { percentX, percentY } = pendingStyleUpdate;
            pendingStyleUpdate = null;
            
            const wrap = wrapRef.current;
            const centerX = percentX - 50;
            const centerY = percentY - 50;

            // Pre-calculate common values
            const percentXDiv100 = percentX * 0.01;
            const percentYDiv100 = percentY * 0.01;
            const centerDist = Math.hypot(centerY, centerX);
            const pointerFromCenter = clamp(centerDist * 0.02, 0, 1);

            // Batch CSS variable updates (CSS vars don't cause reflows, but batching reduces function call overhead)
            wrap.style.setProperty('--pointer-x', `${percentX}%`);
            wrap.style.setProperty('--pointer-y', `${percentY}%`);
            wrap.style.setProperty('--background-x', `${adjust(percentX, 0, 100, 35, 65)}%`);
            wrap.style.setProperty('--background-y', `${adjust(percentY, 0, 100, 35, 65)}%`);
            wrap.style.setProperty('--pointer-from-center', `${pointerFromCenter}`);
            wrap.style.setProperty('--pointer-from-top', `${percentYDiv100}`);
            wrap.style.setProperty('--pointer-from-left', `${percentXDiv100}`);
            wrap.style.setProperty('--rotate-x', `${round(-centerX * 0.2)}deg`);
            wrap.style.setProperty('--rotate-y', `${round(centerY * 0.25)}deg`);
          });
        }
      };

    const step = (ts) => {
      if (!running) return;
      
      const dt = lastTs === 0 ? 0 : (ts - lastTs) * 0.001;
      lastTs = ts;

      // Early exit if delta time is too small (prevents unnecessary calculations)
      if (dt < 0.001) {
        rafId = requestAnimationFrame(step);
        return;
      }

      const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
      const k = 1 - Math.exp(-dt / tau);

      const diffX = targetX - currentX;
      const diffY = targetY - currentY;
      
      currentX += diffX * k;
      currentY += diffY * k;

      setVarsFromXY(currentX, currentY);

      // Use squared distance for comparison (faster than Math.abs)
      const distSq = diffX * diffX + diffY * diffY;
      const thresholdSq = 0.0025; // 0.05^2

      if (distSq > thresholdSq || document.hasFocus()) {
        rafId = requestAnimationFrame(step);
      } else {
        running = false;
        lastTs = 0;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTs = 0;
      rafId = requestAnimationFrame(step);
    };

    return {
      setImmediate(x, y) {
        currentX = x;
        currentY = y;
        setVarsFromXY(currentX, currentY);
      },
      setTarget(x, y) {
        targetX = x;
        targetY = y;
        start();
      },
      toCenter() {
        const { width, height } = getDimensions();
        if (width === 0 || height === 0) return;
        this.setTarget(width * 0.5, height * 0.5);
      },
      invalidateDimensions() {
        dimensionsDirty = true;
      },
      updateDimensions(width, height) {
        // update cached dimensions and mark cache clean
        cachedWidth = width || cachedWidth;
        cachedHeight = height || cachedHeight;
        dimensionsDirty = false;
      },
      getDimensions() {
        return getDimensions();
      },
      beginInitial(durationMs) {
        initialUntil = performance.now() + durationMs;
        start();
      },
      getCurrent() {
        return { x: currentX, y: currentY, tx: targetX, ty: targetY };
      },
      cancel() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        running = false;
        lastTs = 0;
        if (styleRafId) cancelAnimationFrame(styleRafId);
        styleRafId = null;
        pendingStyleUpdate = null;
      }
    };
  }, [shouldEnableTilt, tiltReady]);

  // Use ResizeObserver to keep tiltEngine's cached dimensions up-to-date
  useEffect(() => {
    if (!shouldEnableTilt || !tiltEngine) return

    const shell = shellRef.current
    if (!shell) return

    // Initialize with current size — defer to rAF to avoid forced reflow
    requestAnimationFrame(() => {
      try {
        const rect = shell.getBoundingClientRect()
        if (tiltEngine.updateDimensions) {
          tiltEngine.updateDimensions(rect.width || shell.clientWidth || 0, rect.height || shell.clientHeight || 0)
        }
      } catch (e) {
        // ignore if element not available
      }
    })

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width
        const h = entry.contentRect.height
        if (tiltEngine.updateDimensions) tiltEngine.updateDimensions(w, h)
      }
    })
    ro.observe(shell)

    return () => ro.disconnect()
  }, [shouldEnableTilt, tiltEngine])

  // Cache rect to avoid repeated getBoundingClientRect calls
  const rectCacheRef = useRef({ left: 0, top: 0, width: 0, height: 0 });
  const rectCacheValidRef = useRef(false);

  const getOffsets = (evt, el) => {
    // Use cached rect to avoid forced reflow
    // Only read getBoundingClientRect when cache is invalid
    if (!rectCacheValidRef.current) {
      // Batch read: get all rect properties at once
      const rect = el.getBoundingClientRect();
      rectCacheRef.current = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
      };
      rectCacheValidRef.current = true;
    }
    const cached = rectCacheRef.current;
    // Use cached values - no layout read
    return { 
      x: evt.clientX - cached.left, 
      y: evt.clientY - cached.top 
    };
  };

  const handlePointerMove = useCallback(
    (event) => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;
      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine]
  );

  const handlePointerEnter = useCallback(
    (event) => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;

      // Read layout (cached or getBoundingClientRect) before performing DOM writes
      // to avoid forcing a synchronous reflow.
      const { x, y } = getOffsets(event, shell);

      shell.classList.add('active');
      shell.classList.add('entering');
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      enterTimerRef.current = window.setTimeout(() => {
        shell.classList.remove('entering');
      }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

      tiltEngine.setTarget(x, y);
    },
    [tiltEngine]
  );

  const handlePointerLeave = useCallback(() => {
    const shell = shellRef.current;
    if (!shell || !tiltEngine) return;

    tiltEngine.toCenter();

    const checkSettle = () => {
      const { x, y, tx, ty } = tiltEngine.getCurrent();
      const settled = Math.hypot(tx - x, ty - y) < 0.6;
      if (settled) {
        shell.classList.remove('active');
        leaveRafRef.current = null;
      } else {
        leaveRafRef.current = requestAnimationFrame(checkSettle);
      }
    };
    if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
    leaveRafRef.current = requestAnimationFrame(checkSettle);
  }, [tiltEngine]);

  const handleDeviceOrientation = useCallback(
    (event) => {
      if (!tiltEngine) return;

      const { beta, gamma } = event;
      if (beta == null || gamma == null) return;

      // Use cached dimensions if available - avoid forced reflow
      const dimensions = tiltEngine.getDimensions ? tiltEngine.getDimensions() : null;
      if (!dimensions || dimensions.width === 0 || dimensions.height === 0) {
        // Defer dimension reads to next frame to avoid forced reflow
        requestAnimationFrame(() => {
          const shell = shellRef.current;
          if (!shell) return;
          // Prefer cached dimensions from tiltEngine to avoid forced layout reads
          const dims = tiltEngine.getDimensions ? tiltEngine.getDimensions() : { width: shell.clientWidth, height: shell.clientHeight };
          const width = dims.width || shell.clientWidth || 0;
          const height = dims.height || shell.clientHeight || 0;
          const centerX = width * 0.5;
          const centerY = height * 0.5;
          const x = clamp(centerX + gamma * mobileTiltSensitivity, 0, width);
          const y = clamp(
            centerY + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
            0,
            height
          );
          tiltEngine.setTarget(x, y);
        });
        return;
      } else {
        const centerX = dimensions.width * 0.5;
        const centerY = dimensions.height * 0.5;
        const x = clamp(centerX + gamma * mobileTiltSensitivity, 0, dimensions.width);
        const y = clamp(
          centerY + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
          0,
          dimensions.height
        );
        tiltEngine.setTarget(x, y);
      }
    },
    [tiltEngine, mobileTiltSensitivity]
  );

  useEffect(() => {
    if (!shouldEnableTilt || !tiltEngine) return;

    const shell = shellRef.current;
    if (!shell) return;

    const pointerMoveHandler = handlePointerMove;
    const pointerEnterHandler = handlePointerEnter;
    const pointerLeaveHandler = handlePointerLeave;
    const deviceOrientationHandler = handleDeviceOrientation;

    // Initialize rect cache in a rAF to avoid a forced reflow on first pointer interaction
    requestAnimationFrame(() => {
      const s = shellRef.current
      if (!s) return
      const r = s.getBoundingClientRect()
      rectCacheRef.current = { left: r.left, top: r.top, width: r.width, height: r.height }
      rectCacheValidRef.current = true
    })

    // Use passive listeners for better scroll performance
    shell.addEventListener('pointerenter', pointerEnterHandler, { passive: true });
    shell.addEventListener('pointermove', pointerMoveHandler, { passive: true });
    shell.addEventListener('pointerleave', pointerLeaveHandler, { passive: true });

    const handleClick = () => {
      if (!enableMobileTilt || window.location.protocol !== 'https:') return;
      const anyMotion = window.DeviceMotionEvent;
      if (anyMotion && typeof anyMotion.requestPermission === 'function') {
        anyMotion
          .requestPermission()
          .then((state) => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', deviceOrientationHandler);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener('deviceorientation', deviceOrientationHandler);
      }
    };
    shell.addEventListener('click', handleClick);

    // Invalidate dimension cache on mount/resize
    if (tiltEngine.invalidateDimensions) {
      tiltEngine.invalidateDimensions();
    }
    
    // Defer initial dimension reads to avoid forced reflow during critical rendering
    // Use requestIdleCallback to ensure this happens after LCP
    const initTilt = () => {
      requestAnimationFrame(() => {
        if (!shellRef.current) return;
        
        // Adjust initial offsets for mobile devices
        const isMobile = window.innerWidth <= 768;
        const xOffset = isMobile ? ANIMATION_CONFIG.INITIAL_X_OFFSET * 0.5 : ANIMATION_CONFIG.INITIAL_X_OFFSET;
        const yOffset = isMobile ? ANIMATION_CONFIG.INITIAL_Y_OFFSET * 0.5 : ANIMATION_CONFIG.INITIAL_Y_OFFSET;
        
        // Batch read: get dimensions once
        const shell = shellRef.current;
        const dims = tiltEngine.getDimensions ? tiltEngine.getDimensions() : { width: shell.clientWidth || 0 };
        const shellWidth = dims.width || 0;
        const initialX = shellWidth - xOffset;
        const initialY = yOffset;
        tiltEngine.setImmediate(initialX, initialY);
        tiltEngine.toCenter();
        tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);
      });
    };
    
    // Use requestIdleCallback to defer dimension reads
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(initTilt, { timeout: 1000 });
    } else {
      setTimeout(initTilt, 300);
    }

    // Handle resize to invalidate cache
    const handleResize = () => {
      rectCacheValidRef.current = false;
      if (tiltEngine.invalidateDimensions) {
        tiltEngine.invalidateDimensions();
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Also refresh rect cache on resize in a rAF to avoid the first pointer
    // interaction causing a synchronous getBoundingClientRect read.
    const refreshOnResize = () => {
      if (!shellRef.current) return
      requestAnimationFrame(() => {
        const s = shellRef.current
        if (!s) return
        const r = s.getBoundingClientRect()
        rectCacheRef.current = { left: r.left, top: r.top, width: r.width, height: r.height }
        rectCacheValidRef.current = true
      })
    }
    window.addEventListener('resize', refreshOnResize, { passive: true })

    return () => {
      shell.removeEventListener('pointerenter', pointerEnterHandler);
      shell.removeEventListener('pointermove', pointerMoveHandler);
      shell.removeEventListener('pointerleave', pointerLeaveHandler);
      shell.removeEventListener('click', handleClick);
      window.removeEventListener('deviceorientation', deviceOrientationHandler);
      window.removeEventListener('resize', handleResize);
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
      tiltEngine.cancel();
      shell.classList.remove('entering');
      rectCacheValidRef.current = false;
    };
  }, [
    shouldEnableTilt,
    enableMobileTilt,
    tiltEngine,
    handlePointerMove,
    handlePointerEnter,
    handlePointerLeave,
    handleDeviceOrientation
  ]);

  // Set CSS variables via ref instead of inline style (JSX file, so no TypeScript generic)
  const cardWrapperRef = useRef(null);
  
  useEffect(() => {
    if (cardWrapperRef.current) {
      batchSetProperty(cardWrapperRef.current, '--icon', iconUrl ? `url(${iconUrl})` : 'none');
      batchSetProperty(cardWrapperRef.current, '--grain', grainUrl ? `url(${grainUrl})` : 'none');
      batchSetProperty(cardWrapperRef.current, '--inner-gradient', innerGradient ?? DEFAULT_INNER_GRADIENT);
      batchSetProperty(cardWrapperRef.current, '--behind-glow-color', behindGlowColor ?? 'rgba(125, 190, 255, 0.67)');
      batchSetProperty(cardWrapperRef.current, '--behind-glow-size', behindGlowSize ?? '50%');
    }
  }, [iconUrl, grainUrl, innerGradient, behindGlowColor, behindGlowSize]);

  return (
    <div 
      ref={(node) => {
        wrapRef.current = node;
        cardWrapperRef.current = node;
      }}
      className={`pc-card-wrapper ${isTouchDevice ? 'pc-touch-device' : ''} ${className}`.trim()}
    >
      {behindGlowEnabled && <div className="pc-behind" />}
      <div ref={shellRef} className="pc-card-shell">
        <section className="pc-card">
          <div className="pc-inside">
            <div className="pc-shine" />
            <div className="pc-glare" />
            <div className="pc-content pc-avatar-content relative">
              {/* Skeleton loader overlay - shown when image is not loaded */}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 0 }}>
                  <SkeletonLoader variant="card" className="w-full max-w-xs sm:max-w-sm h-[500px] md:h-[600px] rounded-3xl" />
                </div>
              )}
              {/* Image element - always rendered so it can load */}
              {(() => {
                  return (
                    <img
                      ref={imageRef}
                      className="avatar relative z-20"
                      src={avatarUrl}
                      alt={`${name || 'Ahmed Mostafa'} avatar`}
                      width={483}
                      height={644}
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      style={{ height: '95%', width: '100%' }}
                      onLoad={(e) => {
                        setImageLoaded(true);
                        // Mark image as loaded for LCP measurement
                        if (window.performance && window.performance.mark) {
                          window.performance.mark('lcp-image-loaded');
                        }
                      }}
                      onError={e => {
                        const t = e.target;
                        console.error('Failed to load avatar image:', avatarUrl);
                        t.classList.add('avatar-error');
                        // Still set loaded to hide skeleton even on error
                        setImageLoaded(true);
                      }}
                    />
                  );                
              })()}
            </div>
            <div className="pc-content">
              <div className="pc-details">
                <h2>{name}</h2>
                <p>{title}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;

