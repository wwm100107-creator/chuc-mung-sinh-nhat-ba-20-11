import { useEffect, useRef } from 'react';
import { getBirthdayDateInfo } from '../data/birthdayContent';
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
  const { progress } = useChapterScroll(trackRef, 0.16);
  const jumpToProgress = useScrollProgressJump(trackRef);
  const chimeFiredRef = useRef(false);
  const dateInfo = getBirthdayDateInfo();

  useEffect(() => {
    if (progress >= 0.32 && !chimeFiredRef.current) {
      chimeFiredRef.current = true;
      onBurst(window.innerWidth * 0.5, window.innerHeight * 0.42);
    }
  }, [progress, onBurst]);

  const handleTapSeal = () => {
    chimeFiredRef.current = true;
    playWaxSealChime();
    onStartMusic();
    onBurst(window.innerWidth * 0.5, window.innerHeight * 0.44);
    jumpToProgress(0.92);
  };

  const envelopeExit = smoothstep(progress, 0.42, 0.78);
  const cardReveal = smoothstep(progress, 0.4, 0.82);
  const hintFade = 1 - smoothstep(progress, 0.0, 0.22);
  const floatScale = (1 + progress * 0.08).toFixed(3);
  const floatY = (-progress * 20).toFixed(1);

  return (
    <section
      id="chuong-1-mo-thiep"
      ref={trackRef}
      className="scrolly-track track-envelope"
      aria-label="Chương 1: Mở phong thư màu nước chúc mừng sinh nhật Bà 20 tháng 11"
    >
      <div className="sticky-stage envelope-sticky-stage">
        {/* Layer A: Hand-Painted Watercolor Bouquet Envelope */}
        <div
          className="envelope-layer"
          style={{
            opacity: 1 - envelopeExit,
            transform: `translate3d(0, ${envelopeExit * -44}px, 0) scale(${1 + envelopeExit * 0.06})`,
            pointerEvents: envelopeExit < 0.65 ? 'auto' : 'none',
          }}
        >
          <header className="envelope-header">
            <div className="storybook-date-tag">
              <span>{dateInfo.badgeText}</span>
            </div>
            <h1 className="envelope-recipient">Kính gửi Bà yêu quý</h1>
            <p className="envelope-subtitle">
              Chạm vào phong thư hoa cúc hoặc vuốt nhẹ lên để mở thiệp
            </p>
          </header>

          <div
            className="watercolor-envelope-art-box"
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
              className="watercolor-blend-img"
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
              <span>Mở Thiệp &amp; Bật Nhạc Hộp Đàn</span>
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
            transform: `translate3d(0, ${(1 - cardReveal) * 38}px, 0) scale(${0.92 + cardReveal * 0.08})`,
            pointerEvents: cardReveal > 0.45 ? 'auto' : 'none',
          }}
        >
          <div className="storybook-sheet welcome-reveal-card">
            <div className="storybook-date-tag">Ngày Sinh Nhật Đặc Biệt · 20 Tháng 11</div>

            <div className="welcome-watercolor-vignette">
              <img
                src="/images/hero-chrysanthemum.png"
                alt="Tranh màu nước hoa cúc vàng mùa thu và ấm trà xanh"
                className="watercolor-blend-img"
                width={280}
                height={280}
                decoding="async"
              />
            </div>

            <h2 className="welcome-title">
              Chúc Mừng Sinh Nhật
              <span className="welcome-title-highlight">Bà Yêu Quý</span>
            </h2>

            <p className="welcome-desc">
              {dateInfo.subStatusText}. Mỗi trang giấy màu nước tiếp theo là một lời chúc bình an
              con cháu vẽ dành tặng riêng Bà.
            </p>

            <div className="scroll-cue-strong">
              <span>Vuốt tiếp xuống để thưởng trà &amp; đọc thư</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
