import { useMemo, useRef, type TouchEvent } from 'react';
import { useSiteContent } from '../context/ContentContext';
import {
  clamp,
  smoothstep,
  useChapterScroll,
  useScrollProgressJump,
} from '../utils/useScrollStory';

export function LetterSection() {
  const trackRef = useRef<HTMLElement | null>(null);
  const { progress, enterProgress, exitProgress } = useChapterScroll(trackRef, 0.12);
  const jumpToProgress = useScrollProgressJump(trackRef);
  const touchStartXRef = useRef<number | null>(null);
  const { content } = useSiteContent();

  const paragraphs = content.letter.paragraphs;
  const totalParagraphs = Math.max(1, paragraphs.length);
  const unrollFactor = smoothstep(progress, 0.0, 0.18);
  const readingPos = clamp((progress - 0.08) / 0.72, 0, 0.9999);
  const activeParaIndex = Math.min(totalParagraphs - 1, Math.floor(readingPos * totalParagraphs));
  const sealStamped = progress >= 0.8;

  const localParaProgress = clamp(readingPos * totalParagraphs - activeParaIndex, 0, 1);

  const tokenizedParagraphs = useMemo(() => {
    const wordsPerPara = paragraphs.map((p) => p.split(' '));
    const totalWords = wordsPerPara.reduce((acc, arr) => acc + arr.length, 0);
    let globalCursor = 0;

    return wordsPerPara.map((words) =>
      words.map((word, wIdx) => {
        const ratio = globalCursor / Math.max(1, totalWords - 1);
        const localRatio = wIdx / Math.max(1, words.length - 1);
        globalCursor += 1;
        return { word, ratio, localRatio };
      }),
    );
  }, [paragraphs]);

  const jumpParagraph = (idx: number) => {
    const safeIdx = clamp(idx, 0, totalParagraphs - 1);
    const targetP = 0.1 + ((safeIdx + 0.65) / totalParagraphs) * 0.72;
    jumpToProgress(targetP);
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
      jumpParagraph(activeParaIndex + (dx < 0 ? 1 : -1));
    }
  };

  const inkPercent = Math.round(readingPos * 100);
  const sceneOpacity = clamp(enterProgress * 1.15 - exitProgress * 0.7, 0, 1).toFixed(3);
  const sceneY = ((1 - enterProgress) * 48 - exitProgress * 38).toFixed(1);
  const sceneScale = (0.93 + enterProgress * 0.07 - exitProgress * 0.05).toFixed(3);

  return (
    <section
      id="chuong-3-thu-lua"
      ref={trackRef}
      className="scrolly-track track-letter"
      aria-labelledby="letter-heading"
    >
      <div
        className="sticky-stage letter-sticky-stage"
        style={{
          opacity: sceneOpacity,
          transform: `translate3d(0, ${sceneY}px, 0) scale(${sceneScale})`,
        }}
      >
        <div
          className="vfx-ambient-halo"
          aria-hidden="true"
          style={{
            transform: `translate(-50%, -50%) scale(${0.9 + progress * 0.35})`,
          }}
        />

        <div className="container letter-stage-inner">
          <div className="watercolor-scroll-header-art vfx-levitate">
            <img
              src="/images/watercolor-scroll.png"
              alt="Tranh màu nước cuộn thư tre, bút lông gác nghiên ngọc bích và nhành cúc vàng"
              className="watercolor-cutout-img"
              width={420}
              height={235}
              loading="lazy"
              decoding="async"
            />
          </div>

          <div
            className="storybook-sheet letter-watercolor-sheet"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{
              transform: `perspective(1200px) rotateX(${(1 - unrollFactor) * 6}deg) scaleY(${0.95 + unrollFactor * 0.05})`,
            }}
          >
            <div className="ink-progress-rail" aria-hidden="true">
              <div className="ink-progress-fill" style={{ width: `${inkPercent}%` }} />
            </div>

            <div
              className={`letter-seal-mark scroll-stamp ${sealStamped ? 'is-stamped' : ''}`}
              aria-hidden="true"
            >
              <span>20</span>
              <span>Th11</span>
            </div>

            <h2 id="letter-heading" className="letter-salutation">
              {content.letter.salutation}
            </h2>

            {/* Desktop: Word-by-Word Sepia & Crimson Ink Scrubbing */}
            <div className="letter-body-desktop">
              {tokenizedParagraphs.map((words, pIdx) => {
                const isActivePara = pIdx === activeParaIndex;
                return (
                  <p
                    key={pIdx}
                    className={`letter-para-scrub ${isActivePara ? 'is-active' : ''}`}
                    onClick={() => jumpParagraph(pIdx)}
                  >
                    {words.map((item, wIdx) => {
                      const delta = readingPos - item.ratio;
                      const isWritten = delta >= -0.015 || sealStamped;
                      const isBrushTip = Math.abs(delta) < 0.028 && !sealStamped;
                      return (
                        <span
                          key={wIdx}
                          className={`scrub-word ${isWritten ? 'is-written' : ''} ${isBrushTip ? 'is-brush-tip' : ''}`}
                        >
                          {item.word}{' '}
                        </span>
                      );
                    })}
                  </p>
                );
              })}
            </div>

            {/* Mobile: Spacious Reader with Real Word-by-Word Ink Scrubbing & Touch Swipe */}
            <div className="letter-body-mobile">
              <p key={activeParaIndex} className="letter-mobile-active-para">
                {(tokenizedParagraphs[activeParaIndex] ?? []).map((item, wIdx) => {
                  const delta = localParaProgress - item.localRatio * 0.85;
                  const isWritten = delta >= -0.08 || sealStamped;
                  const isBrushTip = Math.abs(delta) < 0.1 && !sealStamped;
                  return (
                    <span
                      key={wIdx}
                      className={`scrub-word ${isWritten ? 'is-written' : ''} ${isBrushTip ? 'is-brush-tip' : ''}`}
                    >
                      {item.word}{' '}
                    </span>
                  );
                })}
              </p>

              <div className="letter-mobile-pager">
                <button
                  type="button"
                  className="pager-icon-btn"
                  onClick={() => jumpParagraph(activeParaIndex - 1)}
                  disabled={activeParaIndex === 0}
                  aria-label="Đoạn thư trước"
                >
                  ‹
                </button>
                <div className="pager-dots" role="tablist" aria-label="Chọn đoạn thư">
                  {paragraphs.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      role="tab"
                      aria-selected={idx === activeParaIndex}
                      className={`pager-dot ${idx === activeParaIndex ? 'is-active' : ''}`}
                      onClick={() => jumpParagraph(idx)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="pager-icon-btn"
                  onClick={() => jumpParagraph(activeParaIndex + 1)}
                  disabled={activeParaIndex === totalParagraphs - 1}
                  aria-label="Đoạn thư tiếp theo"
                >
                  ›
                </button>
              </div>
            </div>

            <footer className={`letter-signoff ${sealStamped ? 'is-revealed' : ''}`}>
              <p className="letter-closing">{content.letter.closing}</p>
              <p className="letter-signature">{content.letter.signature}</p>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}
