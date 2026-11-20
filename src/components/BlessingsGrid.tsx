import { useEffect, useRef } from 'react';
import { Gift, Sparkles } from 'lucide-react';
import { BLESSINGS_LIST, SECRET_SEVENTH_BLESSING } from '../data/birthdayContent';
import { useChapterScroll, useScrollProgressJump } from '../utils/useScrollStory';

interface BlessingsGridProps {
  onBurst: (x?: number, y?: number) => void;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function BlessingsGrid({ onBurst }: BlessingsGridProps) {
  const trackRef = useRef<HTMLElement | null>(null);
  const { progress } = useChapterScroll(trackRef, 0.16);
  const jumpToProgress = useScrollProgressJump(trackRef);
  const secretBurstFiredRef = useRef(false);

  const activeStep = Math.min(6, Math.floor(clamp(progress / 0.9, 0, 0.999) * 7));
  const isSecretStage = activeStep === 6;
  const activeBlessing = BLESSINGS_LIST[Math.min(activeStep, BLESSINGS_LIST.length - 1)];

  useEffect(() => {
    if (isSecretStage && !secretBurstFiredRef.current) {
      secretBurstFiredRef.current = true;
      onBurst(window.innerWidth * 0.5, window.innerHeight * 0.45);
    }
  }, [isSecretStage, onBurst]);

  const handleSelectStep = (idx: number) => {
    const targetP = ((idx + 0.45) / 7) * 0.9;
    jumpToProgress(targetP);
    onBurst(window.innerWidth * 0.5, window.innerHeight * 0.48);
  };

  const wheelRotation = Math.round(progress * 180);

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
            <div className="section-kicker">Chương 04 · Đóa Cúc Sáu Cánh</div>
            <h2 id="blessings-heading" className="section-title">
              Sáu Tấm Lụa Chúc Thọ Bà
            </h2>
          </div>

          <div className="blessings-scrolly-layout">
            {/* Left / Top: 6-Petal Golden Chrysanthemum Wheel + Selector Chips */}
            <div className="petal-wheel-panel">
              <div className="petal-wheel-box">
                <svg
                  viewBox="0 0 220 220"
                  className="petal-wheel-svg"
                  aria-hidden="true"
                  style={{ transform: `rotate(${wheelRotation}deg)` }}
                >
                  {BLESSINGS_LIST.map((item, idx) => {
                    const angle = idx * 60;
                    const isLit = isSecretStage || idx <= activeStep;
                    const isCurrent = !isSecretStage && idx === activeStep;
                    return (
                      <g key={item.id} transform={`translate(110 110) rotate(${angle})`}>
                        <path
                          d="M0 -18 C14 -44, 16 -84, 0 -98 C-16 -84, -14 -44, 0 -18 Z"
                          fill={isCurrent ? '#B83B32' : isLit ? '#E6B85C' : '#EFE0C6'}
                          fillOpacity={isCurrent ? 0.95 : isLit ? 0.88 : 0.6}
                          stroke={isLit ? '#9B2C2C' : '#C88D32'}
                          strokeOpacity={0.55}
                          strokeWidth="1.5"
                        />
                      </g>
                    );
                  })}
                  <circle
                    cx="110"
                    cy="110"
                    r="26"
                    fill={isSecretStage ? '#9B2C2C' : '#FFFDF8'}
                    stroke="#C88D32"
                    strokeWidth="2.5"
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
                  <Gift size={14} aria-hidden="true" />
                  <span>Quà Thứ 7</span>
                </button>
              </div>
            </div>

            {/* Right / Bottom: 3D Stacked Silk Blessing Deck */}
            <div className="blessings-deck-col">
              {!isSecretStage ? (
                <div className="silk-deck-stack">
                  <div className="silk-deck-shadow-2" aria-hidden="true" />
                  <div className="silk-deck-shadow-1" aria-hidden="true" />

                  <article key={activeBlessing.id} className="heirloom-card silk-deck-active-card">
                    <div className="blessing-card-top">
                      <span className={`blessing-seal accent-${activeBlessing.accent}`}>
                        {activeBlessing.sealLabel} · Lời chúc {activeStep + 1}/6
                      </span>
                      <Sparkles size={20} color="#C88D32" aria-hidden="true" />
                    </div>
                    <h3 className="deck-card-title">{activeBlessing.title}</h3>
                    <p className="deck-card-body">{activeBlessing.message}</p>
                    <div className="deck-card-footer-hint">
                      Cuộn tiếp hoặc chạm các chữ bên cạnh để mở đủ 6 tấm lụa
                    </div>
                  </article>
                </div>
              ) : (
                <aside className="secret-blessing-card secret-deck-reveal" aria-live="polite">
                  <div className="secret-blessing-badge">{SECRET_SEVENTH_BLESSING.badge}</div>
                  <h3>{SECRET_SEVENTH_BLESSING.title}</h3>
                  <p>{SECRET_SEVENTH_BLESSING.message}</p>
                </aside>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
