import { forwardRef, useEffect, useImperativeHandle, useRef, type RefObject } from 'react';

export interface PetalsCanvasHandle {
  launchBurst: (originX?: number, originY?: number) => void;
  launchGrandCelebration: () => void;
}

interface AmbientPetalsCanvasProps {
  velocityRef?: RefObject<number>;
  nightMode?: boolean;
}

interface BotanicalParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotZ: number;
  vRotZ: number;
  tilt3D: number;
  vTilt: number;
  alpha: number;
  variant: 'gold-petal' | 'daisy' | 'sage-leaf' | 'rose-petal';
  phase: number;
}

interface WashBloom {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  colorInner: string;
  colorOuter: string;
}

interface SparkParticle {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  gravity: number;
  drag: number;
  fillColor: string;
  inkColor: string;
  rot: number;
  vRot: number;
}

const WATERCOLOR_SPARK_PALETTE = [
  { fill: '#F3C15A', ink: '#8C5B1F' },
  { fill: '#E39A3B', ink: '#7A4916' },
  { fill: '#D46A62', ink: '#7D2924' },
  { fill: '#87A684', ink: '#466146' },
  { fill: '#FFFDF6', ink: '#9A7B56' },
];

export const AmbientPetalsCanvas = forwardRef<PetalsCanvasHandle, AmbientPetalsCanvasProps>(
  function AmbientPetalsCanvas({ velocityRef }, ref) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const botanicalsRef = useRef<BotanicalParticle[]>([]);
    const bloomsRef = useRef<WashBloom[]>([]);
    const sparksRef = useRef<SparkParticle[]>([]);
    const reducedMotionRef = useRef(false);

    const createBotanical = (w: number, h: number, randomY: boolean): BotanicalParticle => {
      const variants: Array<BotanicalParticle['variant']> = [
        'gold-petal',
        'gold-petal',
        'gold-petal',
        'daisy',
        'sage-leaf',
        'rose-petal',
      ];
      return {
        x: Math.random() * w,
        y: randomY ? Math.random() * h : -32,
        vx: (Math.random() - 0.5) * 0.45,
        vy: 0.36 + Math.random() * 0.55,
        size: 8 + Math.random() * 7.5,
        rotZ: Math.random() * Math.PI * 2,
        vRotZ: (Math.random() - 0.5) * 0.018,
        tilt3D: Math.random() * Math.PI * 2,
        vTilt: 0.018 + Math.random() * 0.025,
        alpha: 0.62 + Math.random() * 0.32,
        variant: variants[Math.floor(Math.random() * variants.length)],
        phase: Math.random() * Math.PI * 2,
      };
    };

    const spawnWatercolorBurst = (originX: number, originY: number, count: number) => {
      if (reducedMotionRef.current) return;

      // Soft expanding watercolor wash bloom behind the burst
      bloomsRef.current.push({
        x: originX,
        y: originY,
        radius: 14,
        maxRadius: 150 + Math.random() * 70,
        alpha: 0.34,
        colorInner: 'rgba(243, 193, 90, 0.55)',
        colorOuter: 'rgba(212, 106, 98, 0)',
      });

      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.25;
        const speed = 2.2 + Math.random() * 6.5;
        const swatch =
          WATERCOLOR_SPARK_PALETTE[Math.floor(Math.random() * WATERCOLOR_SPARK_PALETTE.length)];
        sparksRef.current.push({
          x: originX,
          y: originY,
          prevX: originX,
          prevY: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.3,
          size: 4.5 + Math.random() * 5.5,
          alpha: 0.95,
          decay: 0.0085 + Math.random() * 0.008,
          gravity: 0.068,
          drag: 0.978,
          fillColor: swatch.fill,
          inkColor: swatch.ink,
          rot: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.12,
        });
      }
    };

    useImperativeHandle(ref, () => ({
      launchBurst(originX?: number, originY?: number) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        spawnWatercolorBurst(originX ?? w * 0.5, originY ?? h * 0.44, 38);
      },
      launchGrandCelebration() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        spawnWatercolorBurst(w * 0.5, h * 0.35, 52);
        window.setTimeout(() => spawnWatercolorBurst(w * 0.26, h * 0.32, 42), 180);
        window.setTimeout(() => spawnWatercolorBurst(w * 0.74, h * 0.3, 44), 360);
        window.setTimeout(() => spawnWatercolorBurst(w * 0.5, h * 0.24, 56), 550);
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
        const isMobile = window.innerWidth < 640;
        const count = isMobile ? 14 : 22;
        botanicalsRef.current = Array.from({ length: count }, () =>
          createBotanical(window.innerWidth, window.innerHeight, true),
        );
      }

      // Delicate watercolor petal trail on touch / pointer move
      let lastTrailTime = 0;
      const onMove = (clientX: number, clientY: number) => {
        if (reducedMotionRef.current) return;
        const now = performance.now();
        if (now - lastTrailTime < 42) return;
        lastTrailTime = now;

        const swatch =
          WATERCOLOR_SPARK_PALETTE[Math.floor(Math.random() * WATERCOLOR_SPARK_PALETTE.length)];
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.4 + Math.random() * 1.1;
        sparksRef.current.push({
          x: clientX,
          y: clientY,
          prevX: clientX,
          prevY: clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.3,
          size: 3.8 + Math.random() * 3.2,
          alpha: 0.78,
          decay: 0.022,
          gravity: 0.025,
          drag: 0.95,
          fillColor: swatch.fill,
          inkColor: swatch.ink,
          rot: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.08,
        });
      };

      const onPointerMove = (e: PointerEvent) => onMove(e.clientX, e.clientY);
      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          onMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      };

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: true });

      const drawHandPaintedPetal = (
        len: number,
        wid: number,
        fill: string,
        ink: string,
      ) => {
        ctx.beginPath();
        ctx.moveTo(-len, 0);
        ctx.bezierCurveTo(-len * 0.35, -wid, len * 0.55, -wid * 0.88, len, 0);
        ctx.bezierCurveTo(len * 0.55, wid * 0.88, -len * 0.35, wid, -len, 0);
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = ink;
        ctx.lineWidth = 0.75;
        ctx.stroke();

        // Fine sepia ink center vein
        ctx.beginPath();
        ctx.moveTo(-len * 0.65, 0);
        ctx.quadraticCurveTo(0, -wid * 0.14, len * 0.55, 0);
        ctx.strokeStyle = ink;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      };

      const drawTinyDaisy = (radius: number) => {
        const petals = 8;
        for (let i = 0; i < petals; i += 1) {
          ctx.save();
          ctx.rotate((Math.PI * 2 * i) / petals);
          ctx.beginPath();
          ctx.ellipse(radius * 0.58, 0, radius * 0.44, radius * 0.2, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFDF7';
          ctx.fill();
          ctx.strokeStyle = 'rgba(110, 82, 57, 0.55)';
          ctx.lineWidth = 0.55;
          ctx.stroke();
          ctx.restore();
        }
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = '#E8A838';
        ctx.fill();
        ctx.strokeStyle = '#7A4E1D';
        ctx.lineWidth = 0.6;
        ctx.stroke();
      };

      let rafId = 0;

      const renderFrame = (time: number) => {
        rafId = window.requestAnimationFrame(renderFrame);
        if (document.hidden || reducedMotionRef.current) return;

        const w = window.innerWidth;
        const h = window.innerHeight;
        ctx.clearRect(0, 0, w, h);

        const scrollVel = velocityRef?.current ?? 0;
        const breezeX =
          Math.sin(time * 0.0011) * (0.35 + Math.min(Math.abs(scrollVel) * 0.06, 1.6));
        const breezeY = -scrollVel * 0.1;

        // 1. Expanding Watercolor Wash Blooms
        const nextBlooms: WashBloom[] = [];
        for (const b of bloomsRef.current) {
          b.radius += (b.maxRadius - b.radius) * 0.08;
          b.alpha *= 0.94;
          if (b.alpha > 0.015) {
            nextBlooms.push(b);
            ctx.save();
            ctx.globalAlpha = b.alpha;
            const g = ctx.createRadialGradient(b.x, b.y, 4, b.x, b.y, b.radius);
            g.addColorStop(0, b.colorInner);
            g.addColorStop(1, b.colorOuter);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
        bloomsRef.current = nextBlooms;

        // 2. Drifting Fine-Line Ink & Watercolor Botanicals
        for (let i = 0; i < botanicalsRef.current.length; i += 1) {
          const p = botanicalsRef.current[i];
          p.x += p.vx + Math.sin(p.y * 0.012 + p.phase + time * 0.0009) * 0.38 + breezeX;
          p.y += p.vy + breezeY * 0.5;
          p.rotZ += p.vRotZ + scrollVel * 0.0014;
          p.tilt3D += p.vTilt + Math.abs(scrollVel) * 0.002;

          if (p.y > h + 36) {
            botanicalsRef.current[i] = createBotanical(w, h, false);
          } else if (p.y < -45) {
            p.y = h + 24;
          }
          if (p.x > w + 36) p.x = -24;
          if (p.x < -36) p.x = w + 24;

          const tiltY = Math.max(0.28, Math.abs(Math.cos(p.tilt3D)));
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotZ);
          ctx.scale(1, p.variant === 'daisy' ? 0.75 + tiltY * 0.25 : tiltY);
          ctx.globalAlpha = Math.max(0, p.alpha);

          if (p.variant === 'gold-petal') {
            drawHandPaintedPetal(
              p.size,
              p.size * 0.48,
              'rgba(235, 174, 72, 0.85)',
              'rgba(116, 72, 28, 0.65)',
            );
          } else if (p.variant === 'rose-petal') {
            drawHandPaintedPetal(
              p.size * 0.9,
              p.size * 0.46,
              'rgba(204, 96, 90, 0.82)',
              'rgba(104, 38, 34, 0.62)',
            );
          } else if (p.variant === 'sage-leaf') {
            drawHandPaintedPetal(
              p.size * 1.05,
              p.size * 0.44,
              'rgba(134, 164, 130, 0.82)',
              'rgba(62, 86, 62, 0.62)',
            );
          } else {
            drawTinyDaisy(p.size * 0.85);
          }

          ctx.restore();
        }

        // 3. Hand-Painted Petal Burst Sparks & Touch Trail
        const nextSparks: SparkParticle[] = [];
        for (const s of sparksRef.current) {
          s.prevX = s.x;
          s.prevY = s.y;
          s.vx *= s.drag;
          s.vy = s.vy * s.drag + s.gravity;
          s.x += s.vx;
          s.y += s.vy;
          s.rot += s.vRot;
          s.alpha -= s.decay;

          if (s.alpha > 0.02) {
            nextSparks.push(s);
            ctx.save();
            ctx.translate(s.x, s.y);
            ctx.rotate(s.rot);
            ctx.globalAlpha = Math.max(0, s.alpha);
            drawHandPaintedPetal(s.size, s.size * 0.5, s.fillColor, s.inkColor);
            ctx.restore();
          }
        }
        sparksRef.current = nextSparks;
      };

      rafId = window.requestAnimationFrame(renderFrame);
      window.addEventListener('resize', updateSize);

      return () => {
        window.cancelAnimationFrame(rafId);
        window.removeEventListener('resize', updateSize);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('touchmove', onTouchMove);
      };
    }, [velocityRef]);

    return <canvas ref={canvasRef} className="petals-canvas" aria-hidden="true" />;
  },
);
