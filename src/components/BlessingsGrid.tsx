import { useEffect, useRef } from 'react';
import { BLESSINGS_LIST, SECRET_SEVENTH_BLESSING } from '../data/birthdayContent';
import { clamp, useChapterScroll, useScrollProgressJump } from '../utils/useScrollStory';

interface BlessingsGridProps {
  onBurst: (x?: number, y?: number) => void;
}

export function BlessingsGrid({ onBurst }: BlessingsGridProps) {
  const trackRef = useRef<HTMLElement | null>(null);
  const { progress } = useChapterScroll(trackRef, 0.15);
  const jumpToProgress = useScrollProgressJump(trackRef);
  const secretBurstFiredRef = useRef(false);

  // Continuous 3D deck index across [0..6] (0..5 = 6 silk blessings, 6 = 7th secret gift)
  const continuousStep = clamp((progress / 0.9) * 6, 0, 6);
  const activeStep = Math.min(6, Math.round(continuousStep));
  const isSecretStage = activeStep === 6;

  useEffect(() => {
    if (isSecretStage && !secretBurstFiredRef.current) {
      secretBurstFiredRef.current = true;
      onBurst(window.innerWidth * 0.5, window.innerHeight * 0.45);
    }
  }, [isSecretStage, onBurst]);

  const handleSelectStep = (idx: number) => {
    const targetP = (idx / 6) * 0.9;
    jumpToProgress(targetP);
    onBurst(window.innerWidth * 0.5, window.innerHeight * 0.48);
  };

  const wheelRotation = (progress * 210).toFixed(1);
  const foilSweep = Math.round((progress * 320) % 100);

  return (
    <section
      id="chuong-4-loi-chuc"
      ref={trackRef}
      className="scrolly-track track-blessings"
      aria-labelledby="blessings-heading"
    >
      <div className="sticky-stage blessings-sticky-stage">
        <div className="container blessings-stage-inner">
          <div className="section-heading blessings-compact-heading">
            <div className="section-kicker">Đóa Cúc Vàng Sáu Cánh Chúc Thọ</div>
            <h2 id="blessings-heading" className="section-title">
              Sáu Tấm Lụa Vàng &amp; Món Quà Thứ Bảy
            </h2>
          </div>

          <div className="blessings-scrolly-layout">
            {/* Left / Top: Blooming 6-Petal Golden Chrysanthemum Medallion */}
            <div className="petal-wheel-panel">
              <div className="petal-wheel-box">
                <svg
                  viewBox="0 0 240 240"
                  className="petal-wheel-svg"
                  aria-hidden="true"
                  style={{ transform: `rotate(${wheelRotation}deg)` }}
                >
                  <defs>
                    <linearGradient id="goldPetalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFE8A3" />
                      <stop offset="100%" stopColor="#C88D32" />
                    </linearGradient>
                    <linearGradient id="crimsonPetalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D6483E" />
                      <stop offset="100%" stopColor="#8F221E" />
                    </linearGradient>
                  </defs>

                  <circle
                    cx="120"
                    cy="120"
                    r="110"
                    fill="none"
                    stroke="#C88D32"
                    strokeOpacity="0.35"
                    strokeDasharray="4 6"
                  />

                  {BLESSINGS_LIST.map((item, idx) => {
                    const angle = idx * 60;
                    const isLit = isSecretStage || idx <= activeStep;
                    const isCurrent = !isSecretStage && idx === activeStep;
                    const bloomScale = isCurrent ? 1.08 : isLit ? 1.0 : 0.86;
                    return (
                      <g
                        key={item.id}
                        transform={`translate(120 120) rotate(${angle}) scale(${bloomScale})`}
                      >
                        <path
                          d="M0 -22 C18 -50, 20 -92, 0 -108 C-20 -92, -18 -50, 0 -22 Z"
                          fill={
                            isCurrent
                              ? 'url(#crimsonPetalGrad)'
                              : isLit
                                ? 'url(#goldPetalGrad)'
                                : '#EFE0C6'
                          }
                          stroke={isLit ? '#9B2C2C' : '#C88D32'}
                          strokeOpacity={0.65}
                          strokeWidth="1.5"
                        />
                        <circle
                          cx="0"
                          cy="-82"
                          r="3.2"
                          fill={isCurrent ? '#FFF6D6' : '#9B2C2C'}
                          fillOpacity={isLit ? 0.9 : 0.3}
                        />
                      </g>
                    );
                  })}

                  <circle
                    cx="120"
                    cy="120"
                    r="28"
                    fill={isSecretStage ? '#9B2C2C' : '#FFFDF8'}
                    stroke="#E6B85C"
                    strokeWidth="3"
                  />
                </svg>

                <div className={`petal-wheel-center-label ${isSecretStage ? 'is-secret' : ''}`}>
                  {isSecretStage ? '7/7' : `${activeStep + 1}/6`}
                </div>
              </div>

              <div className="petal-chips-grid" role="tablist" aria-label="Chọn lời chúc">
                {BLESSINGS_LIST.map((item, idx) => {
                  const isCurrent = !isSecretStage && idx === activeStep;
                  const isOpened = isSecretStage || idx <= activeStep;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={isCurrent}
                      className={`petal-chip-btn ${isCurrent ? 'is-active' : ''} ${isOpened ? 'is-opened' : ''}`}
                      onClick={() => handleSelectStep(idx)}
                    >
                      {item.sealLabel}
                    </button>
                  );
                })}
                <button
                  type="button"
                  role="tab"
                  aria-selected={isSecretStage}
                  className={`petal-chip-btn petal-chip-secret ${isSecretStage ? 'is-active' : ''}`}
                  onClick={() => handleSelectStep(6)}
                >
                  <span>Quà Thứ 7</span>
                </button>
              </div>
            </div>

            {/* Right / Bottom: True 3D Perspective Revolving Deck of all 6 + 1 Cards */}
            <div className="blessings-3d-stage">
              {BLESSINGS_LIST.map((item, idx) => {
                const delta = idx - continuousStep;
                const absDelta = Math.abs(delta);
                const isFront = idx === activeStep && !isSecretStage;

                // Cards already passed peel upward/left in 3D; upcoming cards stack below in Z depth
                const tx = delta < 0 ? delta * 36 : delta * 14;
                const ty = delta < 0 ? delta * 64 : delta * 22;
                const tz = -absDelta * 90;
                const rotX = delta < 0 ? -delta * 14 : delta * -5;
                const rotZ = delta < 0 ? delta * -4 : delta * 2.2;
                const scale = clamp(1 - absDelta * 0.07, 0.72, 1);
                const opacity = delta < -1.1 ? 0 : clamp(1 - absDelta * 0.45, 0, 1);

                return (
                  <article
                    key={item.id}
                    className={`heirloom-card deck-3d-card ${isFront ? 'is-front' : ''}`}
                    style={{
                      opacity,
                      transform: `perspective(1200px) translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, ${tz.toFixed(1)}px) rotateX(${rotX.toFixed(1)}deg) rotateZ(${rotZ.toFixed(1)}deg) scale(${scale.toFixed(3)})`,
                      zIndex: 20 - Math.round(absDelta * 5),
                      pointerEvents: isFront ? 'auto' : 'none',
                      ['--foil-pos' as string]: `${foilSweep}%`,
                    }}
                  >
                    <div className="blessing-card-top">
                      <span className={`blessing-seal accent-${item.accent}`}>
                        {item.sealLabel} · Lời chúc 0{idx + 1}
                      </span>
                    </div>
                    <h3 className="deck-card-title">{item.title}</h3>
                    <p className="deck-card-body">{item.message}</p>
                    <div className="deck-card-footer-hint">
                      Cuộn tiếp hoặc chạm các ấn chữ bên cạnh ({idx + 1}/6)
                    </div>
                  </article>
                );
              })}

              {/* 7th Royal Crimson-Gold Finale Card in 3D Space */}
              {(() => {
                const delta7 = 6 - continuousStep;
                const abs7 = Math.abs(delta7);
                const opacity7 = clamp(1 - abs7 * 0.85, 0, 1);
                const scale7 = clamp(1 - abs7 * 0.12, 0.8, 1);
                const ty7 = delta7 * 48;
                const tz7 = -abs7 * 110;

                return (
                  <aside
                    className={`secret-blessing-card deck-3d-card ${isSecretStage ? 'is-front' : ''}`}
                    aria-live="polite"
                    style={{
                      opacity: opacity7,
                      transform: `perspective(1200px) translate3d(0, ${ty7.toFixed(1)}px, ${tz7.toFixed(1)}px) scale(${scale7.toFixed(3)})`,
                      zIndex: isSecretStage ? 25 : 5,
                      pointerEvents: isSecretStage ? 'auto' : 'none',
                    }}
                  >
                    <div className="secret-blessing-badge">{SECRET_SEVENTH_BLESSING.badge}</div>
                    <h3>{SECRET_SEVENTH_BLESSING.title}</h3>
                    <p>{SECRET_SEVENTH_BLESSING.message}</p>
                  </aside>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
