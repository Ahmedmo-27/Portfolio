import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import './ProfileCard.css';
import SkeletonLoader from './SkeletonLoader'
import batchSetProperty from '../utils/batchStyle'
import setProfileVars from '../utils/profileGeometry'
import { readRect, scheduleWrite } from '../utils/geometry'

// Default gradient adapts to theme via CSS variables
const DEFAULT_INNER_GRADIENT = 'linear-gradient(145deg, rgba(96, 73, 110, 0.55) 0%, rgba(113, 196, 255, 0.27) 100%)';

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: 180
};

// Read numeric CSS variable (supports px and ms suffixes)
function readCssVarNumber(el, name, fallback) {
  try {
    const node = el || document.documentElement;
    // Use a short-lived cache to avoid repeated getComputedStyle calls
    // which can force layout if used frequently during interactions.
    if (!readCssVarNumber._cache) readCssVarNumber._cache = new WeakMap();
    const nodeCache = readCssVarNumber._cache.get(node) || {};
    const now = Date.now();
    if (nodeCache[name] && (now - nodeCache[name].ts) < 1000) {
      const cached = nodeCache[name].value;
      return Number.isFinite(cached) ? cached : fallback;
    }
    const s = getComputedStyle(node).getPropertyValue(name);
    if (!s) return fallback;
    const str = s.trim();
    // remove trailing ms or px
    const n = parseFloat(str.replace(/ms$|px$/i, ''))
    const val = Number.isFinite(n) ? n : fallback
    // store in cache
    readCssVarNumber._cache.set(node, { ...(readCssVarNumber._cache.get(node) || {}), [name]: { value: val, ts: now } });
    return val
  } catch (e) {
    return fallback
  }
}

const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v, precision = 3) => parseFloat(v.toFixed(precision));
const adjust = (v, fMin, fMax, tMin, tMax) =>
  round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

