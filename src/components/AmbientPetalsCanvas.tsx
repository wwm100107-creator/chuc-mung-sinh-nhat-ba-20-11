import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export interface PetalsCanvasHandle {
  launchBurst: (originX?: number, originY?: number) => void;
  launchGrandCelebration: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  alpha: number;
  decay: number;
  gravity: number;
  color: string;
  kind: 'ambient' | 'burst';
}

const AMBIENT_COLORS = [
  'rgba(230, 184, 92, 0.58)',
  'rgba(246, 200, 110, 0.5)',
  'rgba(219, 134, 96, 0.42)',
];

const BURST_COLORS = ['#E6B85C', '#F6C86E', '#B83B32', '#9B2C2C', '#FFF2D6', '#D97B48'];

export const AmbientPetalsCanvas = forwardRef<PetalsCanvasHandle>(function AmbientPetalsCanvas(
  _props,
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const reducedMotionRef = useRef(false);

  const spawnAmbientPetal = (width: number, height: number, randomY: boolean): Particle => ({
    x: Math.random() * width,
    y: randomY ? Math.random() * height : -20,
    vx: (Math.random() - 0.5) * 0.45,
    vy: 0.35 + Math.random() * 0.5,
    size: 5 + Math.random() * 6,
    rotation: Math.random() * Math.PI * 2,
    vRot: (Math.random() - 0.5) * 0.018,
    alpha: 0.45 + Math.random() * 0.35,
    decay: 0,
    gravity: 0,
    color: AMBIENT_COLORS[Math.floor(Math.random() * AMBIENT_COLORS.length)],
    kind: 'ambient',
  });

  const emitBurst = (originX: number, originY: number, count: number) => {
    if (reducedMotionRef.current) return;
    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
      const speed = 2.4 + Math.random() * 5.8;
      particlesRef.current.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.6,
        size: 3.5 + Math.random() * 5.5,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.14,
        alpha: 1,
        decay: 0.01 + Math.random() * 0.009,
        gravity: 0.09,
        color: BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)],
        kind: 'burst',
      });
    }
  };

  useImperativeHandle(ref, () => ({
    launchBurst(originX?: number, originY?: number) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      emitBurst(originX ?? w * 0.5, originY ?? h * 0.42, 34);
    },
    launchGrandCelebration() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      emitBurst(w * 0.28, h * 0.34, 42);
      window.setTimeout(() => emitBurst(w * 0.72, h * 0.3, 44), 190);
      window.setTimeout(() => emitBurst(w * 0.5, h * 0.24, 52), 410);
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = media.matches;

    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();

    if (!reducedMotionRef.current) {
      const count = window.innerWidth < 640 ? 10 : 18;
      particlesRef.current = Array.from({ length: count }, () =>
        spawnAmbientPetal(window.innerWidth, window.innerHeight, true),
      );
    }

    let rafId = 0;

    const renderFrame = () => {
      rafId = window.requestAnimationFrame(renderFrame);
      if (document.hidden || reducedMotionRef.current) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const nextList: Particle[] = [];
      for (const p of particlesRef.current) {
        if (p.kind === 'ambient') {
          p.x += p.vx + Math.sin(p.y * 0.014) * 0.28;
          p.y += p.vy;
          p.rotation += p.vRot;

          if (p.y > h + 24) {
            nextList.push(spawnAmbientPetal(w, h, false));
          } else {
            nextList.push(p);
          }
        } else {
          p.vx *= 0.982;
          p.vy = p.vy * 0.982 + p.gravity;
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.vRot;
          p.alpha -= p.decay;

          if (p.alpha > 0.02) {
            nextList.push(p);
          }
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;

        // Soft teardrop chrysanthemum petal shape
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.48, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      particlesRef.current = nextList;
    };

    rafId = window.requestAnimationFrame(renderFrame);
    window.addEventListener('resize', updateSize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return <canvas ref={canvasRef} className="petals-canvas" aria-hidden="true" />;
});
