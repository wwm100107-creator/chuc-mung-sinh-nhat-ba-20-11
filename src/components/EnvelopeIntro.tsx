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
  const { progress } = useChapterScroll(trackRef, 0.15);
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
  const floatScale = (1 + progress * 0.12).toFixed(3);
  const floatY = (-progress * 28).toFixed(1);

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
            transform: `translate3d(0, ${envelopeExit * -54}px, 0) scale(${1 + envelopeExit * 0.08})`,
            pointerEvents: envelopeExit < 0.65 ? 'auto' : 'none',
          }}
        >
          <header className="envelope-header">
            <div className="storybook-date-tag">
              <span>{dateInfo.badgeText}</span>
            </div>
            <h1 className="envelope-recipient">Kính gửi Bà yêu quý</h1>
            <p className="envelope-subtitle">
              Cuộn nhẹ trang giấy hoặc chạm vào phong thư hoa cúc để mở thiệp
            </p>
          </header>

          <div
            className="watercolor-envelope-art-box"
            style={{
              transform: `translate3d(0, ${floatY}px, 0) scale(${floatScale})`,
            }}
          >
            <img
              src="/images/watercolor-envelope.png"
              alt="Tranh màu nước phong thư cổ điển thắt nơ lụa hồng với hoa cúc vàng và cúc họa mi"
              className="watercolor-blend-img"
              width={560}
              height={560}
            />

            {/* Interactive touch target positioned over the painted crimson wax seal */}
            <button
              type="button"
              className="painted-seal-hotspot"
              onClick={handleTapSeal}
              aria-label="Chạm vào dấu sáp đỏ trên phong thư để mở thiệp và bật nhạc"
            >
              <span className="painted-seal-text">20·11</span>
            </button>
          </div>

          <div className="envelope-cta-row">
            <button type="button" className="btn-primary" onClick={handleTapSeal}>
              <span>Mở Thiệp &amp; Bật Nhạc Hộp Đàn</span>
            </button>

            <div className="scroll-cue" style={{ opacity: hintFade }}>
              <span>Hoặc vuốt nhẹ lên để lật mở theo nhịp cuộn</span>
            </div>
          </div>
        </div>

        {/* Layer B: Hand-Painted Storybook Title Page */}
        <div
          className="opened-card-layer"
          style={{
            opacity: cardReveal,
            transform: `translate3d(0, ${(1 - cardReveal) * 48}px, 0) scale(${0.9 + cardReveal * 0.1})`,
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
                width={320}
                height={320}
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
              <span>Cuộn xuống để thưởng trà &amp; đọc thư</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
