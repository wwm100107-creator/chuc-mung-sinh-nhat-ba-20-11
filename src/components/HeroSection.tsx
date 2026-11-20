import { useRef, type TouchEvent } from 'react';
import { STORY_BEATS, getBirthdayDateInfo } from '../data/birthdayContent';
import {
  clamp,
  scrollToChapter,
  useChapterScroll,
  useScrollProgressJump,
} from '../utils/useScrollStory';

export function HeroSection() {
  const trackRef = useRef<HTMLElement | null>(null);
  const { progress } = useChapterScroll(trackRef, 0.16);
  const jumpToProgress = useScrollProgressJump(trackRef);
  const touchStartXRef = useRef<number | null>(null);
  const dateInfo = getBirthdayDateInfo();

  const continuousBeat = clamp(progress * 2.55, 0, 2);
  const activeBeatIndex = Math.round(continuousBeat);

  const artScale = (0.96 + progress * 0.07).toFixed(3);
  const parallaxY = ((progress - 0.5) * -16).toFixed(1);

  const selectBeat = (idx: number) => {
    const safeIdx = clamp(idx, 0, STORY_BEATS.length - 1);
    jumpToProgress((safeIdx + 0.35) / STORY_BEATS.length);
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
      selectBeat(activeBeatIndex + (dx < 0 ? 1 : -1));
    }
  };

  return (
    <section
      id="chuong-2-huong-tra"
      ref={trackRef}
      className="scrolly-track track-story"
      aria-labelledby="hero-heading"
    >
      <div className="sticky-stage story-sticky-stage">
        <div className="container story-grid">
          {/* Pure Hand-Painted Watercolor Chrysanthemum & Celadon Teapot Artwork */}
          <div className="watercolor-showcase-col">
            <div className="watercolor-botanical-frame">
              <img
                src="/images/hero-chrysanthemum.png"
                alt="Tranh màu nước hoa cúc vàng, cúc họa mi trắng và ấm trà xanh dịu dàng kính tặng sinh nhật Bà"
                className="watercolor-hero-painting watercolor-blend-img"
                width={480}
                height={480}
                decoding="async"
                style={{
                  transform: `scale(${artScale}) translate3d(0, ${parallaxY}px, 0)`,
                }}
              />
              <div className="storybook-painting-caption">
                Hương trà thu · Sắc cúc vàng ngày 20 tháng 11
              </div>
            </div>
          </div>

          {/* 3D Story Beats with Vertical Scroll + Horizontal Touch Swipe */}
          <div className="story-content-col">
            <div className="storybook-date-tag">
              <span>{dateInfo.badgeText}</span>
            </div>

            <div
              id="hero-heading"
              className="story-3d-viewport"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {STORY_BEATS.map((beat, idx) => {
                const offset = idx - continuousBeat;
                const absOff = Math.abs(offset);
                const translateX = (offset * 18).toFixed(1);
                const translateY = (offset * 22).toFixed(1);
                const translateZ = (-absOff * 85).toFixed(1);
                const scale = Math.max(0.86, 1 - absOff * 0.1).toFixed(3);
                const opacity = clamp(1 - absOff * 0.85, 0, 1).toFixed(3);
                const isCurrent = idx === activeBeatIndex;

                return (
                  <article
                    key={beat.id}
                    className={`storybook-sheet story-3d-card ${isCurrent ? 'is-current' : ''}`}
                    style={{
                      opacity,
                      transform: `perspective(1000px) translate3d(${translateX}px, ${translateY}px, ${translateZ}px) scale(${scale})`,
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
                  onClick={() => selectBeat(idx)}
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
                className="btn-primary"
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
