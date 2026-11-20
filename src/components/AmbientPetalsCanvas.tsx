import { forwardRef, useEffect, useImperativeHandle, useRef, type RefObject } from 'react';

export interface PetalsCanvasHandle {
  launchBurst: (originX?: number, originY?: number) => void;
  launchGrandCelebration: () => void;
}

interface AmbientPetalsCanvasProps {
  velocityRef?: RefObject<number>;
  nightMode?: boolean;
}

interface BokehOrb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  phase: number;
  color: string;
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
  hasRing: boolean;
}

interface RocketComet {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vx: number;
  vy: number;
  targetY: number;
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
  isStar: boolean;
}

const WATERCOLOR_SPARK_PALETTE = [
  { fill: '#F3C15A', ink: '#8C5B1F' },
  { fill: '#E39A3B', ink: '#7A4916' },
  { fill: '#D46A62', ink: '#7D2924' },
  { fill: '#87A684', ink: '#466146' },
  { fill: '#FFFDF6', ink: '#9A7B56' },
];

const BOKEH_COLORS = [
  'rgba(243, 193, 90, 0.28)',
  'rgba(227, 154, 59, 0.22)',
  'rgba(212, 106, 98, 0.16)',
  'rgba(135, 166, 132, 0.18)',
];

export const AmbientPetalsCanvas = forwardRef<PetalsCanvasHandle, AmbientPetalsCanvasProps>(
  function AmbientPetalsCanvas({ velocityRef }, ref) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const bokehRef = useRef<BokehOrb[]>([]);
    const botanicalsRef = useRef<BotanicalParticle[]>([]);
    const bloomsRef = useRef<WashBloom[]>([]);
    const rocketsRef = useRef<RocketComet[]>([]);
    const sparksRef = useRef<SparkParticle[]>([]);
    const reducedMotionRef = useRef(false);

    const createBokeh = (w: number, h: number): BokehOrb => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.28,
      vy: -(0.18 + Math.random() * 0.35),
      radius: 18 + Math.random() * 44,
      alpha: 0.25 + Math.random() * 0.45,
      phase: Math.random() * Math.PI * 2,
      color: BOKEH_COLORS[Math.floor(Math.random() * BOKEH_COLORS.length)],
    });

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
        vx: (Math.random() - 0.5) * 0.48,
        vy: 0.38 + Math.random() * 0.58,
        size: 8 + Math.random() * 8,
        rotZ: Math.random() * Math.PI * 2,
        vRotZ: (Math.random() - 0.5) * 0.02,
        tilt3D: Math.random() * Math.PI * 2,
        vTilt: 0.02 + Math.random() * 0.028,
        alpha: 0.65 + Math.random() * 0.32,
        variant: variants[Math.floor(Math.random() * variants.length)],
        phase: Math.random() * Math.PI * 2,
      };
    };

    const spawnWatercolorBurst = (originX: number, originY: number, count: number) => {
      if (reducedMotionRef.current) return;

      bloomsRef.current.push({
        x: originX,
        y: originY,
        radius: 10,
        maxRadius: 170 + Math.random() * 80,
        alpha: 0.42,
        colorInner: 'rgba(243, 193, 90, 0.62)',
        colorOuter: 'rgba(212, 106, 98, 0)',
        hasRing: true,
      });

      // Outer petal & golden spark ring
      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.22;
        const speed = 2.5 + Math.random() * 7.2;
        const swatch =
          WATERCOLOR_SPARK_PALETTE[Math.floor(Math.random() * WATERCOLOR_SPARK_PALETTE.length)];
        sparksRef.current.push({
          x: originX,
          y: originY,
          prevX: originX,
          prevY: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.4,
          size: 4.5 + Math.random() * 5.8,
          alpha: 0.98,
          decay: 0.008 + Math.random() * 0.008,
          gravity: 0.068,
          drag: 0.978,
          fillColor: swatch.fill,
          inkColor: swatch.ink,
          rot: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.14,
          isStar: i % 3 === 0,
        });
      }
    };

    const launchRocket = (startX: number, targetY: number) => {
      if (reducedMotionRef.current) return;
      const h = window.innerHeight;
      rocketsRef.current.push({
        x: startX,
        y: h + 12,
        prevX: startX,
        prevY: h + 12,
        vx: (Math.random() - 0.5) * 1.4,
        vy: -(11 + Math.random() * 3.5),
        targetY,
      });
    };

    useImperativeHandle(ref, () => ({
      launchBurst(originX?: number, originY?: number) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        spawnWatercolorBurst(originX ?? w * 0.5, originY ?? h * 0.44, 44);
      },
      launchGrandCelebration() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        spawnWatercolorBurst(w * 0.5, h * 0.34, 58);
        launchRocket(w * 0.24, h * 0.28);
        window.setTimeout(() => launchRocket(w * 0.76, h * 0.26), 170);
        window.setTimeout(() => launchRocket(w * 0.36, h * 0.22), 340);
        window.setTimeout(() => launchRocket(w * 0.64, h * 0.3), 510);
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
        const bCount = isMobile ? 15 : 24;
        const orbCount = isMobile ? 14 : 22;
        botanicalsRef.current = Array.from({ length: bCount }, () =>
          createBotanical(window.innerWidth, window.innerHeight, true),
        );
        bokehRef.current = Array.from({ length: orbCount }, () =>
          createBokeh(window.innerWidth, window.innerHeight),
        );
      }

      // Interactive pointer/touch watercolor ribbon & tap ripples
      let lastTrailTime = 0;
      const onMove = (clientX: number, clientY: number) => {
        if (reducedMotionRef.current) return;
        const now = performance.now();
        if (now - lastTrailTime < 28) return;
        lastTrailTime = now;

        for (let i = 0; i < 2; i += 1) {
          const swatch =
            WATERCOLOR_SPARK_PALETTE[Math.floor(Math.random() * WATERCOLOR_SPARK_PALETTE.length)];
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.5 + Math.random() * 1.4;
          sparksRef.current.push({
            x: clientX + (Math.random() - 0.5) * 8,
            y: clientY + (Math.random() - 0.5) * 8,
            prevX: clientX,
            prevY: clientY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.35,
            size: 3.4 + Math.random() * 3.4,
            alpha: 0.85,
            decay: 0.024,
            gravity: 0.022,
            drag: 0.95,
            fillColor: swatch.fill,
            inkColor: swatch.ink,
            rot: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.1,
            isStar: i === 0,
          });
        }
      };

      const onPointerDown = (e: PointerEvent) => {
        if (reducedMotionRef.current) return;
        bloomsRef.current.push({
          x: e.clientX,
          y: e.clientY,
          radius: 6,
          maxRadius: 72,
          alpha: 0.35,
          colorInner: 'rgba(243, 193, 90, 0.45)',
          colorOuter: 'rgba(243, 193, 90, 0)',
          hasRing: true,
        });
      };

      const onPointerMove = (e: PointerEvent) => onMove(e.clientX, e.clientY);
      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          onMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      };

      window.addEventListener('pointerdown', onPointerDown, { passive: true });
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: true });

      const drawHandPaintedPetal = (len: number, wid: number, fill: string, ink: string) => {
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
          ctx.strokeStyle = 'rgba(110, 82, 57, 0.58)';
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
          Math.sin(time * 0.0011) * (0.38 + Math.min(Math.abs(scrollVel) * 0.065, 1.8));
        const breezeY = -scrollVel * 0.12;

        // 1. Ambient Parallax Watercolor Bokeh & Sun-Motes
        for (const orb of bokehRef.current) {
          orb.x += orb.vx + Math.sin(time * 0.001 + orb.phase) * 0.25 + breezeX * 0.35;
          orb.y += orb.vy + breezeY * 0.35;
          if (orb.y < -orb.radius) orb.y = h + orb.radius;
          if (orb.y > h + orb.radius) orb.y = -orb.radius;
          if (orb.x < -orb.radius) orb.x = w + orb.radius;
          if (orb.x > w + orb.radius) orb.x = -orb.radius;

          const pulse = 0.55 + 0.45 * Math.sin(time * 0.0024 + orb.phase);
          ctx.save();
          ctx.globalAlpha = orb.alpha * pulse;
          const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
          g.addColorStop(0, orb.color);
          g.addColorStop(1, 'rgba(251, 246, 238, 0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // 2. Expanding Watercolor Wash Blooms & Ripple Rings
        const nextBlooms: WashBloom[] = [];
        for (const b of bloomsRef.current) {
          b.radius += (b.maxRadius - b.radius) * 0.095;
          b.alpha *= 0.935;
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

            if (b.hasRing) {
              ctx.strokeStyle = 'rgba(201, 138, 44, 0.55)';
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.arc(b.x, b.y, b.radius * 0.85, 0, Math.PI * 2);
              ctx.stroke();
            }
            ctx.restore();
          }
        }
        bloomsRef.current = nextBlooms;

        // 3. Rising Firework Comet Rockets
        const nextRockets: RocketComet[] = [];
        for (const r of rocketsRef.current) {
          r.prevX = r.x;
          r.prevY = r.y;
          r.x += r.vx;
          r.y += r.vy;
          r.vy *= 0.965;

          sparksRef.current.push({
            x: r.x,
            y: r.y,
            prevX: r.prevX,
            prevY: r.prevY,
            vx: (Math.random() - 0.5) * 0.9,
            vy: 0.7 + Math.random() * 1.1,
            size: 2.8,
            alpha: 0.8,
            decay: 0.042,
            gravity: 0.03,
            drag: 0.92,
            fillColor: '#F3C15A',
            inkColor: '#8C5B1F',
            rot: Math.random() * Math.PI,
            vRot: 0.06,
            isStar: true,
          });

          ctx.save();
          ctx.strokeStyle = '#C98A2C';
          ctx.lineWidth = 2.4;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(r.prevX, r.prevY);
          ctx.lineTo(r.x, r.y);
          ctx.stroke();
          ctx.restore();

          if (r.y <= r.targetY || Math.abs(r.vy) < 1.8) {
            spawnWatercolorBurst(r.x, r.y, 52);
          } else {
            nextRockets.push(r);
          }
        }
        rocketsRef.current = nextRockets;

        // 4. Drifting Fine-Line Ink & Watercolor Botanicals
        for (let i = 0; i < botanicalsRef.current.length; i += 1) {
          const p = botanicalsRef.current[i];
          p.x += p.vx + Math.sin(p.y * 0.012 + p.phase + time * 0.0009) * 0.4 + breezeX;
          p.y += p.vy + breezeY * 0.5;
          p.rotZ += p.vRotZ + scrollVel * 0.0016;
          p.tilt3D += p.vTilt + Math.abs(scrollVel) * 0.0024;

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
              'rgba(235, 174, 72, 0.86)',
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

        // 5. Hand-Painted Petal Burst Sparks & Golden Stardust Trail
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
            ctx.globalAlpha = Math.max(0, s.alpha);

            if (s.isStar) {
              // Glowing golden streak + luminous pearl dot
              ctx.strokeStyle = s.fillColor;
              ctx.lineWidth = s.size * 0.48;
              ctx.lineCap = 'round';
              ctx.beginPath();
              ctx.moveTo(s.prevX, s.prevY);
              ctx.lineTo(s.x, s.y);
              ctx.stroke();

              ctx.fillStyle = '#FFFDF5';
              ctx.beginPath();
              ctx.arc(s.x, s.y, s.size * 0.35, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.translate(s.x, s.y);
              ctx.rotate(s.rot);
              drawHandPaintedPetal(s.size, s.size * 0.5, s.fillColor, s.inkColor);
            }
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
        window.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('touchmove', onTouchMove);
      };
    }, [velocityRef]);

    return <canvas ref={canvasRef} className="petals-canvas" aria-hidden="true" />;
  },
);
