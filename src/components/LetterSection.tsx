import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LETTER_CONTENT } from '../data/birthdayContent';
import { useChapterScroll, useScrollProgressJump } from '../utils/useScrollStory';

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function LetterSection() {
  const trackRef = useRef<HTMLElement | null>(null);
  const { progress } = useChapterScroll(trackRef, 0.16);
  const jumpToProgress = useScrollProgressJump(trackRef);

  const totalParagraphs = LETTER_CONTENT.paragraphs.length;
  const unrollFactor = clamp(progress / 0.18, 0, 1);
  const readingPos = clamp((progress - 0.12) / 0.68, 0, 0.999);
  const activeParaIndex = Math.min(totalParagraphs - 1, Math.floor(readingPos * totalParagraphs));
  const sealStamped = progress >= 0.8;

  const jumpParagraph = (idx: number) => {
    const safeIdx = clamp(idx, 0, totalParagraphs - 1);
    const targetP = 0.14 + ((safeIdx + 0.5) / totalParagraphs) * 0.68;
    jumpToProgress(targetP);
  };

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
            <div className="section-kicker">Chương 03 · Cuộn Thư Lụa</div>
            <h2 id="letter-heading" className="section-title">
              Lá Thư Nhỏ Gửi Bà 20 Tháng 11
            </h2>
          </div>

          <div
            className="silk-scroll-frame"
            style={{
              transform: `scaleY(${0.92 + unrollFactor * 0.08})`,
            }}
          >
            {/* Top decorative scroll rod */}
            <div className="scroll-rod scroll-rod-top" aria-hidden="true">
              <span className="scroll-rod-cap" />
              <span className="scroll-rod-bar" />
              <span className="scroll-rod-cap" />
            </div>

            <article className="silk-scroll-paper">
              <div
                className={`letter-seal-mark scroll-stamp ${sealStamped ? 'is-stamped' : ''}`}
                aria-hidden="true"
              >
                <span>20</span>
                <span>Th11</span>
              </div>

              <h3 className="letter-salutation">{LETTER_CONTENT.salutation}</h3>

              {/* Desktop shows all paragraphs with progressive highlight; Mobile shows focused reader window */}
              <div className="letter-body-desktop">
                {LETTER_CONTENT.paragraphs.map((paragraph, idx) => {
                  const isActive = idx === activeParaIndex;
                  const isRead = idx < activeParaIndex || sealStamped;
                  return (
                    <p
                      key={idx}
                      className={`letter-para ${isActive ? 'is-active' : ''} ${isRead ? 'is-read' : ''}`}
                      onClick={() => jumpParagraph(idx)}
                    >
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              <div className="letter-body-mobile">
                <p key={activeParaIndex} className="letter-mobile-active-para">
                  {LETTER_CONTENT.paragraphs[activeParaIndex]}
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

            {/* Bottom decorative scroll rod */}
            <div className="scroll-rod scroll-rod-bottom" aria-hidden="true">
              <span className="scroll-rod-cap" />
              <span className="scroll-rod-bar" />
              <span className="scroll-rod-cap" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
