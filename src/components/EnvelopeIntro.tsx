import { useEffect, useRef } from 'react';
import { useSiteContent } from '../context/ContentContext';
import { playWaxSealChime } from '../utils/musicBox';
import {
  smoothstep,
  useChapterScroll,
  useScrollProgressJump,
} from '../utils/useScrollStory';

interface EnvelopeIntroProps {
  onStartMusic: () => void;
  onBurst: (x?: number, y?: number) => void;
}

export function EnvelopeIntro({ onStartMusic, onBurst }: EnvelopeIntroProps) {
  const trackRef = useRef<HTMLElement | null>(null);
  const { progress, exitProgress } = useChapterScroll(trackRef, 0.12);
  const jumpToProgress = useScrollProgressJump(trackRef);
  const chimeFiredRef = useRef(false);
  const { content } = useSiteContent();

  useEffect(() => {
    if (progress >= 0.3 && !chimeFiredRef.current) {
      chimeFiredRef.current = true;
      onBurst(window.innerWidth * 0.5, window.innerHeight * 0.42);
    }
  }, [progress, onBurst]);

  const handleTapSeal = () => {
    chimeFiredRef.current = true;
    playWaxSealChime();
    onStartMusic();
    onBurst(window.innerWidth * 0.5, window.innerHeight * 0.44);
    jumpToProgress(0.86);
  };

  const envelopeExit = smoothstep(progress, 0.36, 0.72);
  const cardReveal = smoothstep(progress, 0.34, 0.76);
  const hintFade = 1 - smoothstep(progress, 0.0, 0.22);
  const floatScale = (1 + progress * 0.08).toFixed(3);
  const floatY = (-progress * 24).toFixed(1);

  // Smooth chapter exit transition into Chapter 2
  const sceneExitY = (-exitProgress * 44).toFixed(1);
  const sceneExitOpacity = (1 - exitProgress * 0.65).toFixed(3);
  const sceneExitScale = (1 - exitProgress * 0.06).toFixed(3);

  return (
    <section
      id="chuong-1-mo-thiep"
      ref={trackRef}
      className="scrolly-track track-envelope"
      aria-label="Chương 1: Mở phong thư màu nước chúc mừng sinh nhật Bà 20 tháng 11"
    >
      <div
        className="sticky-stage envelope-sticky-stage"
        style={{
          opacity: sceneExitOpacity,
          transform: `translate3d(0, ${sceneExitY}px, 0) scale(${sceneExitScale})`,
        }}
      >
        {/* Breathing Ambient Watercolor Aura VFX */}
        <div
          className="vfx-ambient-halo"
          aria-hidden="true"
          style={{
            transform: `translate(-50%, -50%) scale(${0.9 + progress * 0.45})`,
          }}
        />

        {/* Layer A: Transparent Cutout Hand-Painted Watercolor Bouquet Envelope */}
        <div
          className="envelope-layer"
          style={{
            opacity: 1 - envelopeExit,
            transform: `translate3d(0, ${envelopeExit * -52}px, 0) scale(${1 + envelopeExit * 0.1})`,
            pointerEvents: envelopeExit < 0.65 ? 'auto' : 'none',
          }}
        >
          <header className="envelope-header">
            <div className="storybook-date-tag">
              <span>{content.envelope.dateBadge}</span>
            </div>
            <h1 className="envelope-recipient">{content.envelope.recipientTitle}</h1>
            <p className="envelope-subtitle">{content.envelope.envelopeSubtitle}</p>
          </header>

          <div
            className="watercolor-envelope-art-box vfx-levitate"
            onClick={handleTapSeal}
            role="button"
            tabIndex={0}
            aria-label="Chạm vào phong thư hoa cúc để mở thiệp và bật nhạc"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTapSeal();
              }
            }}
            style={{
              transform: `translate3d(0, ${floatY}px, 0) scale(${floatScale})`,
            }}
          >
            <img
              src="/images/watercolor-envelope.png"
              alt="Tranh màu nước phong thư cổ điển thắt nơ lụa hồng với hoa cúc vàng và cúc họa mi"
              className="watercolor-cutout-img"
              width={520}
              height={520}
              decoding="async"
            />

            <span className="painted-seal-hotspot" aria-hidden="true">
              <span className="painted-seal-text">20·11</span>
            </span>
          </div>

          <div className="envelope-cta-row">
            <button type="button" className="btn-primary mobile-full-btn" onClick={handleTapSeal}>
              <span>{content.envelope.openButtonText}</span>
            </button>

            <div className="scroll-cue" style={{ opacity: hintFade }}>
              <span>Vuốt nhẹ lên để lật mở từng trang</span>
            </div>
          </div>
        </div>

        {/* Layer B: Hand-Painted Storybook Title Page */}
        <div
          className="opened-card-layer"
          style={{
            opacity: cardReveal,
            transform: `translate3d(0, ${(1 - cardReveal) * 44}px, 0) scale(${0.9 + cardReveal * 0.1})`,
            pointerEvents: cardReveal > 0.45 ? 'auto' : 'none',
          }}
        >
          <div className="storybook-sheet welcome-reveal-card">
            <div className="storybook-date-tag">{content.envelope.welcomeBadge}</div>

            <div className="welcome-watercolor-vignette vfx-levitate">
              <img
                src="/images/hero-chrysanthemum.png"
                alt="Tranh màu nước hoa cúc vàng mùa thu và ấm trà xanh"
                className="watercolor-cutout-img"
                width={290}
                height={290}
                decoding="async"
              />
            </div>

            <h2 className="welcome-title">
              {content.envelope.welcomeTitleTop}
              <span className="welcome-title-highlight">
                {content.envelope.welcomeTitleHighlight}
              </span>
            </h2>

            <p className="welcome-desc">{content.envelope.welcomeDescription}</p>

            <div className="scroll-cue-strong">
              <span>Vuốt tiếp xuống để thưởng trà &amp; đọc thư</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
