import { useRef } from 'react';
import { useSiteContent } from '../context/ContentContext';
import { clamp, useChapterScroll } from '../utils/useScrollStory';

export function HeroSection() {
  const trackRef = useRef<HTMLElement | null>(null);
  const { progress, enterProgress, exitProgress } = useChapterScroll(trackRef, 0.12);
  const { content } = useSiteContent();

  const beats = content.story.beats;
  const maxIndex = Math.max(0, beats.length - 1);
  const continuousBeat = clamp(progress * (maxIndex + 0.55), 0, maxIndex);
  const activeBeatIndex = Math.round(continuousBeat);

  const artScale = (0.94 + progress * 0.1).toFixed(3);
  const artRot = ((progress - 0.5) * 4).toFixed(2);
  const parallaxY = ((progress - 0.5) * -22).toFixed(1);

  const sceneOpacity = clamp(enterProgress * 1.15 - exitProgress * 0.7, 0, 1).toFixed(3);
  const sceneY = ((1 - enterProgress) * 52 - exitProgress * 42).toFixed(1);
  const sceneScale = (0.92 + enterProgress * 0.08 - exitProgress * 0.05).toFixed(3);

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

          {/* Pure Scroll-Driven 3D Story Beats */}
          <div className="story-content-col">
            <div className="storybook-date-tag">
              <span>{content.envelope.dateBadge}</span>
            </div>

            <div id="hero-heading" className="story-3d-viewport">
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
                    }}
                  >
                    <div className="story-beat-kicker">{beat.kicker}</div>
                    <h2 className="story-beat-title">{beat.title}</h2>
                    <p className="story-beat-body">{beat.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
