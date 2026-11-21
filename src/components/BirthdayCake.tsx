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

const WATERCOLOR_CANDLES = [
  { id: 0, src: '/images/cake-parts/candle-0.png', wickX: 327.0, wickY: 193, baseY: 296 },
  { id: 1, src: '/images/cake-parts/candle-1.png', wickX: 356.5, wickY: 189, baseY: 289 },
  { id: 2, src: '/images/cake-parts/candle-2.png', wickX: 385.0, wickY: 197, baseY: 299 },
  { id: 3, src: '/images/cake-parts/candle-3.png', wickX: 412.5, wickY: 194, baseY: 290 },
  { id: 4, src: '/images/cake-parts/candle-4.png', wickX: 441.0, wickY: 193, baseY: 296 },
];

function easeOutBack(t: number): number {
  const c1 = 1.65;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

interface FlowingCreamPaths {
  clipPathD: string;
  dripEdgeD: string;
  crownDripD: string;
}

function buildWatercolorCreamFlow(
  leftX: number,
  rightX: number,
  topBackY: number,
  topFrontY: number,
  bottomY: number,
  dripOffsets: number[],
  pourP: number,
): FlowingCreamPaths {
  const width = rightX - leftX;
  const n = dripOffsets.length;
  const segW = width / n;

  // Phase 1 (0..0.22): cream spreads across top ellipse; Phase 2 (0.14..1.0): cream flows down cylinder wall
  const flowP = smoothstep(pourP, 0.12, 1.0);
  const travelSpan = bottomY - topFrontY + 18;
  const baseFrontY = topFrontY - 6 + travelSpan * Math.pow(flowP, 0.92);

  // Wave amplitude peaks during the middle of the pour and settles softly at the bottom
  const waveEnvelope = Math.sin(clamp(flowP, 0, 1) * Math.PI) * 0.92 + 0.15 * (1 - flowP);

  let clipD = `M ${leftX - 4} ${topBackY - 8} L ${rightX + 4} ${topBackY - 8}`;
  clipD += ` L ${rightX + 4} ${baseFrontY.toFixed(1)}`;

  let edgeD = `M ${rightX} ${baseFrontY.toFixed(1)}`;
  let crownD = `M ${leftX + 2} ${topFrontY - 2} L ${rightX - 2} ${topFrontY - 2} L ${rightX - 2} ${topFrontY + 8}`;

  for (let i = n - 1; i >= 0; i -= 1) {
    const xRight = leftX + (i + 1) * segW;
    const xMid = leftX + (i + 0.5) * segW;
    const xLeft = leftX + i * segW;

    const stagger = (i % 3) * 0.08;
    const localP = smoothstep(pourP, 0.08 + stagger, Math.min(1, 0.88 + stagger));
    const dripExtra = dripOffsets[i] * waveEnvelope * smoothstep(localP, 0.05, 0.65);

    const valleyY = Math.min(bottomY + 10, baseFrontY - dripExtra * 0.25);
    const tipY = Math.min(bottomY + 12, baseFrontY + dripExtra);

    const segCurve =
      ` C ${(xRight - segW * 0.18).toFixed(1)} ${valleyY.toFixed(1)}, ${(xMid + segW * 0.24).toFixed(1)} ${tipY.toFixed(1)}, ${xMid.toFixed(1)} ${tipY.toFixed(1)}` +
      ` C ${(xMid - segW * 0.24).toFixed(1)} ${tipY.toFixed(1)}, ${(xLeft + segW * 0.18).toFixed(1)} ${valleyY.toFixed(1)}, ${xLeft.toFixed(1)} ${valleyY.toFixed(1)}`;

    clipD += segCurve;
    edgeD += segCurve;

    // Permanent subtle watercolor cream drip crown near the top rim of the tier
    const crownP = smoothstep(pourP, 0.12 + stagger, 0.62 + stagger);
    const archY = topFrontY - 3 + Math.sin(((i + 0.5) / n) * Math.PI) * 14;
    const crownValleyY = archY + 5 * crownP;
    const crownTipY = archY + (10 + (dripOffsets[i] * 0.42)) * crownP;

    crownD +=
      ` C ${(xRight - segW * 0.18).toFixed(1)} ${crownValleyY.toFixed(1)}, ${(xMid + segW * 0.24).toFixed(1)} ${crownTipY.toFixed(1)}, ${xMid.toFixed(1)} ${crownTipY.toFixed(1)}` +
      ` C ${(xMid - segW * 0.24).toFixed(1)} ${crownTipY.toFixed(1)}, ${(xLeft + segW * 0.18).toFixed(1)} ${crownValleyY.toFixed(1)}, ${xLeft.toFixed(1)} ${crownValleyY.toFixed(1)}`;
  }

  clipD += ` L ${leftX - 4} ${topBackY - 8} Z`;
  crownD += ` Z`;

  return {
    clipPathD: clipD,
    dripEdgeD: edgeD,
    crownDripD: crownD,
  };
}

export function BirthdayCake({ onGrandCelebrate }: BirthdayCakeProps) {
  const trackRef = useRef<HTMLElement | null>(null);
  const { progress: t, enterProgress, exitProgress } = useChapterScroll(trackRef, 0.12);
  const { content } = useSiteContent();

  const lastStepChimeRef = useRef<number>(-1);
  const celebrationFiredRef = useRef(false);

  const activeStepIndex =
    t < 0.14 ? 0 : t < 0.30 ? 1 : t < 0.48 ? 2 : t < 0.64 ? 3 : t < 0.73 ? 4 : 5;

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
    if (t >= 0.82 && !celebrationFiredRef.current) {
      celebrationFiredRef.current = true;
      playWishCelebration();
      onGrandCelebrate();
    }
  }, [t, onGrandCelebrate]);

  // 1. Hand-Painted Celadon Ceramic Cake Stand (0.00 -> 0.08)
  const standP = smoothstep(t, 0.0, 0.08);
  const standY = (1 - standP) * 64;

  // 2. Bottom Golden Watercolor Sponge Cake Tier (0.04 -> 0.15)
  const sponge1P = smoothstep(t, 0.04, 0.15);
  const sponge1DropY = (1 - sponge1P) * -145;
  const sponge1Bounce =
    sponge1P > 0.75 ? Math.sin(((sponge1P - 0.75) / 0.25) * Math.PI) * 0.05 : 0;

  // 3. Bottom Flowing Watercolor Cream Frosting (0.14 -> 0.31)
  const cream1P = smoothstep(t, 0.14, 0.31);
  const cream1StreamOpacity =
    t >= 0.13 && t <= 0.24 ? Math.sin(remap(t, 0.13, 0.24) * Math.PI) : 0;
  const cream1Flow = buildWatercolorCreamFlow(
    248,
    519,
    391,
    424,
    560,
    [22, 42, 26, 50, 30, 44, 24, 38, 20],
    cream1P,
  );
  const cream1EdgeAlpha =
    cream1P > 0.04 && cream1P < 0.97
      ? Math.sin(remap(cream1P, 0.04, 0.97) * Math.PI) * 0.85
      : 0;

  // 4. Top Golden Watercolor Sponge Cake Tier (0.28 -> 0.39)
  const sponge2P = smoothstep(t, 0.28, 0.39);
  const sponge2DropY = (1 - sponge2P) * -135;
  const sponge2Bounce =
    sponge2P > 0.75 ? Math.sin(((sponge2P - 0.75) / 0.25) * Math.PI) * 0.05 : 0;

  // 5. Top Flowing Watercolor Cream Frosting (0.37 -> 0.50)
  const cream2P = smoothstep(t, 0.37, 0.5);
  const cream2StreamOpacity =
    t >= 0.36 && t <= 0.46 ? Math.sin(remap(t, 0.36, 0.46) * Math.PI) : 0;
  const cream2Flow = buildWatercolorCreamFlow(
    284,
    485,
    273,
    300,
    427,
    [18, 36, 22, 44, 24, 34, 18],
    cream2P,
  );
  const cream2EdgeAlpha =
    cream2P > 0.04 && cream2P < 0.97
      ? Math.sin(remap(cream2P, 0.04, 0.97) * Math.PI) * 0.85
      : 0;

  // 6. Hand-Painted Rose Silk Ribbon & Bow (0.48 -> 0.58)
  const ribbonWrapP = smoothstep(t, 0.48, 0.54);
  const bowPopP = easeOutBack(smoothstep(t, 0.52, 0.59));

  // 7. Hand-Painted Botanical Chrysanthemums, White Daisies & Sage Leaves (0.54 -> 0.66)
  const flowerLeftP = easeOutBack(smoothstep(t, 0.54, 0.61));
  const flowerRightP = easeOutBack(smoothstep(t, 0.57, 0.64));
  const flowerBaseP = easeOutBack(smoothstep(t, 0.6, 0.67));

  // 8. 5 Hand-Painted Beeswax Candles (0.64 -> 0.75)
  // 9. Igniting 5 Watercolor & Golden Living Fire VFX Flames (0.73 -> 0.84)
  // 10. Hold Zone (0.84 -> 1.00): 16% scroll hold to admire the lit cake & read the wish!
  const fireMasterP = smoothstep(t, 0.73, 0.84);
  const wishRevealP = smoothstep(t, 0.78, 0.86);
  const allLit = fireMasterP >= 0.92;

  const wandActive = fireMasterP > 0.01 && fireMasterP < 0.96;
  const wandX = 320 + fireMasterP * 128;
  const wandY = 175 - Math.sin(fireMasterP * Math.PI * 5) * 12;

  const sceneOpacity = clamp(enterProgress * 1.15 - exitProgress * 0.7, 0, 1).toFixed(3);
  const sceneY = ((1 - enterProgress) * 48 - exitProgress * 38).toFixed(1);
  const sceneScale = (0.93 + enterProgress * 0.07 - exitProgress * 0.05).toFixed(3);

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
                viewBox="190 124 388 580"
                className="animated-cake-svg"
                role="img"
                aria-label="Tranh màu nước hoạt ảnh từng lớp tạo chiếc bánh sinh nhật hai tầng phủ kem chảy, kết hoa cúc họa mi và thắp sáng năm ngọn nến"
              >
                <defs>
                  <clipPath id="tier1CreamClip">
                    <path d={cream1Flow.clipPathD} />
                  </clipPath>
                  <clipPath id="tier1BodyBounds">
                    <rect x="247" y="388" width="273" height="174" rx="12" />
                  </clipPath>
                  <clipPath id="tier2CreamClip">
                    <path d={cream2Flow.clipPathD} />
                  </clipPath>
                  <clipPath id="tier2BodyBounds">
                    <rect x="283" y="270" width="203" height="158" rx="10" />
                  </clipPath>

                  <linearGradient id="watercolorCreamStream" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#EFE0C2" />
                    <stop offset="50%" stopColor="#FFFDF7" />
                    <stop offset="100%" stopColor="#E6D2AE" />
                  </linearGradient>

                  <linearGradient id="watercolorDripWash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFFDF8" stopOpacity="0.92" />
                    <stop offset="70%" stopColor="#FBF2DF" stopOpacity="0.88" />
                    <stop offset="100%" stopColor="#EAD6B3" stopOpacity="0.95" />
                  </linearGradient>

                  <radialGradient id="watercolorFireAura" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFF6CC" stopOpacity="0.88" />
                    <stop offset="42%" stopColor="#F3B752" stopOpacity="0.42" />
                    <stop offset="76%" stopColor="#D9822B" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#D9822B" stopOpacity="0" />
                  </radialGradient>

                  <linearGradient id="watercolorFlameOuter" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#D97724" />
                    <stop offset="52%" stopColor="#F0AE44" />
                    <stop offset="100%" stopColor="#FCE38A" />
                  </linearGradient>

                  <linearGradient id="watercolorFlameInner" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#E5A93B" stopOpacity="0.85" />
                    <stop offset="35%" stopColor="#FFFDF6" />
                    <stop offset="100%" stopColor="#FDF0A6" />
                  </linearGradient>
                </defs>

                {/* STEP 1: HAND-PAINTED CELADON CERAMIC CAKE STAND */}
                <g
                  style={{
                    opacity: standP,
                    transform: `translate(0px, ${standY.toFixed(1)}px)`,
                  }}
                >
                  <ellipse cx="384" cy="686" rx="84" ry="11" fill="rgba(88, 64, 42, 0.13)" />
                  <image
                    href="/images/cake-parts/stand.png"
                    x="0"
                    y="0"
                    width="768"
                    height="768"
                  />
                </g>

                {/* STEP 2: BOTTOM GOLDEN WATERCOLOR SPONGE CAKE TIER */}
                {sponge1P > 0.01 && (
                  <g
                    style={{
                      opacity: clamp(sponge1P * 1.35, 0, 1),
                      transform: `translate(384px, ${(548 + sponge1DropY).toFixed(1)}px) scale(${(1 + sponge1Bounce).toFixed(3)}, ${(1 - sponge1Bounce).toFixed(3)}) translate(-384px, -548px)`,
                    }}
                  >
                    <image
                      href="/images/cake-parts/tier1-sponge.png"
                      x="0"
                      y="0"
                      width="768"
                      height="768"
                    />
                  </g>
                )}

                {/* STEP 3: BOTTOM TIER WATERCOLOR CREAM FROSTING POURING & DRIPPING */}
                {cream1StreamOpacity > 0.01 && (
                  <g opacity={cream1StreamOpacity}>
                    <path
                      d="M 384 235 L 384 414"
                      stroke="url(#watercolorCreamStream)"
                      strokeWidth={13 * cream1StreamOpacity}
                      strokeLinecap="round"
                    />
                    <path
                      d="M 384 235 L 384 414"
                      stroke="#7A5C44"
                      strokeWidth="1.1"
                      strokeOpacity={0.45 * cream1StreamOpacity}
                    />
                  </g>
                )}
                {cream1P > 0.01 && (
                  <g style={{ opacity: clamp(cream1P * 1.45, 0, 1) }}>
                    <image
                      href="/images/cake-parts/tier1-cream.png"
                      x="0"
                      y="0"
                      width="768"
                      height="768"
                      clipPath="url(#tier1CreamClip)"
                    />
                    {/* Delicate hand-painted watercolor cream-drip crown along the upper rim */}
                    <path
                      d={cream1Flow.crownDripD}
                      fill="url(#watercolorDripWash)"
                      stroke="#6E523C"
                      strokeWidth="1.25"
                      strokeOpacity={0.42 * clamp(cream1P * 1.2, 0, 1)}
                      clipPath="url(#tier1BodyBounds)"
                    />
                    {/* Flowing sepia-ink & ivory cream drip leading frontier while pouring */}
                    {cream1EdgeAlpha > 0.01 && (
                      <g clipPath="url(#tier1BodyBounds)" opacity={cream1EdgeAlpha}>
                        <path
                          d={cream1Flow.dripEdgeD}
                          fill="none"
                          stroke="#FFFDF7"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                        />
                        <path
                          d={cream1Flow.dripEdgeD}
                          fill="none"
                          stroke="#694E38"
                          strokeWidth="1.45"
                          strokeLinecap="round"
                        />
                      </g>
                    )}
                  </g>
                )}

                {/* STEP 6A: HAND-PAINTED ROSE-CRIMSON SILK RIBBON BAND */}
                {ribbonWrapP > 0.01 && (
                  <g
                    style={{
                      opacity: clamp(ribbonWrapP * 1.35, 0, 1),
                      transform: `translate(384px, 478px) scale(${ribbonWrapP.toFixed(3)}, 1) translate(-384px, -478px)`,
                    }}
                  >
                    <image
                      href="/images/cake-parts/ribbon-band.png"
                      x="0"
                      y="0"
                      width="768"
                      height="768"
                    />
                  </g>
                )}

                {/* STEP 4: TOP GOLDEN WATERCOLOR SPONGE CAKE TIER */}
                {sponge2P > 0.01 && (
                  <g
                    style={{
                      opacity: clamp(sponge2P * 1.35, 0, 1),
                      transform: `translate(384px, ${(418 + sponge2DropY).toFixed(1)}px) scale(${(1 + sponge2Bounce).toFixed(3)}, ${(1 - sponge2Bounce).toFixed(3)}) translate(-384px, -418px)`,
                    }}
                  >
                    <image
                      href="/images/cake-parts/tier2-sponge.png"
                      x="0"
                      y="0"
                      width="768"
                      height="768"
                    />
                  </g>
                )}

                {/* STEP 5: TOP TIER WATERCOLOR CREAM FROSTING POURING & DRIPPING */}
                {cream2StreamOpacity > 0.01 && (
                  <g opacity={cream2StreamOpacity}>
                    <path
                      d="M 384 145 L 384 290"
                      stroke="url(#watercolorCreamStream)"
                      strokeWidth={11 * cream2StreamOpacity}
                      strokeLinecap="round"
                    />
                    <path
                      d="M 384 145 L 384 290"
                      stroke="#7A5C44"
                      strokeWidth="1"
                      strokeOpacity={0.45 * cream2StreamOpacity}
                    />
                  </g>
                )}
                {cream2P > 0.01 && (
                  <g style={{ opacity: clamp(cream2P * 1.45, 0, 1) }}>
                    <image
                      href="/images/cake-parts/tier2-cream.png"
                      x="0"
                      y="0"
                      width="768"
                      height="768"
                      clipPath="url(#tier2CreamClip)"
                    />
                    <path
                      d={cream2Flow.crownDripD}
                      fill="url(#watercolorDripWash)"
                      stroke="#6E523C"
                      strokeWidth="1.2"
                      strokeOpacity={0.42 * clamp(cream2P * 1.2, 0, 1)}
                      clipPath="url(#tier2BodyBounds)"
                    />
                    {cream2EdgeAlpha > 0.01 && (
                      <g clipPath="url(#tier2BodyBounds)" opacity={cream2EdgeAlpha}>
                        <path
                          d={cream2Flow.dripEdgeD}
                          fill="none"
                          stroke="#FFFDF7"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                        />
                        <path
                          d={cream2Flow.dripEdgeD}
                          fill="none"
                          stroke="#694E38"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                      </g>
                    )}
                  </g>
                )}

                {/* STEP 6B: HAND-PAINTED ROSE SILK BOW & 3 BOTANICAL CHRYSANTHEMUM CLUSTERS */}
                {bowPopP > 0.01 && (
                  <g
                    style={{
                      opacity: clamp(bowPopP * 1.3, 0, 1),
                      transform: `translate(384px, 486px) scale(${Math.max(0, bowPopP).toFixed(3)}) translate(-384px, -486px)`,
                    }}
                  >
                    <image
                      href="/images/cake-parts/ribbon-bow.png"
                      x="0"
                      y="0"
                      width="768"
                      height="768"
                    />
                  </g>
                )}

                {flowerLeftP > 0.01 && (
                  <g
                    style={{
                      opacity: clamp(flowerLeftP * 1.25, 0, 1),
                      transform: `translate(316px, 392px) scale(${Math.max(0, flowerLeftP).toFixed(3)}) translate(-316px, -392px)`,
                    }}
                  >
                    <image
                      href="/images/cake-parts/flower-left.png"
                      x="0"
                      y="0"
                      width="768"
                      height="768"
                    />
                  </g>
                )}

                {flowerRightP > 0.01 && (
                  <g
                    style={{
                      opacity: clamp(flowerRightP * 1.25, 0, 1),
                      transform: `translate(462px, 392px) scale(${Math.max(0, flowerRightP).toFixed(3)}) translate(-462px, -392px)`,
                    }}
                  >
                    <image
                      href="/images/cake-parts/flower-right.png"
                      x="0"
                      y="0"
                      width="768"
                      height="768"
                    />
                  </g>
                )}

                {flowerBaseP > 0.01 && (
                  <g
                    style={{
                      opacity: clamp(flowerBaseP * 1.25, 0, 1),
                      transform: `translate(272px, 524px) scale(${Math.max(0, flowerBaseP).toFixed(3)}) translate(-272px, -524px)`,
                    }}
                  >
                    <image
                      href="/images/cake-parts/flower-bottom.png"
                      x="0"
                      y="0"
                      width="768"
                      height="768"
                    />
                  </g>
                )}

                {/* STEP 7 & 8: 5 HAND-PAINTED BEESWAX CANDLES & WATERCOLOR LIVING FIRE VFX */}
                {WATERCOLOR_CANDLES.map((c, idx) => {
                  const candleStart = 0.64 + idx * 0.016;
                  const candleP = smoothstep(t, candleStart, candleStart + 0.07);
                  if (candleP <= 0.01) return null;

                  const dropY = (1 - easeOutBack(candleP)) * -88;

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
                        <image href={c.src} x="0" y="0" width="768" height="768" />
                      </g>

                      {wickIgniteP > 0.01 && (
                        <g
                          transform={`translate(${c.wickX} ${c.wickY}) scale(${easeOutBack(wickIgniteP).toFixed(3)})`}
                        >
                          <circle
                            cx="0"
                            cy="-13"
                            r="32"
                            fill="url(#watercolorFireAura)"
                            className="vfx-fire-halo"
                          />

                          {wickIgniteP < 0.85 && (
                            <circle
                              cx="0"
                              cy="-12"
                              r={5 + wickIgniteP * 24}
                              fill="none"
                              stroke="#F6D06B"
                              strokeWidth={2.2 * (1 - wickIgniteP)}
                              opacity={1 - wickIgniteP}
                            />
                          )}

                          <path
                            className="flame-outer"
                            d="M 0 -32 C 8.5 -20, 8 -5, 0 1 C -8 -5, -8.5 -20, 0 -32 Z"
                            fill="url(#watercolorFlameOuter)"
                            stroke="#6E4726"
                            strokeWidth="1.15"
                          />

                          <path
                            className="flame-inner"
                            d="M 0 -22 C 5 -14, 4.5 -4, 0 0 C -4.5 -4, -5 -14, 0 -22 Z"
                            fill="url(#watercolorFlameInner)"
                          />

                          <circle
                            className="vfx-fire-ember ember-1"
                            cx="-2.5"
                            cy="-29"
                            r="1.5"
                            fill="#FCE592"
                          />
                          <circle
                            className="vfx-fire-ember ember-2"
                            cx="3"
                            cy="-35"
                            r="1.2"
                            fill="#EAA43A"
                          />
                          <circle
                            className="vfx-fire-ember ember-3"
                            cx="0"
                            cy="-40"
                            r="1.4"
                            fill="#FFFDF6"
                          />
                        </g>
                      )}
                    </g>
                  );
                })}

                {wandActive && (
                  <g transform={`translate(${wandX.toFixed(1)} ${wandY.toFixed(1)})`}>
                    <circle cx="0" cy="0" r="16" fill="url(#watercolorFireAura)" />
                    <path
                      d="M 0 -8 L 2.2 -2.2 L 8 0 L 2.2 2.2 L 0 8 L -2.2 2.2 L -8 0 L -2.2 -2.2 Z"
                      fill="#FFFDF5"
                      stroke="#C47D2B"
                      strokeWidth="1"
                    />
                  </g>
                )}
              </svg>
            </div>

            <div
              className="wish-reveal-card"
              role="region"
              aria-live="polite"
              style={{
                opacity: wishRevealP,
                transform: `translate3d(0, ${((1 - wishRevealP) * 14).toFixed(1)}px, 0)`,
                pointerEvents: wishRevealP > 0.5 ? 'auto' : 'none',
              }}
            >
              <h3>{content.cake.wishTitle}</h3>
              <p>{content.cake.wishMessage}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
