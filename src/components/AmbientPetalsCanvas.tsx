import { forwardRef, useEffect, useImperativeHandle, useRef, type RefObject } from 'react';

export interface PetalsCanvasHandle {
  launchBurst: (originX?: number, originY?: number) => void;
  launchGrandCelebration: () => void;
}

interface AmbientPetalsCanvasProps {
  velocityRef?: RefObject<number>;
  nightMode?: boolean;
}

interface PetalParticle {
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
  hueType: 'gold' | 'crimson' | 'ivory';
  phase: number;
}

interface FireflyParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  phase: number;
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
  color: string;
  twinkle: boolean;
}

interface RocketParticle {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vx: number;
  vy: number;
  targetY: number;
  color: string;
}

interface ShockwaveRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

const SPARK_PALETTE = [
  '#FFE79A',
  '#F6C86E',
  '#E6A832',
  '#FF7B6B',
  '#D93829',
  '#FFF8E7',
  '#FFD166',
];

export const AmbientPetalsCanvas = forwardRef<PetalsCanvasHandle, AmbientPetalsCanvasProps>(
  function AmbientPetalsCanvas({ velocityRef, nightMode = false }, ref) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const petalsRef = useRef<PetalParticle[]>([]);
    const firefliesRef = useRef<FireflyParticle[]>([]);
    const sparksRef = useRef<SparkParticle[]>([]);
    const rocketsRef = useRef<RocketParticle[]>([]);
    const ringsRef = useRef<ShockwaveRing[]>([]);
    const reducedMotionRef = useRef(false);
    const nightModeRef = useRef(nightMode);
    nightModeRef.current = nightMode;

    const createPetal = (w: number, h: number, randomY: boolean): PetalParticle => {
      const types: Array<PetalParticle['hueType']> = ['gold', 'gold', 'crimson', 'ivory'];
      return {
        x: Math.random() * w,
        y: randomY ? Math.random() * h : -28,
        vx: (Math.random() - 0.5) * 0.55,
        vy: 0.42 + Math.random() * 0.65,
        size: 7 + Math.random() * 7.5,
        rotZ: Math.random() * Math.PI * 2,
        vRotZ: (Math.random() - 0.5) * 0.024,
        tilt3D: Math.random() * Math.PI * 2,
        vTilt: 0.022 + Math.random() * 0.032,
        alpha: 0.55 + Math.random() * 0.38,
        hueType: types[Math.floor(Math.random() * types.length)],
        phase: Math.random() * Math.PI * 2,
      };
    };

    const createFirefly = (w: number, h: number, randomY: boolean): FireflyParticle => ({
      x: Math.random() * w,
      y: randomY ? Math.random() * h : h + 20,
      vx: (Math.random() - 0.5) * 0.45,
      vy: -(0.35 + Math.random() * 0.65),
      radius: 2 + Math.random() * 3.2,
      alpha: 0.4 + Math.random() * 0.55,
      phase: Math.random() * Math.PI * 2,
    });

    const explodeFireworkShell = (originX: number, originY: number, count: number) => {
      if (reducedMotionRef.current) return;

      // Expanding golden shockwave halo
      ringsRef.current.push({
        x: originX,
        y: originY,
        radius: 6,
        maxRadius: 120 + Math.random() * 60,
        alpha: 0.72,
        color: '#F6C86E',
      });

      // Outer chrysanthemum streak ring
      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.18;
        const speed = 3.2 + Math.random() * 7.4;
        const color = SPARK_PALETTE[Math.floor(Math.random() * SPARK_PALETTE.length)];
        sparksRef.current.push({
          x: originX,
          y: originY,
          prevX: originX,
          prevY: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.1,
          size: 2 + Math.random() * 2.6,
          alpha: 1,
          decay: 0.0085 + Math.random() * 0.009,
          gravity: 0.085,
          drag: 0.976,
          color,
          twinkle: Math.random() > 0.45,
        });
      }

      // Inner golden core Pistil ring
      const coreCount = Math.floor(count * 0.45);
      for (let i = 0; i < coreCount; i += 1) {
        const angle = (Math.PI * 2 * i) / coreCount;
        const speed = 1.4 + Math.random() * 2.8;
        sparksRef.current.push({
          x: originX,
          y: originY,
          prevX: originX,
          prevY: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          size: 1.8 + Math.random() * 1.8,
          alpha: 1,
          decay: 0.013 + Math.random() * 0.01,
          gravity: 0.05,
          drag: 0.965,
          color: '#FFF6D6',
          twinkle: true,
        });
      }
    };

    const launchRocket = (startX: number, targetY: number) => {
      if (reducedMotionRef.current) return;
      const h = window.innerHeight;
      rocketsRef.current.push({
        x: startX,
        y: h + 10,
        prevX: startX,
        prevY: h + 10,
        vx: (Math.random() - 0.5) * 1.6,
        vy: -(11.5 + Math.random() * 3.5),
        targetY,
        color: '#FFE38E',
      });
    };

    useImperativeHandle(ref, () => ({
      launchBurst(originX?: number, originY?: number) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        explodeFireworkShell(originX ?? w * 0.5, originY ?? h * 0.42, 48);
      },
      launchGrandCelebration() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        explodeFireworkShell(w * 0.5, h * 0.34, 64);
        launchRocket(w * 0.24, h * 0.28);
        window.setTimeout(() => launchRocket(w * 0.76, h * 0.26), 160);
        window.setTimeout(() => launchRocket(w * 0.38, h * 0.22), 340);
        window.setTimeout(() => launchRocket(w * 0.64, h * 0.3), 520);
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
        const pCount = isMobile ? 16 : 26;
        const fCount = isMobile ? 14 : 24;
        petalsRef.current = Array.from({ length: pCount }, () =>
          createPetal(window.innerWidth, window.innerHeight, true),
        );
        firefliesRef.current = Array.from({ length: fCount }, () =>
          createFirefly(window.innerWidth, window.innerHeight, true),
        );
      }

      // Interactive pointer / touch stardust trail
      let lastTrailTime = 0;
      const spawnTrailPoint = (clientX: number, clientY: number) => {
        if (reducedMotionRef.current) return;
        const now = performance.now();
        if (now - lastTrailTime < 24) return;
        lastTrailTime = now;

        for (let i = 0; i < 2; i += 1) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.5 + Math.random() * 1.6;
          sparksRef.current.push({
            x: clientX + (Math.random() - 0.5) * 10,
            y: clientY + (Math.random() - 0.5) * 10,
            prevX: clientX,
            prevY: clientY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.4,
            size: 1.6 + Math.random() * 1.8,
            alpha: 0.82,
            decay: 0.028 + Math.random() * 0.015,
            gravity: 0.02,
            drag: 0.94,
            color: i === 0 ? '#F6C86E' : '#FFE8A3',
            twinkle: true,
          });
        }
      };

      const onPointerMove = (e: PointerEvent) => {
        spawnTrailPoint(e.clientX, e.clientY);
      };

      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          spawnTrailPoint(e.touches[0].clientX, e.touches[0].clientY);
        }
      };

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: true });

      let rafId = 0;

      const draw3DPetal = (p: PetalParticle, nightAlphaFactor: number, time: number) => {
        const tiltScale = Math.cos(p.tilt3D);
        const absTilt = Math.abs(tiltScale);
        const shimmer = 0.5 + 0.5 * Math.sin(p.tilt3D * 2 + time * 0.003);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotZ);
        ctx.scale(1, Math.max(0.22, absTilt));
        ctx.globalAlpha = Math.max(0, p.alpha * nightAlphaFactor);

        const len = p.size;
        const wid = p.size * 0.52;

        // Organic curved chrysanthemum petal silhouette
        ctx.beginPath();
        ctx.moveTo(-len, 0);
        ctx.bezierCurveTo(-len * 0.35, -wid, len * 0.55, -wid * 0.9, len, 0);
        ctx.bezierCurveTo(len * 0.55, wid * 0.9, -len * 0.35, wid, -len, 0);
        ctx.closePath();

        if (p.hueType === 'gold') {
          ctx.fillStyle = shimmer > 0.72 ? '#FCE29C' : '#E6B85C';
        } else if (p.hueType === 'crimson') {
          ctx.fillStyle = shimmer > 0.75 ? '#D65A4E' : '#A6302A';
        } else {
          ctx.fillStyle = '#FFF7E4';
        }
        ctx.fill();

        // Specular gold edge highlight when catching light
        if (shimmer > 0.68) {
          ctx.strokeStyle = 'rgba(255, 248, 220, 0.75)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
        ctx.restore();
      };

      const renderFrame = (time: number) => {
        rafId = window.requestAnimationFrame(renderFrame);
        if (document.hidden || reducedMotionRef.current) return;

        const w = window.innerWidth;
        const h = window.innerHeight;
        ctx.clearRect(0, 0, w, h);

        const scrollVel = velocityRef?.current ?? 0;
        const isNight = nightModeRef.current;

        // 1. Subtle volumetric sunbeams (Day) or warm aurora mist (Night)
        ctx.save();
        if (!isNight) {
          const rayGrad = ctx.createRadialGradient(
            w * 0.5,
            -h * 0.1,
            20,
            w * 0.5,
            h * 0.35,
            Math.max(w, h) * 0.75,
          );
          rayGrad.addColorStop(0, 'rgba(246, 200, 110, 0.16)');
          rayGrad.addColorStop(0.5, 'rgba(230, 184, 92, 0.05)');
          rayGrad.addColorStop(1, 'rgba(251, 246, 238, 0)');
          ctx.fillStyle = rayGrad;
          ctx.fillRect(0, 0, w, h);
        } else {
          const nightGrad = ctx.createRadialGradient(
            w * 0.5,
            h * 0.55,
            10,
            w * 0.5,
            h * 0.55,
            Math.max(w, h) * 0.65,
          );
          nightGrad.addColorStop(0, 'rgba(246, 200, 110, 0.09)');
          nightGrad.addColorStop(1, 'rgba(34, 24, 28, 0)');
          ctx.fillStyle = nightGrad;
          ctx.fillRect(0, 0, w, h);
        }
        ctx.restore();

        const breezeX = Math.sin(time * 0.0012) * (0.4 + Math.min(Math.abs(scrollVel) * 0.07, 1.8));
        const breezeY = -scrollVel * 0.12;

        // 2. 3D Tumbling Botanical Petals
        for (let i = 0; i < petalsRef.current.length; i += 1) {
          const p = petalsRef.current[i];
          p.x += p.vx + Math.sin(p.y * 0.013 + p.phase + time * 0.001) * 0.42 + breezeX;
          p.y += p.vy + breezeY * 0.55;
          p.rotZ += p.vRotZ + scrollVel * 0.0018;
          p.tilt3D += p.vTilt + Math.abs(scrollVel) * 0.003;

          if (p.y > h + 32) {
            petalsRef.current[i] = createPetal(w, h, false);
          } else if (p.y < -45) {
            p.y = h + 20;
          }
          if (p.x > w + 32) p.x = -20;
          if (p.x < -32) p.x = w + 20;

          draw3DPetal(p, isNight ? 0.55 : 1, time);
        }

        // 3. Glowing Fireflies / Golden Dust Motes
        for (let i = 0; i < firefliesRef.current.length; i += 1) {
          const f = firefliesRef.current[i];
          f.x += f.vx + Math.sin(time * 0.0016 + f.phase) * 0.38 + breezeX * 0.5;
          f.y += f.vy + breezeY * 0.45;

          if (f.y < -28) {
            firefliesRef.current[i] = createFirefly(w, h, false);
          } else if (f.y > h + 36) {
            f.y = -14;
          }

          const pulse = 0.45 + 0.55 * Math.sin(time * 0.0038 + f.phase);
          const visibility = isNight ? 1 : 0.45;
          const r = f.radius * (isNight ? 3.6 : 2.4);

          ctx.save();
          ctx.globalAlpha = f.alpha * pulse * visibility;
          const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
          g.addColorStop(0, '#FFFDF2');
          g.addColorStop(0.38, 'rgba(246, 200, 110, 0.85)');
          g.addColorStop(1, 'rgba(246, 200, 110, 0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(f.x, f.y, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // 4. Rising Firework Rockets
        const nextRockets: RocketParticle[] = [];
        for (const r of rocketsRef.current) {
          r.prevX = r.x;
          r.prevY = r.y;
          r.x += r.vx;
          r.y += r.vy;
          r.vy *= 0.965;

          // Emit golden rocket tail sparks
          sparksRef.current.push({
            x: r.x,
            y: r.y,
            prevX: r.prevX,
            prevY: r.prevY,
            vx: (Math.random() - 0.5) * 0.9,
            vy: 0.8 + Math.random() * 1.2,
            size: 1.6,
            alpha: 0.75,
            decay: 0.045,
            gravity: 0.04,
            drag: 0.92,
            color: '#F6C86E',
            twinkle: false,
          });

          ctx.save();
          ctx.strokeStyle = r.color;
          ctx.lineWidth = 2.6;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(r.prevX, r.prevY);
          ctx.lineTo(r.x, r.y);
          ctx.stroke();
          ctx.restore();

          if (r.y <= r.targetY || Math.abs(r.vy) < 1.8) {
            explodeFireworkShell(r.x, r.y, 62);
          } else {
            nextRockets.push(r);
          }
        }
        rocketsRef.current = nextRockets;

        // 5. Shockwave Halo Rings
        const nextRings: ShockwaveRing[] = [];
        for (const ring of ringsRef.current) {
          ring.radius += (ring.maxRadius - ring.radius) * 0.11;
          ring.alpha *= 0.92;
          if (ring.alpha > 0.025) {
            nextRings.push(ring);
            ctx.save();
            ctx.globalAlpha = ring.alpha;
            ctx.strokeStyle = ring.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }
        }
        ringsRef.current = nextRings;

        // 6. Chrysanthemum Firework Streaks & Stardust Trail Sparks
        const nextSparks: SparkParticle[] = [];
        for (const s of sparksRef.current) {
          s.prevX = s.x;
          s.prevY = s.y;
          s.vx *= s.drag;
          s.vy = s.vy * s.drag + s.gravity;
          s.x += s.vx;
          s.y += s.vy;
          s.alpha -= s.decay;

          if (s.alpha > 0.02) {
            nextSparks.push(s);
            const flicker = s.twinkle ? 0.65 + 0.35 * Math.sin(time * 0.03 + s.x) : 1;

            ctx.save();
            ctx.globalAlpha = Math.max(0, s.alpha * flicker);
            ctx.strokeStyle = s.color;
            ctx.lineWidth = s.size;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(s.prevX, s.prevY);
            ctx.lineTo(s.x, s.y);
            ctx.stroke();

            ctx.fillStyle = '#FFFDF5';
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size * 0.55, 0, Math.PI * 2);
            ctx.fill();
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
