import { useEffect, useRef } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { getBirthdayDateInfo } from '../data/birthdayContent';
import { playWaxSealChime } from '../utils/musicBox';
import { useChapterScroll, useScrollProgressJump } from '../utils/useScrollStory';

interface EnvelopeIntroProps {
  onStartMusic: () => void;
  onBurst: (x?: number, y?: number) => void;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function EnvelopeIntro({ onStartMusic, onBurst }: EnvelopeIntroProps) {
  const trackRef = useRef<HTMLElement | null>(null);
  const { progress } = useChapterScroll(trackRef, 0.18);
  const jumpToProgress = useScrollProgressJump(trackRef);
  const chimeFiredRef = useRef(false);
  const dateInfo = getBirthdayDateInfo();

  useEffect(() => {
    if (progress >= 0.36 && !chimeFiredRef.current) {
      chimeFiredRef.current = true;
      onBurst(window.innerWidth * 0.5, window.innerHeight * 0.42);
    }
  }, [progress, onBurst]);

  const handleTapSeal = () => {
    chimeFiredRef.current = true;
    playWaxSealChime();
    onStartMusic();
    onBurst(window.innerWidth * 0.5, window.innerHeight * 0.42);
    jumpToProgress(0.88);
  };

  // Continuous scroll-driven choreography values [0..1]
  const sealLift = clamp(progress / 0.25, 0, 1);
  const flapProgress = clamp((progress - 0.1) / 0.36, 0, 1);
  const cardRise = clamp((progress - 0.25) / 0.42, 0, 1);
  const envelopeFade = 1 - clamp((progress - 0.45) / 0.34, 0, 1);
  const heroReveal = clamp((progress - 0.44) / 0.38, 0, 1);
  const hintFade = 1 - clamp(progress / 0.24, 0, 1);

  return (
    <section
      id="chuong-1-mo-thiep"
      ref={trackRef}
      className="scrolly-track track-envelope"
      aria-label="Chương 1: Mở tấm thiệp sinh nhật 20 tháng 11"
    >
      <div className="sticky-stage envelope-sticky-stage">
        {/* Layer A: Closing/unfolding Silk Envelope */}
        <div
          className="envelope-layer"
          style={{
            opacity: envelopeFade,
            transform: `translate3d(0, ${clamp((progress - 0.45) * 140, 0, 70)}px, 0) scale(${1 - clamp((progress - 0.45) * 0.14, 0, 0.08)})`,
            pointerEvents: envelopeFade > 0.15 ? 'auto' : 'none',
          }}
        >
          <header className="envelope-header">
            <div className="envelope-date-chip">
              <Sparkles size={16} aria-hidden="true" />
              <span>{dateInfo.badgeText}</span>
            </div>
            <h1 className="envelope-recipient">Kính gửi Bà yêu quý</h1>
            <p className="envelope-subtitle">Cuộn nhẹ xuống hoặc chạm dấu sáp để mở tấm thiệp</p>
          </header>

          <div className="envelope-wrapper">
            <div className="envelope-box">
              <div
                className="envelope-inner-card"
                style={{
                  opacity: clamp(flapProgress * 1.4, 0, 1),
                  transform: `translate3d(0, ${-cardRise * 52}%, 0) scale(${0.94 + cardRise * 0.08})`,
                }}
              >
                <span className="envelope-inner-title">Chúc Mừng Sinh Nhật Bà</span>
                <span className="envelope-inner-note">20 tháng 11 · An lành &amp; Trường thọ</span>
              </div>

              <div className="envelope-pocket" aria-hidden="true" />

              <div
                className="envelope-flap"
                aria-hidden="true"
                style={{
                  transform: `rotateX(${flapProgress * 176}deg)`,
                  zIndex: flapProgress > 0.48 ? 1 : 4,
                }}
              >
                <div className="envelope-flap-shape" />
              </div>

              <button
                type="button"
                className="wax-seal-btn"
                onClick={handleTapSeal}
                aria-label="Mở dấu sáp niêm phong thiệp chúc mừng sinh nhật Bà 20 tháng 11"
                style={{
                  opacity: 1 - sealLift,
                  transform: `translate(-50%, ${-50 - sealLift * 36}%) scale(${1 - sealLift * 0.25}) rotate(${sealLift * 28}deg)`,
                  pointerEvents: sealLift < 0.7 ? 'auto' : 'none',
                }}
              >
                <span className="wax-seal-num">20·11</span>
                <span className="wax-seal-label">Mở thiệp</span>
              </button>
            </div>
          </div>

          <div className="envelope-cta-row">
            <button type="button" className="btn-primary" onClick={handleTapSeal}>
              <Sparkles size={18} aria-hidden="true" />
              <span>Chạm Mở Thiệp &amp; Bật Nhạc</span>
            </button>

            <div className="scroll-cue" style={{ opacity: hintFade }}>
              <span>Hoặc vuốt / cuộn nhẹ xuống</span>
              <ChevronDown size={18} className="scroll-cue-arrow" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Layer B: Emerging Grand Birthday Headline Card */}
        <div
          className="opened-card-layer"
          style={{
            opacity: heroReveal,
            transform: `translate3d(0, ${(1 - heroReveal) * 44}px, 0) scale(${0.88 + heroReveal * 0.12})`,
            pointerEvents: heroReveal > 0.45 ? 'auto' : 'none',
          }}
        >
          <div className="heirloom-card welcome-reveal-card">
            <div className="welcome-badge">20 · 11 · Kính Chúc Sinh Nhật Bà</div>
            <div className="welcome-art-pill">
              <img
                src="/images/hero-chrysanthemum.png"
                alt="Hoa cúc vàng mùa thu và ấm trà ấm"
                width={180}
                height={180}
              />
            </div>
            <h2 className="welcome-title">
              Chúc Mừng Sinh Nhật <span>Bà Yêu Quý</span>
            </h2>
            <p className="welcome-desc">
              {dateInfo.subStatusText}. Mỗi nhịp cuộn tiếp theo là một chương kỷ niệm nhỏ con cháu
              dành riêng cho Bà.
            </p>
            <div className="scroll-cue-strong">
              <span>Cuộn xuống để tiếp tục hành trình</span>
              <ChevronDown size={20} className="scroll-cue-arrow" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
