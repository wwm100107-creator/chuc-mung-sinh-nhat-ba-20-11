import { CHAPTERS_META } from '../data/birthdayContent';
import { scrollToChapter } from '../utils/useScrollStory';

interface FloatingControlsProps {
  globalProgress: number;
  activeChapterIndex: number;
  nightMode: boolean;
}

export function FloatingControls({
  globalProgress,
  activeChapterIndex,
  nightMode,
}: FloatingControlsProps) {
  const progressPct = Math.round(globalProgress * 1000) / 10;

  return (
    <>
      {/* Top golden reading progress ribbon */}
      <div className="scroll-ribbon-track" aria-hidden="true">
        <div className="scroll-ribbon-fill" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Desktop left-side chapter spine */}
      <nav
        className={`chapter-spine ${nightMode ? 'is-night' : ''}`}
        aria-label="Hành trình các chương"
      >
        <div className="chapter-spine-line" aria-hidden="true" />
        {CHAPTERS_META.map((ch, idx) => {
          const isActive = idx === activeChapterIndex;
          const isPassed = idx < activeChapterIndex;
          return (
            <button
              key={ch.id}
              type="button"
              className={`spine-node ${isActive ? 'is-active' : ''} ${isPassed ? 'is-passed' : ''}`}
              onClick={() => scrollToChapter(ch.id, idx === 0 ? 0.0 : 0.14)}
              aria-current={isActive ? 'step' : undefined}
              aria-label={`Đi tới chương ${ch.fullLabel}`}
            >
              <span className="spine-dot" aria-hidden="true" />
              <span className="spine-label">{ch.fullLabel}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
