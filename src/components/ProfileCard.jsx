import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import './ProfileCard.css';
import { assetUrl, getWebPUrl } from '../utils/assetUrl'

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
  avatarUrl = assetUrl('/Assets/Ahmed Mostafa.webp'),
  iconUrl = assetUrl('/Assets/Geometric AM logo design.webp'),
  grainUrl = assetUrl('/Assets/Grain.webp'),
  innerGradient,
  behindGlowEnabled = true,
  behindGlowColor,
  behindGlowSize,
  className = '',
  enableTilt = true,
  enableMobileTilt = true,
  mobileTiltSensitivity = 1,
  name = 'Ahmed Mostafa',
  title = 'Junior Software Engineer',
  priority = false,
  rootMargin = '50px'
}) => {
  const wrapRef = useRef(null);
  const shellRef = useRef(null);
  const containerRef = useRef(null);

  const enterTimerRef = useRef(null);
  const leaveRafRef = useRef(null);

  const [isInView, setIsInView] = useState(priority);
  const [shouldLoad, setShouldLoad] = useState(priority);
  const [tiltReady, setTiltReady] = useState(false);

  // Defer tilt engine initialization to after LCP
  useEffect(() => {
    if (!shouldLoad) return;
    // Wait for idle callback or fallback to setTimeout to not block LCP
    const id = 'requestIdleCallback' in window
      ? window.requestIdleCallback(() => setTiltReady(true), { timeout: 2000 })
      : setTimeout(() => setTiltReady(true), 100);
    return () => {
      if ('requestIdleCallback' in window) {
        window.cancelIdleCallback(id);
      } else {
        clearTimeout(id);
      }
    };
  }, [shouldLoad]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Small delay to ensure DOM is ready
          requestAnimationFrame(() => {
            setShouldLoad(true);
          });
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold: 0.01,
      }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority, shouldLoad, rootMargin]);

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

        const centerX = percentX - 50;
        const centerY = percentY - 50;

        // Pre-calculate common values
        const percentXDiv100 = percentX * 0.01;
        const percentYDiv100 = percentY * 0.01;
        const centerDist = Math.hypot(centerY, centerX);
        const pointerFromCenter = clamp(centerDist * 0.02, 0, 1);

        // Set CSS variables (already optimized with individual setProperty calls)
        wrap.style.setProperty('--pointer-x', `${percentX}%`);
        wrap.style.setProperty('--pointer-y', `${percentY}%`);
        wrap.style.setProperty('--background-x', `${adjust(percentX, 0, 100, 35, 65)}%`);
        wrap.style.setProperty('--background-y', `${adjust(percentY, 0, 100, 35, 65)}%`);
        wrap.style.setProperty('--pointer-from-center', `${pointerFromCenter}`);
        wrap.style.setProperty('--pointer-from-top', `${percentYDiv100}`);
        wrap.style.setProperty('--pointer-from-left', `${percentXDiv100}`);
        wrap.style.setProperty('--rotate-x', `${round(-centerX * 0.2)}deg`);
        wrap.style.setProperty('--rotate-y', `${round(centerY * 0.25)}deg`);
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
      }
    };
  }, [shouldEnableTilt, tiltReady]);

  // Cache rect to avoid repeated getBoundingClientRect calls
  const rectCacheRef = useRef({ left: 0, top: 0, width: 0, height: 0 });
  const rectCacheValidRef = useRef(false);

  const getOffsets = (evt, el) => {
    if (!rectCacheValidRef.current) {
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

      shell.classList.add('active');
      shell.classList.add('entering');
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      enterTimerRef.current = window.setTimeout(() => {
        shell.classList.remove('entering');
      }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

      const { x, y } = getOffsets(event, shell);
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

      // Use cached dimensions if available
      const dimensions = tiltEngine.getDimensions ? tiltEngine.getDimensions() : null;
      if (!dimensions || dimensions.width === 0 || dimensions.height === 0) {
        const shell = shellRef.current;
        if (!shell) return;
        const centerX = shell.clientWidth * 0.5;
        const centerY = shell.clientHeight * 0.5;
        const x = clamp(centerX + gamma * mobileTiltSensitivity, 0, shell.clientWidth);
        const y = clamp(
          centerY + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
          0,
          shell.clientHeight
        );
        tiltEngine.setTarget(x, y);
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
    if (!shouldEnableTilt || !tiltEngine || !shouldLoad) return;

    const shell = shellRef.current;
    if (!shell) return;

    const pointerMoveHandler = handlePointerMove;
    const pointerEnterHandler = handlePointerEnter;
    const pointerLeaveHandler = handlePointerLeave;
    const deviceOrientationHandler = handleDeviceOrientation;

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
    
    // Adjust initial offsets for mobile devices
    const isMobile = window.innerWidth <= 768;
    const xOffset = isMobile ? ANIMATION_CONFIG.INITIAL_X_OFFSET * 0.5 : ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const yOffset = isMobile ? ANIMATION_CONFIG.INITIAL_Y_OFFSET * 0.5 : ANIMATION_CONFIG.INITIAL_Y_OFFSET;
    
    const shellWidth = shell.clientWidth || 0;
    const initialX = shellWidth - xOffset;
    const initialY = yOffset;
    tiltEngine.setImmediate(initialX, initialY);
    tiltEngine.toCenter();
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

    // Handle resize to invalidate cache
    const handleResize = () => {
      rectCacheValidRef.current = false;
      if (tiltEngine.invalidateDimensions) {
        tiltEngine.invalidateDimensions();
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });

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
    if (cardWrapperRef.current && shouldLoad) {
      cardWrapperRef.current.style.setProperty('--icon', iconUrl ? `url(${iconUrl})` : 'none');
      cardWrapperRef.current.style.setProperty('--grain', grainUrl ? `url(${grainUrl})` : 'none');
      cardWrapperRef.current.style.setProperty('--inner-gradient', innerGradient ?? DEFAULT_INNER_GRADIENT);
      cardWrapperRef.current.style.setProperty('--behind-glow-color', behindGlowColor ?? 'rgba(125, 190, 255, 0.67)');
      cardWrapperRef.current.style.setProperty('--behind-glow-size', behindGlowSize ?? '50%');
    }
  }, [iconUrl, grainUrl, innerGradient, behindGlowColor, behindGlowSize, shouldLoad]);

  return (
    <div 
      ref={(node) => {
        containerRef.current = node;
        wrapRef.current = node;
        cardWrapperRef.current = node;
      }}
      className={`pc-card-wrapper ${isTouchDevice ? 'pc-touch-device' : ''} ${!shouldLoad ? 'pc-card-loading' : ''} ${className}`.trim()}
    >
      {shouldLoad ? (
        <>
          {behindGlowEnabled && <div className="pc-behind" />}
          <div ref={shellRef} className="pc-card-shell">
            <section className="pc-card">
              <div className="pc-inside">
                <div className="pc-shine" />
                <div className="pc-glare" />
                <div className="pc-content pc-avatar-content">
                  {(() => {
                    const webpUrl = getWebPUrl(avatarUrl);
                    const isAlreadyWebP = /\.webp$/i.test(avatarUrl);
                    
                    // If already WebP, use simple img tag
                    if (isAlreadyWebP) {
                      return (
                        <img
                          className="avatar"
                          src={avatarUrl}
                          alt={`${name || 'Ahmed Mostafa'} avatar`}
                          width={483}
                          height={644}
                          loading={priority ? 'eager' : 'lazy'}
                          decoding={priority ? 'sync' : 'async'}
                          fetchPriority={priority ? 'high' : 'auto'}
                          sizes="(max-width: 480px) 280px, (max-width: 768px) 320px, 483px"
                          onError={e => {
                            const t = e.target;
                            console.error('Failed to load avatar image:', avatarUrl);
                            t.classList.add('avatar-error');
                          }}
                        />
                      );
                    }
                    
                    // Otherwise use picture element with WebP fallback
                    return (
                      <picture>
                        {/* WebP source for modern browsers */}
                        <source
                          srcSet={webpUrl}
                          type="image/webp"
                        />
                        {/* Fallback to original format */}
                        <img
                          className="avatar"
                          src={avatarUrl}
                          alt={`${name || 'Ahmed Mostafa'} avatar`}
                          width={483}
                          height={644}
                          loading={priority ? 'eager' : 'lazy'}
                          decoding={priority ? 'sync' : 'async'}
                          fetchPriority={priority ? 'high' : 'auto'}
                          sizes="(max-width: 480px) 280px, (max-width: 768px) 320px, 483px"
                          onError={e => {
                            const t = e.target;
                            console.error('Failed to load avatar image:', avatarUrl);
                            t.classList.add('avatar-error');
                          }}
                        />
                      </picture>
                    );
                  })()}
                </div>
                <div className="pc-content">
                  <div className="pc-details">
                    <h3>{name}</h3>
                    <p>{title}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </>
      ) : (
        <div className="pc-card-skeleton" aria-hidden="true" />
      )}
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;

