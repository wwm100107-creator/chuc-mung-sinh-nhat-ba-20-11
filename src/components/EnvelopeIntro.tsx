import { useEffect, useRef } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { getBirthdayDateInfo } from '../data/birthdayContent';
import { playWaxSealChime } from '../utils/musicBox';
import {
  clamp,
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
    onBurst(window.innerWidth * 0.5, window.innerHeight * 0.42);
    jumpToProgress(0.92);
  };

  // Continuous 60fps 3D choreography parameters
  const sealDissolve = smoothstep(progress, 0.0, 0.24);
  const flapOpen = smoothstep(progress, 0.08, 0.44);
  const cardEmergence = smoothstep(progress, 0.22, 0.64);
  const envelopeExit = smoothstep(progress, 0.46, 0.78);
  const portalHeroIn = smoothstep(progress, 0.44, 0.84);
  const hintFade = 1 - smoothstep(progress, 0.0, 0.2);

  const mandalaRotate = (progress * 140).toFixed(2);
  const mandalaScale = (0.88 + progress * 0.38).toFixed(3);
  const envTiltX = ((1 - flapOpen) * 14 - envelopeExit * 18).toFixed(2);
  const envTiltY = (Math.sin(progress * Math.PI * 1.5) * -8).toFixed(2);

  return (
    <section
      id="chuong-1-mo-thiep"
      ref={trackRef}
      className="scrolly-track track-envelope"
      aria-label="Chương 1: Mở phong thư lụa chúc mừng sinh nhật Bà 20 tháng 11"
    >
      <div className="sticky-stage envelope-sticky-stage">
        {/* Background Rotating Golden Celestial Mandala VFX */}
        <div
          className="vfx-mandala-backdrop"
          aria-hidden="true"
          style={{
            transform: `translate(-50%, -50%) rotate(${mandalaRotate}deg) scale(${mandalaScale})`,
            opacity: 0.28 + portalHeroIn * 0.22,
          }}
        >
          <svg viewBox="0 0 500 500" className="vfx-mandala-svg">
            <defs>
              <radialGradient id="mandalaGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F6C86E" stopOpacity="0.45" />
                <stop offset="65%" stopColor="#C88D32" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#C88D32" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="250" cy="250" r="240" fill="url(#mandalaGlow)" />
            <circle
              cx="250"
              cy="250"
              r="210"
              fill="none"
              stroke="#C88D32"
              strokeWidth="1.2"
              strokeDasharray="6 8"
            />
            <circle
              cx="250"
              cy="250"
              r="175"
              fill="none"
              stroke="#9B2C2C"
              strokeOpacity="0.45"
              strokeWidth="1"
            />
            <circle
              cx="250"
              cy="250"
              r="138"
              fill="none"
              stroke="#C88D32"
              strokeWidth="1.5"
              strokeDasharray="2 10"
            />
            {Array.from({ length: 12 }).map((_, i) => {
              const deg = i * 30;
              return (
                <g key={deg} transform={`translate(250 250) rotate(${deg})`}>
                  <path
                    d="M0 -138 C14 -168, 14 -195, 0 -210 C-14 -195, -14 -168, 0 -138 Z"
                    fill="none"
                    stroke="#C88D32"
                    strokeOpacity="0.55"
                    strokeWidth="1.2"
                  />
                  <circle cx="0" cy="-210" r="3.5" fill="#E6B85C" />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Layer A: 3D Silk & Gold-Foil Envelope */}
        <div
          className="envelope-layer"
          style={{
            opacity: 1 - envelopeExit,
            transform: `translate3d(0, ${envelopeExit * 95}px, 0) scale(${1 - envelopeExit * 0.16})`,
            pointerEvents: envelopeExit < 0.65 ? 'auto' : 'none',
          }}
        >
          <header className="envelope-header">
            <div className="envelope-date-chip vfx-shimmer-pill">
              <Sparkles size={15} aria-hidden="true" />
              <span>{dateInfo.badgeText}</span>
            </div>
            <h1 className="envelope-recipient">Kính gửi Bà yêu quý</h1>
            <p className="envelope-subtitle">
              Cuộn trang hoặc chạm dấu ấn sáp đỏ để khai mở bức thiệp
            </p>
          </header>

          <div className="envelope-wrapper">
            <div
              className="envelope-box vfx-3d-envelope"
              style={{
                transform: `rotateX(${envTiltX}deg) rotateY(${envTiltY}deg)`,
              }}
            >
              {/* Volumetric golden light beam shooting out of the opening envelope */}
              <div
                className="envelope-light-beam"
                aria-hidden="true"
                style={{
                  opacity: clamp(flapOpen * 1.3 - envelopeExit, 0, 0.95),
                  transform: `translateX(-50%) scaleY(${0.3 + cardEmergence * 1.1})`,
                }}
              />

              {/* Rising inner heirloom card */}
              <div
                className="envelope-inner-card"
                style={{
                  opacity: clamp(flapOpen * 1.45, 0, 1),
                  transform: `translate3d(0, ${-cardEmergence * 58}%, ${cardEmergence * 40}px) scale(${0.92 + cardEmergence * 0.12})`,
                }}
              >
                <span className="envelope-inner-kicker">20 · 11 · Mùa Thu Đoàn Viên</span>
                <span className="envelope-inner-title">Chúc Mừng Sinh Nhật Bà</span>
                <span className="envelope-inner-note">Phúc thọ trường tồn · An vui mỗi ngày</span>
              </div>

              <div className="envelope-pocket" aria-hidden="true" />

              {/* Golden corner filigree ornaments on envelope */}
              <svg className="envelope-corner-filigree" viewBox="0 0 400 260" aria-hidden="true">
                <path
                  d="M16 42 L16 16 L42 16 M358 16 L384 16 L384 42 M16 218 L16 244 L42 244 M358 244 L384 244 L384 218"
                  fill="none"
                  stroke="#C88D32"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>

              <div
                className="envelope-flap"
                aria-hidden="true"
                style={{
                  transform: `rotateX(${flapOpen * 176}deg)`,
                  zIndex: flapOpen > 0.48 ? 1 : 4,
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
                  opacity: 1 - sealDissolve,
                  transform: `translate3d(-50%, ${-50 - sealDissolve * 46}%, ${sealDissolve * 60}px) scale(${1 + sealDissolve * 0.28}) rotate(${sealDissolve * 36}deg)`,
                  pointerEvents: sealDissolve < 0.65 ? 'auto' : 'none',
                }}
              >
                <span className="wax-seal-num">20·11</span>
                <span className="wax-seal-label">Khai mở</span>
              </button>
            </div>
          </div>

          <div className="envelope-cta-row">
            <button
              type="button"
              className="btn-primary vfx-glow-btn"
              onClick={handleTapSeal}
            >
              <Sparkles size={18} aria-hidden="true" />
              <span>Chạm Khai Mở Thiệp &amp; Bật Nhạc</span>
            </button>

            <div className="scroll-cue" style={{ opacity: hintFade }}>
              <span>Hoặc vuốt nhẹ lên để mở theo nhịp cuộn</span>
              <ChevronDown size={18} className="scroll-cue-arrow" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Layer B: 3D Portal Hero Reveal with Orbiting Medallions & Inline Art Typography */}
        <div
          className="opened-card-layer"
          style={{
            opacity: portalHeroIn,
            transform: `translate3d(0, ${(1 - portalHeroIn) * 56}px, 0) scale(${0.86 + portalHeroIn * 0.14})`,
            pointerEvents: portalHeroIn > 0.45 ? 'auto' : 'none',
          }}
        >
          <div className="heirloom-card welcome-reveal-card vfx-foil-card">
            {/* Orbiting 3D Royal Corner Badges */}
            <div className="orbit-badges-layer" aria-hidden="true">
              <span
                className="orbit-badge pos-tl"
                style={{ transform: `translate3d(0, ${Math.sin(progress * 8) * 6}px, 24px)` }}
              >
                Phúc
              </span>
              <span
                className="orbit-badge pos-tr"
                style={{ transform: `translate3d(0, ${Math.cos(progress * 8) * 6}px, 24px)` }}
              >
                Thọ
              </span>
              <span
                className="orbit-badge pos-bl"
                style={{ transform: `translate3d(0, ${Math.cos(progress * 7) * -6}px, 24px)` }}
              >
                An
              </span>
              <span
                className="orbit-badge pos-br"
                style={{ transform: `translate3d(0, ${Math.sin(progress * 7) * -6}px, 24px)` }}
              >
                Khang
              </span>
            </div>

            <div className="welcome-badge vfx-shimmer-pill">
              Ngày Sinh Nhật Đặc Biệt · 20 Tháng 11
            </div>

            <div className="welcome-art-halo-wrap">
              <div className="welcome-art-pill">
                <img
                  src="/images/hero-chrysanthemum.png"
                  alt="Hoa cúc vàng mùa thu và ấm trà ấm"
                  width={200}
                  height={200}
                />
              </div>
            </div>

            <h2 className="welcome-title">
              Chúc Mừng{' '}
              <span
                className="inline-art-pill"
                style={{ backgroundImage: 'url(/images/hero-chrysanthemum.png)' }}
                aria-hidden="true"
              />{' '}
              Sinh Nhật
              <span className="welcome-title-highlight">Bà Yêu Quý</span>
            </h2>

            <p className="welcome-desc">
              {dateInfo.subStatusText}. Cuộn nhẹ xuống để thưởng trà, đọc bức thư lụa, mở đóa cúc
              sáu cánh và thổi nến cùng con cháu.
            </p>

            <div className="scroll-cue-strong">
              <span>Tiếp tục cuộn xuống</span>
              <ChevronDown size={20} className="scroll-cue-arrow" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
