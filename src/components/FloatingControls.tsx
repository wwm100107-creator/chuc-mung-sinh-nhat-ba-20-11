import { Music2, Pause, Sparkles, Type } from 'lucide-react';
import { CHAPTERS_META } from '../data/birthdayContent';
import { scrollToChapter } from '../utils/useScrollStory';

interface FloatingControlsProps {
  globalProgress: number;
  activeChapterIndex: number;
  nightMode: boolean;
  isPlaying: boolean;
  onToggleMusic: () => void;
  largeText: boolean;
  onToggleLargeText: () => void;
  onLaunchFireworks: () => void;
}

export function FloatingControls({
  globalProgress,
  activeChapterIndex,
  nightMode,
  isPlaying,
  onToggleMusic,
  largeText,
  onToggleLargeText,
  onLaunchFireworks,
}: FloatingControlsProps) {
  const currentChapter = CHAPTERS_META[activeChapterIndex] ?? CHAPTERS_META[0];
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

      {/* Desktop top-right floating action pill + Mobile bottom thumb dock */}
      <nav
        className={`floating-controls ${nightMode ? 'is-night' : ''}`}
        aria-label="Điều khiển nhanh và điều hướng chương"
      >
        <div className="mobile-chapter-bar">
          <div className="mobile-dots-row" role="group" aria-label="Chọn chương">
            {CHAPTERS_META.map((ch, idx) => {
              const isActive = idx === activeChapterIndex;
              return (
                <button
                  key={ch.id}
                  type="button"
                  className={`mobile-dot-btn ${isActive ? 'is-active' : ''}`}
                  onClick={() => scrollToChapter(ch.id, idx === 0 ? 0.0 : 0.14)}
                  aria-label={`Chương ${ch.shortLabel}`}
                  aria-current={isActive ? 'step' : undefined}
                />
              );
            })}
          </div>
          <span className="mobile-chapter-name">
            {currentChapter.num} · {currentChapter.shortLabel}
          </span>
        </div>

        <div className="ctrl-actions-group">
          <button
            type="button"
            className={`ctrl-btn ${isPlaying ? 'is-active' : ''}`}
            onClick={onToggleMusic}
            aria-pressed={isPlaying}
            aria-label={isPlaying ? 'Tạm dừng nhạc hộp âm' : 'Phát nhạc hộp âm'}
          >
            {isPlaying ? (
              <>
                <span className="music-bars" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <Pause size={14} aria-hidden="true" />
                <span>Nhạc</span>
              </>
            ) : (
              <>
                <Music2 size={16} aria-hidden="true" />
                <span>Nhạc</span>
              </>
            )}
          </button>

          <button
            type="button"
            className={`ctrl-btn ${largeText ? 'is-active' : ''}`}
            onClick={onToggleLargeText}
            aria-pressed={largeText}
            aria-label={largeText ? 'Tắt chế độ chữ lớn' : 'Bật chế độ chữ lớn dễ đọc'}
          >
            <Type size={16} aria-hidden="true" />
            <span>
              A+ <span className="ctrl-label-hide-xs">Chữ lớn</span>
            </span>
          </button>

          <button
            type="button"
            className="ctrl-btn"
            onClick={onLaunchFireworks}
            aria-label="Bắn pháo hoa hoa cúc chúc mừng Bà"
          >
            <Sparkles size={16} aria-hidden="true" />
            <span className="ctrl-label-hide-xs">Pháo hoa</span>
          </button>
        </div>
      </nav>
    </>
  );
}
