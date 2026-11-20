import { useEffect, useRef } from 'react';
import { useSiteContent } from '../context/ContentContext';
import { playCakeStepChime, playWishCelebration } from '../utils/musicBox';
import {
  clamp,
  remap,
  smoothstep,
  useChapterScroll,
} from '../utils/useScrollStory';

interface BirthdayCakeProps {
  onGrandCelebrate: () => void;
}

const CANDLES = [
  { id: 0, x: 224, baseY: 162, height: 58 },
  { id: 1, x: 252, baseY: 159, height: 61 },
  { id: 2, x: 280, baseY: 157, height: 63 },
  { id: 3, x: 308, baseY: 159, height: 61 },
  { id: 4, x: 336, baseY: 162, height: 58 },
];

const BOTTOM_PEARLS = [156, 184, 214, 244, 280, 316, 346, 376, 404];

function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function buildFlowingCreamPath(
  leftX: number,
  rightX: number,
  topY: number,
  ellipseRy: number,
  dripHeights: number[],
  pourP: number,
): string {
  const width = rightX - leftX;
  const n = dripHeights.length;
  const segW = width / n;

  const dripFlow = smoothstep(pourP, 0.15, 1.0);
  const baseApron = 10 * smoothstep(pourP, 0.05, 0.45);

  let d = `M ${leftX} ${topY}`;
  d += ` A ${width / 2} ${ellipseRy} 0 0 1 ${rightX} ${topY}`;
  d += ` L ${rightX} ${(topY + baseApron).toFixed(1)}`;

  for (let i = n - 1; i >= 0; i -= 1) {
    const xRight = leftX + (i + 1) * segW;
    const xMid = leftX + (i + 0.5) * segW;
    const xLeft = leftX + i * segW;

    const staggerDelay = (i % 3) * 0.11;
    const localDripP = smoothstep(dripFlow, staggerDelay, Math.min(1, staggerDelay + 0.78));
    const dripLen = baseApron + dripHeights[i] * localDripP;
    const valleyY = topY + baseApron + 4 * localDripP;
    const tipY = topY + dripLen;

    d += ` C ${(xRight - segW * 0.18).toFixed(1)} ${valleyY.toFixed(1)}, ${(xMid + segW * 0.24).toFixed(1)} ${tipY.toFixed(1)}, ${xMid.toFixed(1)} ${tipY.toFixed(1)}`;
    d += ` C ${(xMid - segW * 0.24).toFixed(1)} ${tipY.toFixed(1)}, ${(xLeft + segW * 0.18).toFixed(1)} ${valleyY.toFixed(1)}, ${xLeft.toFixed(1)} ${valleyY.toFixed(1)}`;
  }

  d += ` L ${leftX} ${topY} Z`;
  return d;
}

