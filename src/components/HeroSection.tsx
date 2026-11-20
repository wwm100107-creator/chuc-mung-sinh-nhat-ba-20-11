import { useRef } from 'react';
import { STORY_BEATS, getBirthdayDateInfo } from '../data/birthdayContent';
import {
  clamp,
  scrollToChapter,
  useChapterScroll,
  useScrollProgressJump,
} from '../utils/useScrollStory';

export function HeroSection() {
  const trackRef = useRef<HTMLElement | null>(null);
  const { progress } = useChapterScroll(trackRef, 0.15);
  const jumpToProgress = useScrollProgressJump(trackRef);
  const dateInfo = getBirthdayDateInfo();

  // Continuous 3D carousel index in [0..2]
  const continuousBeat = clamp(progress * 2.55, 0, 2);
  const activeBeatIndex = Math.round(continuousBeat);

  const outerRingDeg = (progress * 110).toFixed(2);
  const innerRingDeg = (-progress * 75).toFixed(2);
  const artScale = (0.92 + progress * 0.14).toFixed(3);
  const parallaxY = ((progress - 0.5) * -36).toFixed(1);

  return (
    <section
      id="chuong-2-huong-tra"
      ref={trackRef}
      className="scrolly-track track-story"
      aria-labelledby="hero-heading"
    >
      <div className="sticky-stage story-sticky-stage">
        <div className="container story-grid">
          {/* Multi-layer 3D Parallax Moon-Window Diorama */}
          <div className="moon-window-col">
            <div className="moon-window-wrap">
              {/* Outer rotating golden astrolabe ring */}
              <svg
                className="moon-filigree-ring"
                viewBox="0 0 260 260"
                aria-hidden="true"
                style={{ transform: `rotate(${outerRingDeg}deg)` }}
              >
                <circle
                  cx="130"
                  cy="130"
                  r="123"
                  fill="none"
                  stroke="#C88D32"
                  strokeOpacity="0.55"
                  strokeWidth="1.4"
                  strokeDasharray="8 6"
                />
                <circle
                  cx="130"
                  cy="130"
                  r="114"
                  fill="none"
                  stroke="#9B2C2C"
                  strokeOpacity="0.35"
                  strokeWidth="1"
                />
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <circle
                    key={deg}
                    cx={130 + 123 * Math.cos((deg * Math.PI) / 180)}
                    cy={130 + 123 * Math.sin((deg * Math.PI) / 180)}
                    r={deg % 90 === 0 ? '4.5' : '2.6'}
                    fill={deg % 90 === 0 ? '#9B2C2C' : '#C88D32'}
                  />
                ))}
              </svg>

              {/* Counter-rotating inner geometric halo */}
              <svg
                className="moon-filigree-inner"
                viewBox="0 0 240 240"
                aria-hidden="true"
                style={{ transform: `rotate(${innerRingDeg}deg)` }}
              >
                <polygon
                  points="120,10 152,88 230,120 152,152 120,230 88,152 10,120 88,88"
                  fill="none"
                  stroke="#E6B85C"
                  strokeOpacity="0.4"
                  strokeWidth="1.2"
                />
              </svg>

              <div className="moon-window-frame">
                <img
                  src="/images/hero-chrysanthemum.png"
                  alt="Tranh màu nước hoa cúc vàng, cúc họa mi trắng và ấm trà xanh dịu dàng kính tặng sinh nhật Bà"
                  className="moon-window-img"
                  width={520}
                  height={520}
                  style={{
                    transform: `scale(${artScale}) translate3d(0, ${parallaxY}px, 0)`,
                  }}
                />

                {/* Animated Volumetric Tea Steam SVG Overlay */}
                <svg className="tea-steam-overlay" viewBox="0 0 200 200" aria-hidden="true">
                  <path
                    className="steam-wisp wisp-1"
                    d="M132 145 C122 122, 144 102, 130 78 C118 58, 138 38, 128 18"
                    fill="none"
                    stroke="rgba(255, 252, 245, 0.72)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    className="steam-wisp wisp-2"
                    d="M148 138 C158 116, 138 96, 150 72 C160 52, 142 34, 150 16"
                    fill="none"
                    stroke="rgba(246, 200, 110, 0.55)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Parallax Floating 3D Badges around Moon Window */}
              <div
                className="diorama-float-tag tag-left"
                style={{
                  transform: `translate3d(0, ${(0.5 - progress) * 28}px, 30px)`,
                }}
              >
                <span>Hương Trà Thu</span>
              </div>

              <div
                className="diorama-float-tag tag-right"
                style={{
                  transform: `translate3d(0, ${(progress - 0.5) * 32}px, 30px)`,
                }}
              >
                <span>20 · 11 · An Khang</span>
              </div>

              <div className="moon-caption-pill">Sắc cúc vàng · Kính dâng Bà</div>
            </div>
          </div>

          {/* 3D Curved Vertical Carousel of Story Beats */}
          <div className="story-content-col">
            <div className="hero-date-pill vfx-shimmer-pill">
              <span>{dateInfo.badgeText}</span>
            </div>

            <div id="hero-heading" className="story-3d-viewport">
              {STORY_BEATS.map((beat, idx) => {
                const offset = idx - continuousBeat;
                const absOff = Math.abs(offset);
                const translateY = (offset * 54).toFixed(1);
                const translateZ = (-absOff * 95).toFixed(1);
                const rotateX = (offset * -14).toFixed(1);
                const scale = Math.max(0.82, 1 - absOff * 0.12).toFixed(3);
                const opacity = clamp(1 - absOff * 0.78, 0, 1).toFixed(3);
                const isCurrent = idx === activeBeatIndex;

                return (
                  <article
                    key={beat.id}
                    className={`story-3d-card ${isCurrent ? 'is-current' : ''}`}
                    style={{
                      opacity,
                      transform: `perspective(1000px) translate3d(0, ${translateY}px, ${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`,
                      zIndex: 10 - Math.round(absOff * 4),
                      pointerEvents: isCurrent ? 'auto' : 'none',
                    }}
                  >
                    <div className="story-beat-kicker">{beat.kicker}</div>
                    <h2 className="story-beat-title">{beat.title}</h2>
                    <p className="story-beat-body">{beat.body}</p>
                  </article>
                );
              })}
            </div>

            <div className="beat-dots-bar" role="group" aria-label="Chọn nhịp câu chuyện">
              {STORY_BEATS.map((beat, idx) => (
                <button
                  key={beat.id}
                  type="button"
                  className={`beat-pill-btn ${idx === activeBeatIndex ? 'is-active' : ''}`}
                  onClick={() => jumpToProgress((idx + 0.35) / STORY_BEATS.length)}
                  aria-pressed={idx === activeBeatIndex}
                >
                  <span>0{idx + 1}</span>
                  <span>{beat.title.split(' ').slice(0, 2).join(' ')}</span>
                </button>
              ))}
            </div>

            <div className="story-quick-jumps">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => scrollToChapter('chuong-3-thu-lua', 0.18)}
              >
                <span>Mở Cuộn Thư Lụa</span>
              </button>
              <button
                type="button"
                className="btn-primary vfx-glow-btn"
                onClick={() => scrollToChapter('chuong-5-thoi-nen', 0.35)}
              >
                <span>Thổi Nến Sinh Nhật</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
