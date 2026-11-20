import { Music2, Pause, Sparkles, Type } from 'lucide-react';

interface FloatingControlsProps {
  isPlaying: boolean;
  onToggleMusic: () => void;
  largeText: boolean;
  onToggleLargeText: () => void;
  onLaunchFireworks: () => void;
}

export function FloatingControls({
  isPlaying,
  onToggleMusic,
  largeText,
  onToggleLargeText,
  onLaunchFireworks,
}: FloatingControlsProps) {
  return (
    <nav className="floating-controls" aria-label="Công cụ tiện ích">
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
            <Pause size={15} aria-hidden="true" />
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
    </nav>
  );
}
