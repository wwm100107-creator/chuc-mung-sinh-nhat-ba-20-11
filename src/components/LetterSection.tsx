import { useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Feather } from 'lucide-react';
import { LETTER_CONTENT } from '../data/birthdayContent';
import {
  clamp,
  smoothstep,
  useChapterScroll,
  useScrollProgressJump,
} from '../utils/useScrollStory';

export function LetterSection() {
  const trackRef = useRef<HTMLElement | null>(null);
  const { progress } = useChapterScroll(trackRef, 0.15);
  const jumpToProgress = useScrollProgressJump(trackRef);

  const totalParagraphs = LETTER_CONTENT.paragraphs.length;
  const unrollFactor = smoothstep(progress, 0.0, 0.16);
  const readingPos = clamp((progress - 0.1) / 0.7, 0, 0.9999);
  const activeParaIndex = Math.min(totalParagraphs - 1, Math.floor(readingPos * totalParagraphs));
  const sealStamped = progress >= 0.8;

  // Split each paragraph into words for continuous golden-ink scrubbing
  const tokenizedParagraphs = useMemo(() => {
    const wordsPerPara = LETTER_CONTENT.paragraphs.map((p) => p.split(' '));
    const totalWords = wordsPerPara.reduce((acc, arr) => acc + arr.length, 0);
    let globalCursor = 0;

    return wordsPerPara.map((words) =>
      words.map((word) => {
        const ratio = globalCursor / Math.max(1, totalWords - 1);
        globalCursor += 1;
        return { word, ratio };
      }),
    );
  }, []);

  const jumpParagraph = (idx: number) => {
    const safeIdx = clamp(idx, 0, totalParagraphs - 1);
    const targetP = 0.12 + ((safeIdx + 0.5) / totalParagraphs) * 0.68;
    jumpToProgress(targetP);
  };

  const rodSpinDeg = Math.round(progress * 540);
  const inkPercent = Math.round(readingPos * 100);

  return (
    <section
      id="chuong-3-thu-lua"
      ref={trackRef}
      className="scrolly-track track-letter"
      aria-labelledby="letter-heading"
    >
      <div className="sticky-stage letter-sticky-stage">
        <div className="container letter-stage-inner">
          <div className="section-heading letter-compact-heading">
            <div className="section-kicker">
              <Feather size={14} aria-hidden="true" />
              <span>Bức Thư Cuộn Lụa Hoàng Kim</span>
            </div>
            <h2 id="letter-heading" className="section-title">
              Tâm Tình Cháu Gửi Bà Ngày 20 Tháng 11
            </h2>
          </div>

          <div
            className="silk-scroll-frame"
            style={{
              transform: `perspective(1200px) rotateX(${(1 - unrollFactor) * 10}deg) scaleY(${0.92 + unrollFactor * 0.08})`,
            }}
          >
            {/* Top carved royal lacquer scroll roller */}
            <div className="scroll-rod scroll-rod-top" aria-hidden="true">
              <span className="scroll-rod-cap" />
              <span
                className="scroll-rod-bar"
                style={{ backgroundPositionX: `${rodSpinDeg}px` }}
              />
              <span className="scroll-rod-cap" />
            </div>

            <article className="silk-scroll-paper vfx-silk-sheen">
              {/* Golden ink progress thread along top of parchment */}
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

              <h3 className="letter-salutation">{LETTER_CONTENT.salutation}</h3>

              {/* Desktop: True Word-by-Word Golden Ink Scrubbing */}
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

              {/* Mobile: Focused Illuminated Reader with Word Scrubbing inside Active Paragraph */}
              <div className="letter-body-mobile">
                <p key={activeParaIndex} className="letter-mobile-active-para">
                  {tokenizedParagraphs[activeParaIndex].map((item, wIdx) => {
                    const isWritten = readingPos >= item.ratio - 0.04 || sealStamped;
                    return (
                      <span
                        key={wIdx}
                        className={`scrub-word ${isWritten ? 'is-written' : 'is-written'}`}
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
                    <ChevronLeft size={18} aria-hidden="true" />
                  </button>
                  <span className="pager-status">
                    Đoạn {activeParaIndex + 1} / {totalParagraphs}
                  </span>
                  <button
                    type="button"
                    className="pager-icon-btn"
                    onClick={() => jumpParagraph(activeParaIndex + 1)}
                    disabled={activeParaIndex === totalParagraphs - 1}
                    aria-label="Đoạn thư tiếp theo"
                  >
                    <ChevronRight size={18} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <footer className={`letter-signoff ${sealStamped ? 'is-revealed' : ''}`}>
                <p className="letter-closing">{LETTER_CONTENT.closing}</p>
                <p className="letter-signature">{LETTER_CONTENT.signature}</p>
              </footer>
            </article>

            {/* Bottom carved royal lacquer scroll roller */}
            <div className="scroll-rod scroll-rod-bottom" aria-hidden="true">
              <span className="scroll-rod-cap" />
              <span
                className="scroll-rod-bar"
                style={{ backgroundPositionX: `${-rodSpinDeg}px` }}
              />
              <span className="scroll-rod-cap" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
