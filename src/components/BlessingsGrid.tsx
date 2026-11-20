import { useEffect, useRef, type TouchEvent } from 'react';
import { useSiteContent } from '../context/ContentContext';
import { clamp, useChapterScroll, useScrollProgressJump } from '../utils/useScrollStory';

interface BlessingsGridProps {
  onBurst: (x?: number, y?: number) => void;
}

export function BlessingsGrid({ onBurst }: BlessingsGridProps) {
  const trackRef = useRef<HTMLElement | null>(null);
  const { progress, enterProgress, exitProgress } = useChapterScroll(trackRef, 0.12);
  const jumpToProgress = useScrollProgressJump(trackRef);
  const secretBurstFiredRef = useRef(false);
  const touchStartXRef = useRef<number | null>(null);
  const { content } = useSiteContent();

  const items = content.blessings.items;
  const secretGift = content.blessings.secretGift;
  const totalSteps = items.length; // 6 items -> step 6 is the 7th secret gift

  const continuousStep = clamp((progress / 0.9) * totalSteps, 0, totalSteps);
  const activeStep = Math.min(totalSteps, Math.round(continuousStep));
  const isSecretStage = activeStep === totalSteps;

  useEffect(() => {
    if (isSecretStage && !secretBurstFiredRef.current) {
      secretBurstFiredRef.current = true;
      onBurst(window.innerWidth * 0.5, window.innerHeight * 0.45);
    }
  }, [isSecretStage, onBurst]);

  const handleSelectStep = (idx: number) => {
    const safeIdx = clamp(idx, 0, totalSteps);
    const targetP = (safeIdx / Math.max(1, totalSteps)) * 0.9;
    jumpToProgress(targetP);
    onBurst(window.innerWidth * 0.5, window.innerHeight * 0.48);
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartXRef.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartXRef.current === null || e.changedTouches.length === 0) return;
    const dx = e.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(dx) > 40) {
      handleSelectStep(activeStep + (dx < 0 ? 1 : -1));
    }
  };

  const wreathRot = (progress * 42).toFixed(1);
  const sceneOpacity = clamp(enterProgress * 1.15 - exitProgress * 0.7, 0, 1).toFixed(3);
  const sceneY = ((1 - enterProgress) * 48 - exitProgress * 38).toFixed(1);
  const sceneScale = (0.93 + enterProgress * 0.07 - exitProgress * 0.05).toFixed(3);

  return (
    <section
      id="chuong-4-loi-chuc"
      ref={trackRef}
      className="scrolly-track track-blessings"
      aria-labelledby="blessings-heading"
    >
      <div
        className="sticky-stage blessings-sticky-stage"
        style={{
          opacity: sceneOpacity,
          transform: `translate3d(0, ${sceneY}px, 0) scale(${sceneScale})`,
        }}
      >
        <div
          className="vfx-ambient-halo"
          aria-hidden="true"
          style={{
            transform: `translate(-35%, -50%) scale(${0.95 + progress * 0.35})`,
          }}
        />

        <div className="container blessings-stage-inner">
          <div className="section-heading blessings-compact-heading">
            <div className="section-kicker">{content.blessings.sectionKicker}</div>
            <h2 id="blessings-heading" className="section-title">
              {content.blessings.sectionTitle}
            </h2>
          </div>

          <div className="blessings-scrolly-layout">
            {/* Left / Top: Background-Free Hand-Painted Watercolor Chrysanthemum Wreath */}
            <div className="petal-wheel-panel">
              <div className="watercolor-wreath-box vfx-levitate">
                <img
                  src="/images/watercolor-blessings.png"
                  alt="Tranh màu nước vòng hoa sáu đóa cúc vàng, cúc họa mi và dải lụa hồng"
                  className="watercolor-wreath-img watercolor-cutout-img"
                  width={300}
                  height={300}
                  loading="lazy"
                  decoding="async"
                  style={{ transform: `rotate(${wreathRot}deg)` }}
                />
                <div className="wreath-center-calligraphy">
                  <span className="wreath-center-seal">
                    {isSecretStage ? 'Món Quà 7' : (items[activeStep]?.sealLabel ?? '')}
                  </span>
                  <span className="wreath-center-num">
                    {isSecretStage
                      ? `0${totalSteps + 1} / 0${totalSteps + 1}`
                      : `0${activeStep + 1} / 0${totalSteps}`}
                  </span>
                </div>
              </div>

              <div className="petal-chips-grid" role="tablist" aria-label="Chọn lời chúc">
                {items.map((item, idx) => {
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
                  onClick={() => handleSelectStep(totalSteps)}
                >
                  <span>Quà Thứ 7</span>
                </button>
              </div>
            </div>

            {/* Right / Bottom: Non-overlapping 3D Coverflow / Depth Deck with Touch Swipe */}
            <div
              className="blessings-3d-stage"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {items.map((item, idx) => {
                const delta = idx - continuousStep;
                const absDelta = Math.abs(delta);
                const isFront = idx === activeStep && !isSecretStage;

                const tx = delta * 26;
                const ty = absDelta * 10;
                const tz = -absDelta * 85;
                const rotY = delta * -10;
                const scale = clamp(1 - absDelta * 0.08, 0.76, 1);
                const opacity = absDelta > 1.45 ? 0 : clamp(1 - absDelta * 0.58, 0, 1);

                return (
                  <article
                    key={item.id}
                    className={`storybook-sheet deck-3d-card ${isFront ? 'is-front' : ''}`}
                    style={{
                      opacity,
                      transform: `perspective(1200px) translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, ${tz.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg) scale(${scale.toFixed(3)})`,
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
                      Vuốt ngang, cuộn xuống hoặc chạm chữ bên trên ({idx + 1}/{totalSteps})
                    </div>
                  </article>
                );
              })}

              {(() => {
                const delta7 = totalSteps - continuousStep;
                const abs7 = Math.abs(delta7);
                const opacity7 = clamp(1 - abs7 * 0.85, 0, 1);
                const scale7 = clamp(1 - abs7 * 0.12, 0.82, 1);
                const tx7 = delta7 * 26;
                const ty7 = abs7 * 10;
                const tz7 = -abs7 * 95;

                return (
                  <aside
                    className={`storybook-sheet secret-watercolor-card deck-3d-card ${isSecretStage ? 'is-front' : ''}`}
                    aria-live="polite"
                    style={{
                      opacity: opacity7,
                      transform: `perspective(1200px) translate3d(${tx7.toFixed(1)}px, ${ty7.toFixed(1)}px, ${tz7.toFixed(1)}px) scale(${scale7.toFixed(3)})`,
                      zIndex: isSecretStage ? 25 : 5,
                      pointerEvents: isSecretStage ? 'auto' : 'none',
                    }}
                  >
                    <div className="storybook-date-tag">{secretGift.badge}</div>
                    <h3>{secretGift.title}</h3>
                    <p>{secretGift.message}</p>
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