const ProfileCardComponent = ({
  avatarUrl = '/Ahmed-Mostafa.avif',
  iconUrl = '/Geometric-AM-logo-design.webp',
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
          // Schedule an async read to avoid forcing a synchronous layout
          readRect(shell).then((r) => {
            if (r) {
              cachedWidth = r.width || cachedWidth || 1;
              cachedHeight = r.height || cachedHeight || 1;
            } else {
              cachedWidth = cachedWidth || 1;
              cachedHeight = cachedHeight || 1;
            }
            dimensionsDirty = false;
          }).catch(() => {
            // Ensure we mark as not dirty to avoid repeated sync reads
            cachedWidth = cachedWidth || 1;
            cachedHeight = cachedHeight || 1;
            dimensionsDirty = false;
          })
        }
      }
      return { width: cachedWidth || 1, height: cachedHeight || 1 };
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
              // Offload calculations and batched writes to helper
              setProfileVars(wrap, percentX, percentY)
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

    // Initialize with current size using shared readRect helper
    readRect(shell).then((rect) => {
      if (rect && tiltEngine.updateDimensions) {
        tiltEngine.updateDimensions(rect.width || 0, rect.height || 0)
      }
    }).catch(() => {})

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

  // Cache CSS var numbers that are read frequently during interactions to avoid
  // repeated getComputedStyle calls on every pointer event which can cause layout reads.
  const cssVarCacheRef = useRef({
    enterTransitionMs: ANIMATION_CONFIG.ENTER_TRANSITION_MS,
    initialXOffset: ANIMATION_CONFIG.INITIAL_X_OFFSET,
    initialYOffset: ANIMATION_CONFIG.INITIAL_Y_OFFSET,
    deviceBetaOffset: ANIMATION_CONFIG.DEVICE_BETA_OFFSET
  });
  // Cache whether current viewport is mobile to avoid reading `window.innerWidth` near writes
  const isMobileRef = useRef(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  const getOffsets = (evt, el) => {
    // If cache is not ready, return null so callers can defer reads to rAF
    if (!rectCacheValidRef.current) return null;
    const cached = rectCacheRef.current;
    return {
      x: evt.clientX - cached.left,
      y: evt.clientY - cached.top
    };
  };

  const updateRectCacheNow = (el) => {
    const s = el || shellRef.current;
    if (!s) return;
    // If cache is already valid, return it immediately to avoid a layout read
    if (rectCacheValidRef.current) return Promise.resolve(rectCacheRef.current);

    // Use async read to avoid forced synchronous layout reads
    try {
      return readRect(s).then((r) => {
        if (!r) return null;
        rectCacheRef.current = { left: r.left, top: r.top, width: r.width, height: r.height };
        rectCacheValidRef.current = true;
        return rectCacheRef.current;
      }).catch(() => null);
    } catch (e) {
      return null;
    }
  };

  const handlePointerMove = useCallback(
    (event) => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;
      const offsets = getOffsets(event, shell);
      if (offsets) {
        tiltEngine.setTarget(offsets.x, offsets.y);
        return;
      }
      // Cache not ready — schedule a read in rAF and then set target
      // Ensure we obtain the cached rect before computing offsets to avoid
      // any synchronous getBoundingClientRect reads during the pointer move.
      // Use the shared `readRect`-backed helper which returns a promise.
      updateRectCacheNow(shell).then(() => {
        // Run in rAF to keep reads and writes in the same frame
        requestAnimationFrame(() => {
          const o = getOffsets(event, shell);
          if (o) tiltEngine.setTarget(o.x, o.y);
        });
      }).catch(() => {});
    },
    [tiltEngine]
  );

  const handlePointerEnter = useCallback(
    (event) => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) return;
      // Attempt to use cached offsets; if cache missing, defer layout reads then apply writes together
      const offsets = getOffsets(event, shell);

        const applyEnter = (o) => {
        // Batch writes in one frame to avoid interleaved layout reads
          requestAnimationFrame(() => {
          if (!shellRef.current) return;
          const el = shellRef.current;
          // schedule class mutations in write phase to avoid layout thrashing
          scheduleWrite(() => {
            try { el.classList.add('active'); } catch (e) {}
            try { el.classList.add('entering'); } catch (e) {}
          });
          if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
          const enterMs = cssVarCacheRef.current.enterTransitionMs || ANIMATION_CONFIG.ENTER_TRANSITION_MS;
          enterTimerRef.current = window.setTimeout(() => {
            scheduleWrite(() => { try { el.classList.remove('entering'); } catch (e) {} });
          }, enterMs);

          if (o) tiltEngine.setTarget(o.x, o.y);
        });
      };

      if (offsets) {
        // We have cached offsets; apply enter in next frame
        applyEnter(offsets);
        return;
      }

      // Cache not ready — schedule an async read then apply writes in same frame
      // updateRectCacheNow will use cached value when available to avoid extra reads
      requestAnimationFrame(() => {
        updateRectCacheNow(shell).then(() => {
          const o = getOffsets(event, shell);
          applyEnter(o);
        });
      });
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
        scheduleWrite(() => { try { shell.classList.remove('active'); } catch (e) {} });
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
        const shell = shellRef.current;
        if (!shell) return;
        // Use shared readRect to defer layout read
        readRect(shell).then((r) => {
          // Prefer cached dimensions from tiltEngine to avoid forced layout reads
          const dims = tiltEngine.getDimensions ? tiltEngine.getDimensions() : null;
          const width = (dims && dims.width) || (r ? r.width : 0) || 0;
          const height = (dims && dims.height) || (r ? r.height : 0) || 0;
          const centerX = width * 0.5;
          const centerY = height * 0.5;
          const deviceBetaOffset = cssVarCacheRef.current.deviceBetaOffset || ANIMATION_CONFIG.DEVICE_BETA_OFFSET;
          const x = clamp(centerX + gamma * mobileTiltSensitivity, 0, width);
          const y = clamp(
              centerY + (beta - deviceBetaOffset) * mobileTiltSensitivity,
              0,
              height
            );
          tiltEngine.setTarget(x, y);
        }).catch(() => {});
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

    // Do not synchronously read layout on mount — defer to ResizeObserver and on-demand rAF updates
    rectCacheValidRef.current = false

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
        // Adjust initial offsets for mobile devices using cached CSS vars
        const isMobile = isMobileRef.current;
        const cssX = cssVarCacheRef.current.initialXOffset || ANIMATION_CONFIG.INITIAL_X_OFFSET;
        const cssY = cssVarCacheRef.current.initialYOffset || ANIMATION_CONFIG.INITIAL_Y_OFFSET;
        const xOffset = isMobile ? cssX * 0.5 : cssX;
        const yOffset = isMobile ? cssY * 0.5 : cssY;

        // Batch read: get dimensions once
        const shell = shellRef.current;
        const dims = tiltEngine.getDimensions ? tiltEngine.getDimensions() : { width: 0 };
        const shellWidth = dims.width || 0;
        const initialX = shellWidth - xOffset;
        const initialY = yOffset;
        tiltEngine.setImmediate(initialX, initialY);
        tiltEngine.toCenter();
        const initialDuration = cssVarCacheRef.current.initialDuration || ANIMATION_CONFIG.INITIAL_DURATION;
        tiltEngine.beginInitial(initialDuration);
      });
    };
    
    // Use requestIdleCallback to defer dimension reads
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(initTilt, { timeout: 1000 });
    } else {
      setTimeout(initTilt, 300);
    }

    // Populate cached CSS vars now and on resize; this minimizes computedStyle calls
    const populateCssVars = () => {
      try {
        const base = wrapRef.current || document.documentElement;
        cssVarCacheRef.current.enterTransitionMs = readCssVarNumber(base, '--pc-enter-transition-ms', ANIMATION_CONFIG.ENTER_TRANSITION_MS);
        cssVarCacheRef.current.initialXOffset = readCssVarNumber(base, '--pc-initial-x-offset', ANIMATION_CONFIG.INITIAL_X_OFFSET);
        cssVarCacheRef.current.initialYOffset = readCssVarNumber(base, '--pc-initial-y-offset', ANIMATION_CONFIG.INITIAL_Y_OFFSET);
        cssVarCacheRef.current.deviceBetaOffset = readCssVarNumber(base, '--pc-device-beta-offset', ANIMATION_CONFIG.DEVICE_BETA_OFFSET);
        // Keep an initialDuration entry if present
        cssVarCacheRef.current.initialDuration = readCssVarNumber(base, '--pc-initial-duration', ANIMATION_CONFIG.INITIAL_DURATION);
        // Cache mobile viewport flag here (this read happens in a resize handler rAF)
        try {
          // Use matchMedia to determine viewport category instead of reading
          // `window.innerWidth` directly to avoid layout-triggering reads.
          if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
            isMobileRef.current = window.matchMedia('(max-width:768px)').matches;
          } else {
            isMobileRef.current = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;
          }
        } catch (e) {}
      } catch (e) {}
    };

    // Defer initial CSS var reads to avoid forced synchronous layout reads during mount
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(populateCssVars, { timeout: 1000 });
    } else {
      requestAnimationFrame(populateCssVars);
    }
    const cssResizeHandler = () => {
      // Re-populate cached CSS vars on resize in rAF to avoid layout reads during interaction
      requestAnimationFrame(populateCssVars);
    };
    window.addEventListener('resize', cssResizeHandler, { passive: true });

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
      const s = shellRef.current
      readRect(s).then((r) => {
        if (!r) return
        rectCacheRef.current = { left: r.left, top: r.top, width: r.width, height: r.height }
        rectCacheValidRef.current = true
      }).catch(() => {})
    }
    window.addEventListener('resize', refreshOnResize, { passive: true })

    return () => {
      shell.removeEventListener('pointerenter', pointerEnterHandler);
      shell.removeEventListener('pointermove', pointerMoveHandler);
      shell.removeEventListener('pointerleave', pointerLeaveHandler);
      shell.removeEventListener('click', handleClick);
      window.removeEventListener('deviceorientation', deviceOrientationHandler);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', cssResizeHandler);
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
      batchSetProperty(cardWrapperRef.current, '--inner-gradient', innerGradient ?? DEFAULT_INNER_GRADIENT);
      batchSetProperty(cardWrapperRef.current, '--behind-glow-color', behindGlowColor ?? 'rgba(125, 190, 255, 0.67)');
      batchSetProperty(cardWrapperRef.current, '--behind-glow-size', behindGlowSize ?? '50%');
    }
  }, [iconUrl, innerGradient, behindGlowColor, behindGlowSize]);
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
              {/* Image element - always rendered so it can load (responsive via <picture>) */}
              {(() => {
                // Derive common variant filenames from the provided avatarUrl when possible
                // Use width descriptors matching actual display size to avoid downloading oversized images
                const sizes = "(max-width:480px) 320px, (max-width:768px) 480px, 478px";
                let avif1x = avatarUrl;
                let avif2x = avatarUrl;
                let webp1x = avatarUrl;
                let webp2x = avatarUrl;
                try {
                  if (/\.avif$/i.test(avatarUrl)) {
                    avif1x = avatarUrl;
                    avif2x = avatarUrl.replace(/\.avif$/i, '@2x.avif');
                    webp1x = avatarUrl.replace(/\.avif$/i, '.webp');
                    webp2x = avif2x.replace(/\.avif$/i, '@2x.webp').replace(/@2x\.avif$/i, '@2x.webp');
                  } else if (/\.webp$/i.test(avatarUrl)) {
                    webp1x = avatarUrl;
                    webp2x = avatarUrl.replace(/\.webp$/i, '@2x.webp');
                    avif1x = avatarUrl.replace(/\.webp$/i, '.avif');
                    avif2x = avif1x.replace(/\.avif$/i, '@2x.avif');
                  }
                } catch (e) {}

                // Use width descriptors rather than 1x/2x to let the browser pick exact resource
                // expected display width is 478px (1x) and 956px (2x)
                const avifSrcSet = `${avif1x} 478w, ${avif2x} 956w`;
                const webpSrcSet = `${webp1x} 478w, ${webp2x} 956w`;

                return (
                  <picture>
                  {/* AVIF sources */}
                  <source
                    type="image/avif"
                    srcSet="/Ahmed-Mostafa@1x.avif 478w, /Ahmed-Mostafa@2x.avif 956w"
                    sizes="(max-width:480px) 320px, (max-width:768px) 480px, 478px"
                  />
                  {/* WebP sources */}
                  <source
                    type="image/webp"
                    srcSet="/Ahmed-Mostafa@1x.webp 478w, /Ahmed-Mostafa@2x.webp 956w"
                    sizes="(max-width:480px) 320px, (max-width:768px) 480px, 478px"
                  />
                  {/* Fallback img */}
                  <img
                    ref={imageRef}
                    className="avatar relative z-20"
                    src="/Ahmed-Mostafa@1x.avif"
                    srcSet="/Ahmed-Mostafa@1x.avif 478w, /Ahmed-Mostafa@2x.avif 956w"
                    sizes="(max-width:480px) 320px, (max-width:768px) 480px, 478px"
                    alt={`${name || 'Ahmed Mostafa'} avatar`}
                    width={478}
                    height={637}
                    loading="eager"
                    fetchpriority="high"
                    decoding="async"
                    style={{ height: '95%', width: '100%' }}
                    onLoad={(e) => setImageLoaded(true)}
                    onError={(e) => {
                      console.error('Failed to load avatar image');
                      setImageLoaded(true);
                      e.target.classList.add('avatar-error');
                    }}
                  />
                  </picture>
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

