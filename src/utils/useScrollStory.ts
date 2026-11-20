import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function remap(val: number, inMin: number, inMax: number): number {
  if (inMax <= inMin) return 0;
  return clamp((val - inMin) / (inMax - inMin), 0, 1);
}

export function smoothstep(val: number, edge0: number, edge1: number): number {
  const t = remap(val, edge0, edge1);
  return t * t * (3 - 2 * t);
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export interface ChapterScrollState {
  progress: number;
  enterProgress: number;
  exitProgress: number;
  isInView: boolean;
}

/**
 * Silky-smooth 60/120fps scroll scrubber for sticky scrollytelling tracks.
 * Computes:
 * - `enterProgress` [0..1]: as the chapter rises from bottom of viewport into pinned position
 * - `progress` [0..1]: while the chapter is pinned
 * - `exitProgress` [0..1]: as the chapter unpins and glides out toward the next chapter
 */
export function useChapterScroll(
  trackRef: RefObject<HTMLElement | null>,
  lerpFactor = 0.11,
): ChapterScrollState {
  const [state, setState] = useState<ChapterScrollState>({
    progress: 0,
    enterProgress: 1,
    exitProgress: 0,
    isInView: false,
  });

  const targetRef = useRef({ p: 0, enter: 1, exit: 0 });
  const smoothedRef = useRef({ p: 0, enter: 1, exit: 0 });
  const lastReportedRef = useRef({ p: 0, enter: 1, exit: 0 });
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

      const rawP = clamp(-rect.top / scrollable, 0, 1);
      // Enter goes 0 -> 1 as rect.top moves from vh*0.85 -> 0
      const rawEnter = clamp(1 - rect.top / (vh * 0.82), 0, 1);
      // Exit goes 0 -> 1 in the final 16% of the track and as rect.bottom leaves
      const rawExit = clamp((rawP - 0.86) / 0.14, 0, 1);
      const inView = rect.bottom > -200 && rect.top < vh + 200;

      targetRef.current = { p: rawP, enter: rawEnter, exit: rawExit };

      if (inView !== lastInViewRef.current) {
        lastInViewRef.current = inView;
      }
    };

    const tick = () => {
      const node = trackRef.current;
      if (!node) return;

      const t = targetRef.current;
      const s = smoothedRef.current;

      const dp = t.p - s.p;
      const dEn = t.enter - s.enter;
      const dEx = t.exit - s.exit;

      if (
        reduced ||
        (Math.abs(dp) < 0.00025 && Math.abs(dEn) < 0.0005 && Math.abs(dEx) < 0.0005)
      ) {
        s.p = t.p;
        s.enter = t.enter;
        s.exit = t.exit;
        active = false;
      } else {
        s.p += dp * lerpFactor;
        s.enter += dEn * (lerpFactor * 1.15);
        s.exit += dEx * (lerpFactor * 1.15);
        rafId = window.requestAnimationFrame(tick);
      }

      const p = clamp(s.p, 0, 1);
      const enter = clamp(s.enter, 0, 1);
      const exit = clamp(s.exit, 0, 1);

      node.style.setProperty('--p', p.toFixed(4));
      node.style.setProperty('--enter', enter.toFixed(4));
      node.style.setProperty('--exit', exit.toFixed(4));

      const last = lastReportedRef.current;
      const edgeSnapped = (p === 0 || p === 1) && last.p !== p;
      if (
        edgeSnapped ||
        Math.abs(p - last.p) >= 0.001 ||
        Math.abs(enter - last.enter) >= 0.004 ||
        Math.abs(exit - last.exit) >= 0.004
      ) {
        lastReportedRef.current = { p, enter, exit };
        setState({
          progress: p,
          enterProgress: enter,
          exitProgress: exit,
          isInView: lastInViewRef.current,
        });
      }
    };

    const schedule = () => {
      measureTarget();
      if (!active) {
        active = true;
        rafId = window.requestAnimationFrame(tick);
      }
    };

    measureTarget();
    smoothedRef.current = { ...targetRef.current };
    lastReportedRef.current = { ...targetRef.current };
    setState({
      progress: smoothedRef.current.p,
      enterProgress: smoothedRef.current.enter,
      exitProgress: smoothedRef.current.exit,
      isInView: lastInViewRef.current,
    });

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

      if (
        Math.abs(rawGlobal - lastReportedGlobalRef.current) >= 0.002 ||
        rawGlobal === 0 ||
        rawGlobal === 1
      ) {
        lastReportedGlobalRef.current = rawGlobal;
        setGlobalProgress(rawGlobal);
      }

      const delta = clamp(sy - lastScrollYRef.current, -50, 50);
      lastScrollYRef.current = sy;
      velocityRef.current = velocityRef.current * 0.62 + delta * 0.38;

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
      velocityRef.current *= 0.91;
      if (Math.abs(velocityRef.current) > 0.12) {
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
