import { forwardRef, useEffect, useImperativeHandle, useRef, type RefObject } from 'react';

export interface PetalsCanvasHandle {
  launchBurst: (originX?: number, originY?: number) => void;
  launchGrandCelebration: () => void;
}

interface AmbientPetalsCanvasProps {
  velocityRef?: RefObject<number>;
  nightMode?: boolean;
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
  phase: number;
  kind: 'ambient' | 'burst' | 'ember';
}

const AMBIENT_COLORS = [
  'rgba(230, 184, 92, 0.58)',
  'rgba(246, 200, 110, 0.5)',
  'rgba(219, 134, 96, 0.42)',
];

const BURST_COLORS = ['#E6B85C', '#F6C86E', '#B83B32', '#9B2C2C', '#FFF2D6', '#D97B48'];

export const AmbientPetalsCanvas = forwardRef<PetalsCanvasHandle, AmbientPetalsCanvasProps>(
  function AmbientPetalsCanvas({ velocityRef, nightMode = false }, ref) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const reducedMotionRef = useRef(false);
    const nightModeRef = useRef(nightMode);
    nightModeRef.current = nightMode;

    const spawnAmbientPetal = (width: number, height: number, randomY: boolean): Particle => ({
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -20,
      vx: (Math.random() - 0.5) * 0.42,
      vy: 0.32 + Math.random() * 0.48,
      size: 5 + Math.random() * 5.5,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.018,
      alpha: 0.42 + Math.random() * 0.35,
      decay: 0,
      gravity: 0,
      color: AMBIENT_COLORS[Math.floor(Math.random() * AMBIENT_COLORS.length)],
      phase: Math.random() * Math.PI * 2,
      kind: 'ambient',
    });

    const spawnEmber = (width: number, height: number, randomY: boolean): Particle => ({
      x: Math.random() * width,
      y: randomY ? Math.random() * height : height + 16,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -(0.38 + Math.random() * 0.55),
      size: 2.2 + Math.random() * 3.2,
      rotation: 0,
      vRot: 0,
      alpha: 0.35 + Math.random() * 0.45,
      decay: 0,
      gravity: 0,
      color: '#F6C86E',
      phase: Math.random() * Math.PI * 2,
      kind: 'ember',
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
          phase: 0,
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
        const isSmall = window.innerWidth < 640;
        const petalCount = isSmall ? 9 : 15;
        const emberCount = isSmall ? 6 : 11;
        particlesRef.current = [
          ...Array.from({ length: petalCount }, () =>
            spawnAmbientPetal(window.innerWidth, window.innerHeight, true),
          ),
          ...Array.from({ length: emberCount }, () =>
            spawnEmber(window.innerWidth, window.innerHeight, true),
          ),
        ];
      }

      let rafId = 0;

      const renderFrame = (time: number) => {
        rafId = window.requestAnimationFrame(renderFrame);
        if (document.hidden || reducedMotionRef.current) return;

        const w = window.innerWidth;
        const h = window.innerHeight;
        ctx.clearRect(0, 0, w, h);

        const scrollVel = velocityRef?.current ?? 0;
        const breezeX = Math.sin(time * 0.0012) * Math.min(Math.abs(scrollVel) * 0.06, 1.4);
        const breezeY = -scrollVel * 0.08;
        const isNight = nightModeRef.current;

        const nextList: Particle[] = [];
        for (const p of particlesRef.current) {
          if (p.kind === 'ambient') {
            p.x += p.vx + Math.sin(p.y * 0.014 + p.phase) * 0.28 + breezeX;
            p.y += p.vy + breezeY * 0.5;
            p.rotation += p.vRot + scrollVel * 0.002;

            if (p.y > h + 28) {
              nextList.push(spawnAmbientPetal(w, h, false));
            } else if (p.y < -40) {
              p.y = h + 18;
              nextList.push(p);
            } else {
              nextList.push(p);
            }

            const drawAlpha = isNight ? p.alpha * 0.45 : p.alpha;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.globalAlpha = Math.max(0, drawAlpha);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size, p.size * 0.48, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else if (p.kind === 'ember') {
            p.x += p.vx + Math.sin(time * 0.0015 + p.phase) * 0.35 + breezeX * 0.7;
            p.y += p.vy + breezeY * 0.4;

            if (p.y < -24) {
              nextList.push(spawnEmber(w, h, false));
            } else if (p.y > h + 34) {
              p.y = -12;
              nextList.push(p);
            } else {
              nextList.push(p);
            }

            if (isNight) {
              const pulse = 0.55 + 0.45 * Math.sin(time * 0.004 + p.phase);
              ctx.save();
              ctx.globalAlpha = p.alpha * pulse;
              const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3.2);
              grad.addColorStop(0, '#FFF5D6');
              grad.addColorStop(0.4, 'rgba(246, 200, 110, 0.75)');
              grad.addColorStop(1, 'rgba(246, 200, 110, 0)');
              ctx.fillStyle = grad;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size * 3.2, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
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
              ctx.save();
              ctx.translate(p.x, p.y);
              ctx.rotate(p.rotation);
              ctx.globalAlpha = Math.max(0, p.alpha);
              ctx.fillStyle = p.color;
              ctx.beginPath();
              ctx.ellipse(0, 0, p.size, p.size * 0.48, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          }
        }

        particlesRef.current = nextList;
      };

      rafId = window.requestAnimationFrame(renderFrame);
      window.addEventListener('resize', updateSize);

      return () => {
        window.cancelAnimationFrame(rafId);
        window.removeEventListener('resize', updateSize);
      };
    }, [velocityRef]);

    return <canvas ref={canvasRef} className="petals-canvas" aria-hidden="true" />;
  },
);
