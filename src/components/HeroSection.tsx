import { useRef } from 'react';
import { CalendarHeart, Flame, MailOpen } from 'lucide-react';
import { STORY_BEATS, getBirthdayDateInfo } from '../data/birthdayContent';
import {
  scrollToChapter,
  useChapterScroll,
  useScrollProgressJump,
} from '../utils/useScrollStory';

export function HeroSection() {
  const trackRef = useRef<HTMLElement | null>(null);
  const { progress } = useChapterScroll(trackRef, 0.16);
  const jumpToProgress = useScrollProgressJump(trackRef);
  const dateInfo = getBirthdayDateInfo();

  const beatIndex = progress < 0.34 ? 0 : progress < 0.68 ? 1 : 2;
  const activeBeat = STORY_BEATS[beatIndex];
  const ringDeg = Math.round(progress * 65);

  return (
    <section
      id="chuong-2-huong-tra"
      ref={trackRef}
      className="scrolly-track track-story"
      aria-labelledby="hero-heading"
    >
      <div className="sticky-stage story-sticky-stage">
        <div className="container story-grid">
          {/* Circular Moon-Window Illustration */}
          <div className="moon-window-col">
            <div className="moon-window-wrap">
              <svg
                className="moon-filigree-ring"
                viewBox="0 0 240 240"
                aria-hidden="true"
                style={{ transform: `rotate(${ringDeg}deg)` }}
              >
                <circle
                  cx="120"
                  cy="120"
                  r="114"
                  fill="none"
                  stroke="#C88D32"
                  strokeOpacity="0.45"
                  strokeWidth="1.2"
                  strokeDasharray="6 6"
                />
                <circle
                  cx="120"
                  cy="120"
                  r="106"
                  fill="none"
                  stroke="#9B2C2C"
                  strokeOpacity="0.28"
                  strokeWidth="1"
                />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <circle
                    key={deg}
                    cx={120 + 114 * Math.cos((deg * Math.PI) / 180)}
                    cy={120 + 114 * Math.sin((deg * Math.PI) / 180)}
                    r="3.2"
                    fill="#C88D32"
                  />
                ))}
              </svg>

              <div className="moon-window-frame">
                <img
                  src="/images/hero-chrysanthemum.png"
                  alt="Tranh màu nước hoa cúc vàng, cúc họa mi trắng và ấm trà xanh dịu dàng kính tặng sinh nhật Bà"
                  className="moon-window-img"
                  width={520}
                  height={520}
                />
              </div>

              <div className="moon-caption-pill">Sắc thu dịu dàng · 20/11</div>
            </div>
          </div>

          {/* 3 Cross-fading Story Beats */}
          <div className="story-content-col">
            <div className="hero-date-pill">
              <CalendarHeart size={17} aria-hidden="true" />
              <span>{dateInfo.badgeText}</span>
            </div>

            <div key={activeBeat.id} className="story-beat-card">
              <div className="story-beat-kicker">{activeBeat.kicker}</div>
              <h2 id="hero-heading" className="story-beat-title">
                {activeBeat.title}
              </h2>
              <p className="story-beat-body">{activeBeat.body}</p>
            </div>

            <div className="beat-dots-bar" role="group" aria-label="Chọn nhịp câu chuyện">
              {STORY_BEATS.map((beat, idx) => (
                <button
                  key={beat.id}
                  type="button"
                  className={`beat-pill-btn ${idx === beatIndex ? 'is-active' : ''}`}
                  onClick={() => jumpToProgress((idx + 0.45) / STORY_BEATS.length)}
                  aria-pressed={idx === beatIndex}
                >
                  Nhịp {idx + 1}
                </button>
              ))}
            </div>

            <div className="story-quick-jumps">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => scrollToChapter('chuong-3-thu-lua', 0.16)}
              >
                <MailOpen size={17} aria-hidden="true" />
                <span>Đọc Thư Lụa</span>
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => scrollToChapter('chuong-5-thoi-nen', 0.35)}
              >
                <Flame size={17} aria-hidden="true" />
                <span>Tới Bánh Sinh Nhật</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
