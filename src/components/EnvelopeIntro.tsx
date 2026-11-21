import { useEffect, useRef } from 'react';
import { useSiteContent } from '../context/ContentContext';
import { playWaxSealChime } from '../utils/musicBox';
import { smoothstep, useChapterScroll } from '../utils/useScrollStory';

interface EnvelopeIntroProps {
  onBurst: (x?: number, y?: number) => void;
}

export function EnvelopeIntro({ onBurst }: EnvelopeIntroProps) {
  const trackRef = useRef<HTMLElement | null>(null);
  const { progress, exitProgress } = useChapterScroll(trackRef, 0.12);
  const chimeFiredRef = useRef(false);
  const { content } = useSiteContent();

  useEffect(() => {
    if (progress >= 0.3 && !chimeFiredRef.current) {
      chimeFiredRef.current = true;
      playWaxSealChime();
      onBurst(window.innerWidth * 0.5, window.innerHeight * 0.42);
    } else if (progress < 0.05) {
      chimeFiredRef.current = false;
    }
  }, [progress, onBurst]);

  const envelopeExit = smoothstep(progress, 0.36, 0.72);
  const cardReveal = smoothstep(progress, 0.34, 0.76);
  const hintFade = 1 - smoothstep(progress, 0.0, 0.22);
  const floatScale = (1 + progress * 0.08).toFixed(3);
  const floatY = (-progress * 24).toFixed(1);

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
            pointerEvents: 'none',
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
          </div>

          {content.envelope.scrollHint1 && (
            <div className="envelope-cta-row">
              <div className="scroll-cue" style={{ opacity: hintFade }}>
                <span>{content.envelope.scrollHint1}</span>
              </div>
            </div>
          )}
        </div>

        {/* Layer B: Hand-Painted Storybook Title Page */}
        <div
          className="opened-card-layer"
          style={{
            opacity: cardReveal,
            transform: `translate3d(0, ${(1 - cardReveal) * 44}px, 0) scale(${0.9 + cardReveal * 0.1})`,
            pointerEvents: 'none',
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
              <span>{content.envelope.scrollHint2}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
