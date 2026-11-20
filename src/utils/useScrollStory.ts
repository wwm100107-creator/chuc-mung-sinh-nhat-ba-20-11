import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export interface ChapterScrollState {
  progress: number;
  isInView: boolean;
}

/**
 * Tracks smoothed scroll progress [0, 1] across a tall sticky chapter track.
 * Simultaneously writes `--p` directly onto `trackRef.current` for 60fps CSS interpolation,
 * while throttling React state updates to avoid unnecessary re-renders on mobile devices.
 */
export function useChapterScroll(
  trackRef: RefObject<HTMLElement | null>,
  lerpFactor = 0.16,
): ChapterScrollState {
  const [state, setState] = useState<ChapterScrollState>({ progress: 0, isInView: false });
  const targetRef = useRef(0);
  const smoothedRef = useRef(0);
  const lastStateProgressRef = useRef(0);
  const lastInViewRef = useRef(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let rafId = 0;
    let active = false;
    const reduced = prefersReducedMotion();

    const measureTarget = () => {
      const node = trackRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const scrollable = Math.max(1, rect.height - vh);
      const raw = clamp(-rect.top / scrollable, 0, 1);
      const inView = rect.bottom > -120 && rect.top < vh + 120;

      targetRef.current = raw;

      if (inView !== lastInViewRef.current) {
        lastInViewRef.current = inView;
        setState((prev) => ({ ...prev, isInView: inView }));
      }
    };

    const tick = () => {
      const node = trackRef.current;
      if (!node) return;

      const diff = targetRef.current - smoothedRef.current;
      if (reduced || Math.abs(diff) < 0.0008) {
        smoothedRef.current = targetRef.current;
        active = false;
      } else {
        smoothedRef.current += diff * lerpFactor;
        rafId = window.requestAnimationFrame(tick);
      }

      const p = clamp(smoothedRef.current, 0, 1);
      node.style.setProperty('--p', p.toFixed(4));

      const edgeSnapped = (p === 0 || p === 1) && lastStateProgressRef.current !== p;
      if (edgeSnapped || Math.abs(p - lastStateProgressRef.current) >= 0.008) {
        lastStateProgressRef.current = p;
        setState({ progress: p, isInView: lastInViewRef.current });
      }
    };

    const schedule = () => {
      measureTarget();
      if (!active) {
        active = true;
        rafId = window.requestAnimationFrame(tick);
      }
    };

    // Initial calculation
    measureTarget();
    smoothedRef.current = targetRef.current;
    el.style.setProperty('--p', smoothedRef.current.toFixed(4));
    lastStateProgressRef.current = smoothedRef.current;
    setState({ progress: smoothedRef.current, isInView: lastInViewRef.current });

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [trackRef, lerpFactor]);

  return state;
}

export interface GlobalScrollStory {
  globalProgress: number;
  activeChapterIndex: number;
  velocityRef: RefObject<number>;
}

/**
 * Tracks overall document scroll progress, active chapter index, and smoothed scroll velocity.
 */
export function useGlobalScrollStory(chapterIds: string[]): GlobalScrollStory {
  const [globalProgress, setGlobalProgress] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const velocityRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const lastReportedGlobalRef = useRef(0);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    let rafId = 0;

    const update = () => {
      const sy = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const rawGlobal = docHeight > 0 ? clamp(sy / docHeight, 0, 1) : 0;

      if (Math.abs(rawGlobal - lastReportedGlobalRef.current) >= 0.004 || rawGlobal === 0 || rawGlobal === 1) {
        lastReportedGlobalRef.current = rawGlobal;
        setGlobalProgress(rawGlobal);
      }

      const delta = clamp(sy - lastScrollYRef.current, -40, 40);
      lastScrollYRef.current = sy;
      velocityRef.current = velocityRef.current * 0.65 + delta * 0.35;

      const threshold = (window.innerHeight || 800) * 0.48;
      let currentIdx = 0;
      for (let i = 0; i < chapterIds.length; i += 1) {
        const el = document.getElementById(chapterIds[i]);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) {
          currentIdx = i;
        }
      }
      setActiveChapterIndex((prev) => (prev !== currentIdx ? currentIdx : prev));
    };

    const decayVelocity = () => {
      velocityRef.current *= 0.9;
      if (Math.abs(velocityRef.current) > 0.15) {
        rafId = window.requestAnimationFrame(decayVelocity);
      } else {
        velocityRef.current = 0;
        rafId = 0;
      }
    };

    const onScroll = () => {
      update();
      if (!rafId) {
        rafId = window.requestAnimationFrame(decayVelocity);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
    };
  }, [chapterIds]);

  return { globalProgress, activeChapterIndex, velocityRef };
}

export function scrollToChapter(id: string, offsetProgress = 0.08) {
  const el = document.getElementById(id);
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || 800;
  const scrollable = Math.max(0, rect.height - vh);
  const top = window.scrollY + rect.top + scrollable * offsetProgress;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  });
}

export function useScrollProgressJump(trackRef: RefObject<HTMLElement | null>) {
  return useCallback(
    (targetProgress: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const scrollable = Math.max(0, rect.height - vh);
      const top = window.scrollY + rect.top + scrollable * clamp(targetProgress, 0, 1);
      window.scrollTo({
        top: Math.max(0, top),
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    },
    [trackRef],
  );
}
