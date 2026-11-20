import { useRef, type TouchEvent } from 'react';
import { useSiteContent } from '../context/ContentContext';
import {
  clamp,
  scrollToChapter,
  useChapterScroll,
  useScrollProgressJump,
} from '../utils/useScrollStory';

export function HeroSection() {
  const trackRef = useRef<HTMLElement | null>(null);
  const { progress, enterProgress, exitProgress } = useChapterScroll(trackRef, 0.12);
  const jumpToProgress = useScrollProgressJump(trackRef);
  const touchStartXRef = useRef<number | null>(null);
  const { content } = useSiteContent();

  const beats = content.story.beats;
  const maxIndex = Math.max(0, beats.length - 1);
  const continuousBeat = clamp(progress * (maxIndex + 0.55), 0, maxIndex);
  const activeBeatIndex = Math.round(continuousBeat);

  const artScale = (0.94 + progress * 0.1).toFixed(3);
  const artRot = ((progress - 0.5) * 4).toFixed(2);
  const parallaxY = ((progress - 0.5) * -22).toFixed(1);

  // Smooth Chapter Entrance & Exit Scene Transition
  const sceneOpacity = clamp(enterProgress * 1.15 - exitProgress * 0.7, 0, 1).toFixed(3);
  const sceneY = ((1 - enterProgress) * 52 - exitProgress * 42).toFixed(1);
  const sceneScale = (0.92 + enterProgress * 0.08 - exitProgress * 0.05).toFixed(3);

  const selectBeat = (idx: number) => {
    const safeIdx = clamp(idx, 0, maxIndex);
    jumpToProgress((safeIdx + 0.35) / Math.max(1, beats.length));
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
      <div
        className="sticky-stage story-sticky-stage"
        style={{
          opacity: sceneOpacity,
          transform: `translate3d(0, ${sceneY}px, 0) scale(${sceneScale})`,
        }}
      >
        <div
          className="vfx-ambient-halo"
          aria-hidden="true"
          style={{
            transform: `translate(-65%, -50%) scale(${0.95 + progress * 0.3})`,
          }}
        />

        <div className="container story-grid">
          {/* Background-Free Transparent Cutout Watercolor Chrysanthemum & Celadon Teapot Artwork */}
          <div className="watercolor-showcase-col">
            <div className="watercolor-free-art-wrap vfx-levitate">
              <img
                src="/images/hero-chrysanthemum.png"
                alt="Tranh màu nước hoa cúc vàng, cúc họa mi trắng và ấm trà xanh dịu dàng kính tặng sinh nhật Bà"
                className="watercolor-hero-painting watercolor-cutout-img"
                width={500}
                height={500}
                decoding="async"
                style={{
                  transform: `scale(${artScale}) translate3d(0, ${parallaxY}px, 0) rotate(${artRot}deg)`,
                }}
              />
              <div className="storybook-painting-caption">{content.story.paintingCaption}</div>
            </div>
          </div>

          {/* 3D Story Beats with Vertical Scroll + Horizontal Touch Swipe */}
          <div className="story-content-col">
            <div className="storybook-date-tag">
              <span>{content.envelope.dateBadge}</span>
            </div>

            <div
              id="hero-heading"
              className="story-3d-viewport"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {beats.map((beat, idx) => {
                const offset = idx - continuousBeat;
                const absOff = Math.abs(offset);
                const translateX = (offset * 22).toFixed(1);
                const translateY = (offset * 24).toFixed(1);
                const translateZ = (-absOff * 90).toFixed(1);
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
              {beats.map((beat, idx) => (
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
