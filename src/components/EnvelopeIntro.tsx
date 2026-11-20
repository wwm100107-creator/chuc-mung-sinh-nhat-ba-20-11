import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { getBirthdayDateInfo } from '../data/birthdayContent';
import { playWaxSealChime } from '../utils/musicBox';

interface EnvelopeIntroProps {
  onComplete: () => void;
  onBurst: (x?: number, y?: number) => void;
}

export function EnvelopeIntro({ onComplete, onBurst }: EnvelopeIntroProps) {
  const [opening, setOpening] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const dateInfo = getBirthdayDateInfo();

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    playWaxSealChime();
    onBurst(window.innerWidth * 0.5, window.innerHeight * 0.45);

    window.setTimeout(() => {
      setLeaving(true);
    }, 880);

    window.setTimeout(() => {
      onComplete();
    }, 1350);
  };

  return (
    <main className={`envelope-stage ${leaving ? 'is-leaving' : ''}`}>
      <header className="envelope-header">
        <div className="envelope-date-chip">
          <Sparkles size={16} aria-hidden="true" />
          <span>{dateInfo.badgeText}</span>
        </div>
        <h1 className="envelope-recipient">Kính gửi Bà yêu quý</h1>
        <p className="envelope-subtitle">Có một tấm thiệp nhỏ gửi trọn thương yêu tới Bà</p>
      </header>

      <div className="envelope-wrapper">
        <div className={`envelope-box ${opening ? 'is-opening' : ''}`}>
          <div className="envelope-inner-card">
            <span className="envelope-inner-title">Chúc Mừng Sinh Nhật Bà</span>
            <span className="envelope-inner-note">20 tháng 11 · An lành &amp; Trường thọ</span>
          </div>

          <div className="envelope-pocket" aria-hidden="true" />

          <div className="envelope-flap" aria-hidden="true">
            <div className="envelope-flap-shape" />
          </div>

          <button
            type="button"
            className="wax-seal-btn"
            onClick={handleOpen}
            aria-label="Mở dấu sáp niêm phong thiệp chúc mừng sinh nhật Bà 20 tháng 11"
          >
            <span className="wax-seal-num">20·11</span>
            <span className="wax-seal-label">Mở thiệp</span>
          </button>
        </div>
      </div>

      <div className="envelope-cta-row">
        <button type="button" className="btn-primary" onClick={handleOpen} disabled={opening}>
          <Sparkles size={18} aria-hidden="true" />
          <span>{opening ? 'Đang mở tấm thiệp...' : 'Mở Thiệp Chúc Mừng'}</span>
        </button>
        <span className="envelope-hint">
          Nhấn vào dấu sáp đỏ hoặc nút bên trên để mở thiệp &amp; bật nhạc hộp âm
        </span>
      </div>
    </main>
  );
}