export function BirthdayCake({ onGrandCelebrate }: BirthdayCakeProps) {
  const trackRef = useRef<HTMLElement | null>(null);
  const { progress: t, enterProgress, exitProgress } = useChapterScroll(trackRef, 0.12);
  const { content } = useSiteContent();

  const lastStepChimeRef = useRef<number>(-1);
  const celebrationFiredRef = useRef(false);

  const activeStepIndex =
    t < 0.16 ? 0 : t < 0.33 ? 1 : t < 0.52 ? 2 : t < 0.71 ? 3 : t < 0.82 ? 4 : 5;

  useEffect(() => {
    if (activeStepIndex > lastStepChimeRef.current && t > 0.04) {
      lastStepChimeRef.current = activeStepIndex;
      playCakeStepChime(activeStepIndex);
    } else if (t < 0.03) {
      lastStepChimeRef.current = -1;
      celebrationFiredRef.current = false;
    }
  }, [activeStepIndex, t]);

  useEffect(() => {
    if (t >= 0.92 && !celebrationFiredRef.current) {
      celebrationFiredRef.current = true;
      playWishCelebration();
      onGrandCelebrate();
    }
  }, [t, onGrandCelebrate]);

  // 1. Celadon Cake Stand (0.00 -> 0.09)
  const standP = smoothstep(t, 0.0, 0.09);
  const standY = (1 - standP) * 65;

  // 2. Bottom Sponge Cake Layer (0.05 -> 0.17)
  const sponge1P = smoothstep(t, 0.05, 0.17);
  const sponge1DropY = (1 - sponge1P) * -145;
  const sponge1Bounce =
    sponge1P > 0.75 ? Math.sin(((sponge1P - 0.75) / 0.25) * Math.PI) * 0.055 : 0;

  // 3. Bottom Flowing Cream Frosting (0.16 -> 0.34)
  const cream1P = smoothstep(t, 0.16, 0.34);
  const cream1StreamOpacity =
    t >= 0.15 && t <= 0.28 ? Math.sin(remap(t, 0.15, 0.28) * Math.PI) : 0;
  const bottomCreamPath = buildFlowingCreamPath(
    136,
    424,
    254,
    20,
    [24, 44, 28, 56, 32, 48, 26, 42, 22],
    cream1P,
  );

  // 4. Top Sponge Cake Layer (0.31 -> 0.43)
  const sponge2P = smoothstep(t, 0.31, 0.43);
  const sponge2DropY = (1 - sponge2P) * -135;
  const sponge2Bounce =
    sponge2P > 0.75 ? Math.sin(((sponge2P - 0.75) / 0.25) * Math.PI) * 0.055 : 0;

  // 5. Top Flowing Cream Frosting (0.41 -> 0.55)
  const cream2P = smoothstep(t, 0.41, 0.55);
  const cream2StreamOpacity =
    t >= 0.4 && t <= 0.51 ? Math.sin(remap(t, 0.4, 0.51) * Math.PI) : 0;
  const topCreamPath = buildFlowingCreamPath(
    176,
    384,
    162,
    15,
    [20, 38, 24, 46, 28, 36, 20],
    cream2P,
  );

  // 6. Rose Silk Ribbon & Bow (0.53 -> 0.62)
  const ribbonWrapP = smoothstep(t, 0.53, 0.59);
  const bowPopP = easeOutBack(smoothstep(t, 0.57, 0.64));

  // 7. Botanical Chrysanthemums, Daisies, Leaves & Sugar Pearls (0.58 -> 0.73)
  const flowerLeftP = easeOutBack(smoothstep(t, 0.58, 0.67));
  const flowerRightP = easeOutBack(smoothstep(t, 0.61, 0.7));
  const flowerBaseP = easeOutBack(smoothstep(t, 0.64, 0.73));
  const pearlsP = smoothstep(t, 0.65, 0.73);

  // 8. 5 Beeswax Candles Planting (0.70 -> 0.82)
  // 9. Igniting 5 Living Fire VFX Flames (0.81 -> 0.95)
  const fireMasterP = smoothstep(t, 0.81, 0.95);
  const allLit = fireMasterP >= 0.92;

  const wandActive = fireMasterP > 0.01 && fireMasterP < 0.96;
  const wandX = 216 + fireMasterP * 132;
  const wandY = 92 - Math.sin(fireMasterP * Math.PI * 5) * 10;

  const sceneOpacity = clamp(enterProgress * 1.15 - exitProgress * 0.7, 0, 1).toFixed(3);
  const sceneY = ((1 - enterProgress) * 48 - exitProgress * 38).toFixed(1);
  const sceneScale = (0.93 + enterProgress * 0.07 - exitProgress * 0.05).toFixed(3);

  const renderChrysanthemumCluster = (
    cx: number,
    cy: number,
    scaleVal: number,
    flipX = false,
  ) => {
    if (scaleVal <= 0.01) return null;
    const sx = flipX ? -scaleVal : scaleVal;
    return (
      <g transform={`translate(${cx} ${cy}) scale(${sx.toFixed(3)} ${scaleVal.toFixed(3)})`}>
        <path
          d="M -8 4 C -28 -10, -44 -26, -48 -44 C -30 -40, -14 -22, -4 -4 Z"
          fill="#88A785"
          stroke="#4F664D"
          strokeWidth="1.3"
        />
        <path
          d="M -12 8 C -36 4, -52 -6, -60 -20 C -40 -22, -24 -10, -8 2 Z"
          fill="#9BB898"
          stroke="#4F664D"
          strokeWidth="1.2"
        />
        <path
          d="M 10 -4 C 26 -20, 38 -36, 42 -50 C 24 -44, 12 -26, 2 -8 Z"
          fill="#88A785"
          stroke="#4F664D"
          strokeWidth="1.2"
        />

        {Array.from({ length: 12 }).map((_, i) => (
          <g key={`o-${i}`} transform={`rotate(${i * 30})`}>
            <path
              d="M 0 -4 C 7 -14, 7 -28, 0 -34 C -7 -28, -7 -14, 0 -4 Z"
              fill="#E59E34"
              stroke="#6B421B"
              strokeWidth="1.1"
            />
          </g>
        ))}

        {Array.from({ length: 12 }).map((_, i) => (
          <g key={`m-${i}`} transform={`rotate(${i * 30 + 15})`}>
            <path
              d="M 0 -3 C 5.5 -10, 5.5 -21, 0 -25 C -5.5 -21, -5.5 -10, 0 -3 Z"
              fill="#F4C158"
              stroke="#6B421B"
              strokeWidth="1"
            />
          </g>
        ))}

        <circle cx="0" cy="0" r="7" fill="#D98624" stroke="#6B421B" strokeWidth="1.1" />
        <circle cx="0" cy="0" r="3.5" fill="#FCE08B" />

        {[
          { dx: 28, dy: 8, r: 0.75 },
          { dx: -26, dy: -22, r: 0.65 },
        ].map((d, dIdx) => (
          <g
            key={`daisy-${dIdx}`}
            transform={`translate(${d.dx} ${d.dy}) scale(${d.r})`}
          >
            {Array.from({ length: 8 }).map((__, pIdx) => (
              <ellipse
                key={pIdx}
                cx="9"
                cy="0"
                rx="6.5"
                ry="3"
                transform={`rotate(${pIdx * 45})`}
                fill="#FFFDF8"
                stroke="#6E533F"
                strokeWidth="1"
              />
            ))}
            <circle cx="0" cy="0" r="4.5" fill="#E8A838" stroke="#6B421B" strokeWidth="1" />
          </g>
        ))}
      </g>
    );
  };

  return (
    <section
      id="chuong-5-thoi-nen"
      ref={trackRef}
      className="scrolly-track track-cake"
      aria-labelledby="cake-heading"
    >
      <div
        className="sticky-stage cake-sticky-stage"
        style={{
          opacity: sceneOpacity,
          transform: `translate3d(0, ${sceneY}px, 0) scale(${sceneScale})`,
        }}
      >
        <div
          className="vfx-ambient-halo"
          aria-hidden="true"
          style={{
            transform: `translate(-50%, -45%) scale(${0.85 + fireMasterP * 0.48})`,
          }}
        />

        <div className="container cake-stage-inner">
          <div className="section-heading cake-compact-heading">
            <div className="section-kicker">{content.cake.sectionKicker}</div>
            <h2 id="cake-heading" className="section-title">
              {content.cake.sectionTitle}
            </h2>
            <p className="section-desc">{content.cake.sectionDesc}</p>
          </div>

          <div
            className={`storybook-sheet cake-watercolor-card ${allLit ? 'is-wish-revealed' : ''}`}
          >
            <div className="animated-cake-stage-box">
              <svg
                viewBox="0 0 560 450"
                className="animated-cake-svg"
                role="img"
                aria-label="Hoạt ảnh tạo chiếc bánh kem sinh nhật hai tầng phủ kem chảy, kết hoa cúc vàng và thắp sáng năm ngọn nến"
              >
                <defs>
                  <linearGradient id="celadonPlateTop" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#D6E6D3" />
                    <stop offset="55%" stopColor="#A5C0A2" />
                    <stop offset="100%" stopColor="#7C9A7A" />
                  </linearGradient>
                  <linearGradient id="celadonPedestal" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7F9D7D" />
                    <stop offset="45%" stopColor="#BDD3BA" />
                    <stop offset="100%" stopColor="#6D8B6B" />
                  </linearGradient>
                  <linearGradient id="spongeBody" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#E6BA6C" />
                    <stop offset="38%" stopColor="#F7DC9E" />
                    <stop offset="72%" stopColor="#F2CE85" />
                    <stop offset="100%" stopColor="#D9A856" />
                  </linearGradient>
                  <linearGradient id="spongeTopSurface" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FBE7B8" />
                    <stop offset="100%" stopColor="#E9C276" />
                  </linearGradient>
                  <linearGradient id="velvetCream" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFFDF9" />
                    <stop offset="65%" stopColor="#FBF2E1" />
                    <stop offset="100%" stopColor="#EFE0C4" />
                  </linearGradient>
                  <linearGradient id="roseSilk" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#A64643" />
                    <stop offset="50%" stopColor="#D47470" />
                    <stop offset="100%" stopColor="#9B3E3B" />
                  </linearGradient>
                  <linearGradient id="beeswaxCandle" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#D49234" />
                    <stop offset="45%" stopColor="#FCE092" />
                    <stop offset="100%" stopColor="#BC7B22" />
                  </linearGradient>

                  <radialGradient id="fireThermalAura" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFF3B8" stopOpacity="0.92" />
                    <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.45" />
                    <stop offset="75%" stopColor="#D9481E" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#D9481E" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="fireOuterTongue" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#EA580C" />
                    <stop offset="55%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#FDE047" />
                  </linearGradient>
                  <linearGradient id="fireInnerCore" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.75" />
                    <stop offset="30%" stopColor="#FFFDF7" />
                    <stop offset="100%" stopColor="#FEF08A" />
                  </linearGradient>
                </defs>

                {/* STEP 1A: CELADON JADE CERAMIC CAKE STAND */}
                <g
                  style={{
                    opacity: standP,
                    transform: `translate(0px, ${standY.toFixed(1)}px)`,
                  }}
                >
                  <ellipse cx="280" cy="426" rx="95" ry="12" fill="rgba(90, 62, 38, 0.14)" />
                  <path
                    d="M 248 344 C 254 374, 240 402, 214 416 C 214 426, 346 426, 346 416 C 320 402, 306 374, 312 344 Z"
                    fill="url(#celadonPedestal)"
                    stroke="#523A28"
                    strokeWidth="1.6"
                  />
                  <ellipse
                    cx="280"
                    cy="417"
                    rx="66"
                    ry="9"
                    fill="none"
                    stroke="#523A28"
                    strokeWidth="1.3"
                  />
                  <ellipse
                    cx="280"
                    cy="342"
                    rx="184"
                    ry="28"
                    fill="#7D9B7B"
                    stroke="#523A28"
                    strokeWidth="1.6"
                  />
                  <ellipse
                    cx="280"
                    cy="337"
                    rx="182"
                    ry="26"
                    fill="url(#celadonPlateTop)"
                    stroke="#523A28"
                    strokeWidth="1.5"
                  />
                  <ellipse
                    cx="280"
                    cy="337"
                    rx="162"
                    ry="20"
                    fill="none"
                    stroke="#5A7458"
                    strokeWidth="1"
                    strokeOpacity="0.55"
                  />
                </g>

                {/* STEP 1B: BOTTOM SPONGE CAKE TIER */}
                {sponge1P > 0.01 && (
                  <g
                    style={{
                      opacity: clamp(sponge1P * 1.35, 0, 1),
                      transform: `translate(280px, ${(334 + sponge1DropY).toFixed(1)}px) scale(${(1 + sponge1Bounce).toFixed(3)}, ${(1 - sponge1Bounce).toFixed(3)}) translate(-280px, -334px)`,
                    }}
                  >
                    <path
                      d="M 136 254 L 136 330 A 144 20 0 0 0 424 330 L 424 254 Z"
                      fill="url(#spongeBody)"
                      stroke="#5C3D28"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M 136 292 A 144 19 0 0 0 424 292"
                      fill="none"
                      stroke="#B88238"
                      strokeWidth="2.2"
                      strokeDasharray="6 4"
                      strokeOpacity="0.65"
                    />
                    <ellipse
                      cx="280"
                      cy="254"
                      rx="144"
                      ry="20"
                      fill="url(#spongeTopSurface)"
                      stroke="#5C3D28"
                      strokeWidth="1.5"
                    />
                  </g>
                )}

                {/* STEP 2: BOTTOM TIER CREAM FROSTING POURING & DRIPPING */}
                {cream1StreamOpacity > 0.01 && (
                  <path
                    d="M 280 110 L 280 254"
                    stroke="#FFFDF9"
                    strokeWidth={14 * cream1StreamOpacity}
                    strokeLinecap="round"
                    opacity={cream1StreamOpacity}
                  />
                )}
                {cream1P > 0.01 && (
                  <g style={{ opacity: clamp(cream1P * 1.4, 0, 1) }}>
                    <path
                      d={bottomCreamPath}
                      fill="url(#velvetCream)"
                      stroke="#6A4B35"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <ellipse
                      cx="280"
                      cy="254"
                      rx={144 * clamp(cream1P * 1.3, 0.2, 1)}
                      ry={20 * clamp(cream1P * 1.3, 0.2, 1)}
                      fill="#FFFDF9"
                      stroke="#D8C3A5"
                      strokeWidth="1"
                    />
                  </g>
                )}

                {/* STEP 4A: ROSE-CRIMSON SILK RIBBON */}
                {ribbonWrapP > 0.01 && (
                  <g
                    style={{
                      opacity: clamp(ribbonWrapP * 1.3, 0, 1),
                      transform: `translate(280px, 310px) scale(${ribbonWrapP.toFixed(3)}, 1) translate(-280px, -310px)`,
                    }}
                  >
                    <path
                      d="M 136 300 A 144 20 0 0 0 424 300 L 424 313 A 144 20 0 0 1 136 313 Z"
                      fill="url(#roseSilk)"
                      stroke="#5E2220"
                      strokeWidth="1.3"
                    />
                  </g>
                )}

                {/* STEP 3A: TOP SPONGE CAKE TIER */}
                {sponge2P > 0.01 && (
                  <g
                    style={{
                      opacity: clamp(sponge2P * 1.35, 0, 1),
                      transform: `translate(280px, ${(248 + sponge2DropY).toFixed(1)}px) scale(${(1 + sponge2Bounce).toFixed(3)}, ${(1 - sponge2Bounce).toFixed(3)}) translate(-280px, -248px)`,
                    }}
                  >
                    <ellipse
                      cx="280"
                      cy="250"
                      rx="108"
                      ry="15"
                      fill="rgba(90, 56, 28, 0.14)"
                    />
                    <path
                      d="M 176 162 L 176 246 A 104 15 0 0 0 384 246 L 384 162 Z"
                      fill="url(#spongeBody)"
                      stroke="#5C3D28"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M 176 204 A 104 14 0 0 0 384 204"
                      fill="none"
                      stroke="#B88238"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                      strokeOpacity="0.6"
                    />
                    <ellipse
                      cx="280"
                      cy="162"
                      rx="104"
                      ry="15"
                      fill="url(#spongeTopSurface)"
                      stroke="#5C3D28"
                      strokeWidth="1.5"
                    />
                  </g>
                )}

                {/* STEP 3B: TOP TIER CREAM FROSTING POURING & DRIPPING */}
                {cream2StreamOpacity > 0.01 && (
                  <path
                    d="M 280 45 L 280 162"
                    stroke="#FFFDF9"
                    strokeWidth={12 * cream2StreamOpacity}
                    strokeLinecap="round"
                    opacity={cream2StreamOpacity}
                  />
                )}
                {cream2P > 0.01 && (
                  <g style={{ opacity: clamp(cream2P * 1.4, 0, 1) }}>
                    <path
                      d={topCreamPath}
                      fill="url(#velvetCream)"
                      stroke="#6A4B35"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <ellipse
                      cx="280"
                      cy="162"
                      rx={104 * clamp(cream2P * 1.3, 0.2, 1)}
                      ry={15 * clamp(cream2P * 1.3, 0.2, 1)}
                      fill="#FFFDF9"
                      stroke="#D8C3A5"
                      strokeWidth="1"
                    />
                  </g>
                )}

                {/* STEP 4B: SILK BOW, CHRYSANTHEMUMS, DAISIES & SUGAR PEARLS */}
                {pearlsP > 0.01 &&
                  BOTTOM_PEARLS.map((px, idx) => {
                    const localP = easeOutBack(
                      smoothstep(pearlsP, idx * 0.06, Math.min(1, idx * 0.06 + 0.45)),
                    );
                    const py = 247 + Math.sin((idx / (BOTTOM_PEARLS.length - 1)) * Math.PI) * 11;
                    return (
                      <circle
                        key={`pearl-${px}`}
                        cx={px}
                        cy={py}
                        r={4.2 * Math.max(0, localP)}
                        fill="#F4C158"
                        stroke="#6B421B"
                        strokeWidth="1"
                      />
                    );
                  })}

                {bowPopP > 0.01 && (
                  <g
                    transform={`translate(280 318) scale(${Math.max(0, bowPopP).toFixed(3)})`}
                  >
                    <path
                      d="M -6 4 C -18 24, -26 46, -34 66 L -18 62 C -12 44, -6 24, 0 6 Z"
                      fill="url(#roseSilk)"
                      stroke="#5E2220"
                      strokeWidth="1.3"
                    />
                    <path
                      d="M 6 4 C 18 24, 24 48, 30 70 L 14 64 C 10 46, 4 24, 0 6 Z"
                      fill="url(#roseSilk)"
                      stroke="#5E2220"
                      strokeWidth="1.3"
                    />
                    <path
                      d="M -4 0 C -26 -18, -54 -14, -52 4 C -50 18, -22 14, -4 2 Z"
                      fill="url(#roseSilk)"
                      stroke="#5E2220"
                      strokeWidth="1.4"
                    />
                    <path
                      d="M 4 0 C 26 -18, 54 -14, 52 4 C 50 18, 22 14, 4 2 Z"
                      fill="url(#roseSilk)"
                      stroke="#5E2220"
                      strokeWidth="1.4"
                    />
                    <rect
                      x="-7"
                      y="-6"
                      width="14"
                      height="13"
                      rx="4"
                      fill="#B84B47"
                      stroke="#5E2220"
                      strokeWidth="1.4"
                    />
                  </g>
                )}

                {renderChrysanthemumCluster(198, 244, flowerLeftP * 0.92, false)}
                {renderChrysanthemumCluster(362, 242, flowerRightP * 0.95, true)}
                {renderChrysanthemumCluster(170, 326, flowerBaseP * 0.78, false)}

                {/* STEP 5 & 6: 5 BEESWAX CANDLES & LIVING FIRE VFX */}
                {CANDLES.map((c, idx) => {
                  const candleStart = 0.7 + idx * 0.018;
                  const candleP = smoothstep(t, candleStart, candleStart + 0.08);
                  if (candleP <= 0.01) return null;

                  const dropY = (1 - easeOutBack(candleP)) * -85;
                  const topY = c.baseY - c.height;

                  const wickIgniteP = smoothstep(
                    fireMasterP,
                    idx * 0.14,
                    Math.min(1, idx * 0.14 + 0.34),
                  );

                  return (
                    <g key={c.id}>
                      <g
                        style={{
                          opacity: clamp(candleP * 1.4, 0, 1),
                          transform: `translate(0px, ${dropY.toFixed(1)}px)`,
                        }}
                      >
                        <ellipse
                          cx={c.x}
                          cy={c.baseY + 2}
                          rx="8"
                          ry="3"
                          fill="rgba(110, 78, 42, 0.22)"
                        />
                        <rect
                          x={c.x - 5.5}
                          y={topY}
                          width="11"
                          height={c.height}
                          rx="3"
                          fill="url(#beeswaxCandle)"
                          stroke="#5C3D28"
                          strokeWidth="1.3"
                        />
                        <path
                          d={`M ${c.x - 5.5} ${topY + 18} L ${c.x + 5.5} ${topY + 11} M ${c.x - 5.5} ${topY + 38} L ${c.x + 5.5} ${topY + 31}`}
                          stroke="#FFF6DC"
                          strokeWidth="1.5"
                          strokeOpacity="0.6"
                        />
                        <line
                          x1={c.x}
                          y1={topY}
                          x2={c.x}
                          y2={topY - 9}
                          stroke="#3B2618"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </g>

                      {wickIgniteP > 0.01 && (
                        <g
                          transform={`translate(${c.x} ${topY - 9}) scale(${easeOutBack(wickIgniteP).toFixed(3)})`}
                        >
                          <circle
                            cx="0"
                            cy="-14"
                            r="36"
                            fill="url(#fireThermalAura)"
                            className="vfx-fire-halo"
                          />

                          {wickIgniteP < 0.85 && (
                            <circle
                              cx="0"
                              cy="-12"
                              r={6 + wickIgniteP * 28}
                              fill="none"
                              stroke="#FDE047"
                              strokeWidth={2.5 * (1 - wickIgniteP)}
                              opacity={1 - wickIgniteP}
                            />
                          )}

                          <path
                            className="flame-outer"
                            d="M 0 -38 C 11 -24, 10 -6, 0 0 C -10 -6, -11 -24, 0 -38 Z"
                            fill="url(#fireOuterTongue)"
                            stroke="#9A3412"
                            strokeWidth="1"
                          />

                          <path
                            className="flame-inner"
                            d="M 0 -27 C 6.5 -18, 6 -5, 0 -1 C -6 -5, -6.5 -18, 0 -27 Z"
                            fill="url(#fireInnerCore)"
                          />

                          <circle
                            className="vfx-fire-ember ember-1"
                            cx="-3"
                            cy="-34"
                            r="1.8"
                            fill="#FEF08A"
                          />
                          <circle
                            className="vfx-fire-ember ember-2"
                            cx="4"
                            cy="-40"
                            r="1.4"
                            fill="#F59E0B"
                          />
                          <circle
                            className="vfx-fire-ember ember-3"
                            cx="0"
                            cy="-46"
                            r="1.6"
                            fill="#FFFDF5"
                          />
                        </g>
                      )}
                    </g>
                  );
                })}

                {wandActive && (
                  <g transform={`translate(${wandX.toFixed(1)} ${wandY.toFixed(1)})`}>
                    <circle cx="0" cy="0" r="18" fill="url(#fireThermalAura)" />
                    <path
                      d="M 0 -9 L 2.5 -2.5 L 9 0 L 2.5 2.5 L 0 9 L -2.5 2.5 L -9 0 L -2.5 -2.5 Z"
                      fill="#FFFDF5"
                      stroke="#F59E0B"
                      strokeWidth="1"
                    />
                  </g>
                )}
              </svg>
            </div>

            {allLit && (
              <div className="wish-reveal-card" role="region" aria-live="polite">
                <h3>{content.cake.wishTitle}</h3>
                <p>{content.cake.wishMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
