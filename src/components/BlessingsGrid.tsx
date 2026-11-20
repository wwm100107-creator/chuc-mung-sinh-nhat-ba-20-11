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

  const wreathRot = (progress * 38).toFixed(1);

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
            <div className="section-kicker">Vòng Hoa Cúc Mùa Thu Chúc Thọ</div>
            <h2 id="blessings-heading" className="section-title">
              Sáu Lời Chúc Vàng &amp; Món Quà Thứ Bảy
            </h2>
          </div>

          <div className="blessings-scrolly-layout">
            {/* Left / Top: Hand-Painted Watercolor Chrysanthemum Wreath */}
            <div className="petal-wheel-panel">
              <div className="watercolor-wreath-box">
                <img
                  src="/images/watercolor-blessings.png"
                  alt="Tranh màu nước vòng hoa sáu đóa cúc vàng, cúc họa mi và dải lụa hồng"
                  className="watercolor-wreath-img watercolor-blend-img"
                  width={340}
                  height={340}
                  style={{ transform: `rotate(${wreathRot}deg)` }}
                />
                <div className="wreath-center-calligraphy">
                  <span className="wreath-center-seal">
                    {isSecretStage ? 'Món Quà 7' : BLESSINGS_LIST[activeStep].sealLabel}
                  </span>
                  <span className="wreath-center-num">
                    {isSecretStage ? '07 / 07' : `0${activeStep + 1} / 06`}
                  </span>
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

            {/* Right / Bottom: True 3D Perspective Revolving Watercolor Card Deck */}
            <div className="blessings-3d-stage">
              {BLESSINGS_LIST.map((item, idx) => {
                const delta = idx - continuousStep;
                const absDelta = Math.abs(delta);
                const isFront = idx === activeStep && !isSecretStage;

                const tx = delta < 0 ? delta * 34 : delta * 14;
                const ty = delta < 0 ? delta * 60 : delta * 20;
                const tz = -absDelta * 85;
                const rotX = delta < 0 ? -delta * 13 : delta * -5;
                const rotZ = delta < 0 ? delta * -3.5 : delta * 2;
                const scale = clamp(1 - absDelta * 0.07, 0.74, 1);
                const opacity = delta < -1.1 ? 0 : clamp(1 - absDelta * 0.45, 0, 1);

                return (
                  <article
                    key={item.id}
                    className={`storybook-sheet deck-3d-card ${isFront ? 'is-front' : ''}`}
                    style={{
                      opacity,
                      transform: `perspective(1200px) translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, ${tz.toFixed(1)}px) rotateX(${rotX.toFixed(1)}deg) rotateZ(${rotZ.toFixed(1)}deg) scale(${scale.toFixed(3)})`,
                      zIndex: 20 - Math.round(absDelta * 5),
                      pointerEvents: isFront ? 'auto' : 'none',
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

              {(() => {
                const delta7 = 6 - continuousStep;
                const abs7 = Math.abs(delta7);
                const opacity7 = clamp(1 - abs7 * 0.85, 0, 1);
                const scale7 = clamp(1 - abs7 * 0.12, 0.8, 1);
                const ty7 = delta7 * 46;
                const tz7 = -abs7 * 105;

                return (
                  <aside
                    className={`storybook-sheet secret-watercolor-card deck-3d-card ${isSecretStage ? 'is-front' : ''}`}
                    aria-live="polite"
                    style={{
                      opacity: opacity7,
                      transform: `perspective(1200px) translate3d(0, ${ty7.toFixed(1)}px, ${tz7.toFixed(1)}px) scale(${scale7.toFixed(3)})`,
                      zIndex: isSecretStage ? 25 : 5,
                      pointerEvents: isSecretStage ? 'auto' : 'none',
                    }}
                  >
                    <div className="storybook-date-tag">{SECRET_SEVENTH_BLESSING.badge}</div>
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
