import { useEffect, useState, type FormEvent } from 'react';
import {
  INITIAL_LANTERNS,
  QUICK_WISH_SUGGESTIONS,
  type LanternWish,
} from '../data/birthdayContent';
import { playLanternBell } from '../utils/musicBox';

const STORAGE_KEY = 'snvv-ba-lanterns-v1';

interface LanternRiverProps {
  onBurst: (x?: number, y?: number) => void;
}

const TONES: Array<LanternWish['tone']> = ['amber', 'coral', 'ivory'];

export function LanternRiver({ onBurst }: LanternRiverProps) {
  const [lanterns, setLanterns] = useState<LanternWish[]>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as LanternWish[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fall back to default wishes if storage is unavailable
    }
    return INITIAL_LANTERNS;
  });

  const [selectedId, setSelectedId] = useState<string>(INITIAL_LANTERNS[0].id);
  const [senderInput, setSenderInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [launchingId, setLaunchingId] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lanterns));
    } catch {
      // Ignore storage quota errors
    }
  }, [lanterns]);

  const activeLantern = lanterns.find((l) => l.id === selectedId) ?? lanterns[0];

  const handleReleaseLantern = (e: FormEvent) => {
    e.preventDefault();
    const trimmedMessage = messageInput.trim();
    if (!trimmedMessage) {
      setFeedback('Hãy viết một lời chúc nhỏ trước khi thả đèn hoa đăng nhé.');
      return;
    }

    const newId = `l-${Date.now()}`;
    const newLantern: LanternWish = {
      id: newId,
      sender: senderInput.trim() || 'Người thương của Bà',
      message: trimmedMessage,
      tone: TONES[lanterns.length % TONES.length],
      createdAt: Date.now(),
    };

    setLanterns((prev) => [newLantern, ...prev]);
    setSelectedId(newLantern.id);
    setLaunchingId(newId);
    setMessageInput('');
    setSenderInput('');
    setFeedback('Đèn hoa đăng mới đã tỏa sáng và trôi nhẹ lên mặt hồ!');
    playLanternBell();
    onBurst(window.innerWidth * 0.5, window.innerHeight * 0.36);

    window.setTimeout(() => {
      setLaunchingId((current) => (current === newId ? null : current));
    }, 1400);
  };

  return (
    <section
      id="chuong-6-hoa-dang"
      className="lantern-pavilion"
      aria-labelledby="lantern-heading"
    >
      <img
        src="/images/courtyard-lanterns.png"
        alt=""
        aria-hidden="true"
        className="lantern-bg-photo"
      />
      <div className="lantern-bg-scrim" aria-hidden="true" />

      <div className="container">
        <div className="section-heading">
          <div className="section-kicker">
            <span>Hồ Hoa Đăng Đêm Thu 20·11</span>
          </div>
          <h2 id="lantern-heading" className="section-title">
            Thả Đèn Hoa Đăng Cầu Phúc Thọ Bình An
          </h2>
          <p className="section-desc">
            Vuốt ngang hoặc chạm từng ngọn đèn để xem lời chúc lung linh trên mặt nước, và tự tay
            thả thêm ngọn đèn mới gửi tới Bà.
          </p>
        </div>

        {/* Horizontal snap carousel on mobile, glowing pond grid on desktop */}
        <div className="lantern-pond-stage">
          {lanterns.map((lantern) => {
            const isSelected = lantern.id === activeLantern?.id;
            const isNewlyLaunched = lantern.id === launchingId;
            const flameFill =
              lantern.tone === 'coral'
                ? '#F08A6C'
                : lantern.tone === 'ivory'
                  ? '#FFF3D1'
                  : '#F6C86E';

            return (
              <button
                key={lantern.id}
                type="button"
                className={`lantern-float-card ${isSelected ? 'is-selected' : ''} ${isNewlyLaunched ? 'is-launching' : ''}`}
                onClick={() => setSelectedId(lantern.id)}
              >
                <div className="lantern-card-header">
                  <span className="lantern-sender">{lantern.sender}</span>
                  <div className="lotus-icon-wrap" aria-hidden="true">
                    <svg width="34" height="30" viewBox="0 0 34 30">
                      <ellipse
                        cx="17"
                        cy="25"
                        rx="14"
                        ry="3"
                        fill={flameFill}
                        fillOpacity="0.28"
                      />
                      <path
                        d="M17 3 C21 9, 28 12, 30 18 C23 22, 11 22, 4 18 C6 12, 13 9, 17 3 Z"
                        fill={flameFill}
                        fillOpacity="0.94"
                      />
                      <path
                        d="M17 6 C19.5 11, 23 13, 24 18 C20 20, 14 20, 10 18 C11 13, 14.5 11, 17 6 Z"
                        fill="#FFF8E1"
                        fillOpacity="0.72"
                      />
                      <circle cx="17" cy="14" r="3" fill="#FFFFFF" />
                    </svg>
                  </div>
                </div>
                <p className="lantern-quote">“{lantern.message}”</p>
                <div className="lantern-water-ripple" aria-hidden="true" />
              </button>
            );
          })}
        </div>

        {activeLantern && (
          <div className="lantern-spotlight" role="status" aria-live="polite">
            <div>
              <strong style={{ color: '#F6C86E' }}>
                Hoa đăng đang tỏa sáng · Từ {activeLantern.sender}:
              </strong>{' '}
              <span>“{activeLantern.message}”</span>
            </div>
          </div>
        )}

        <form className="lantern-form-card vfx-foil-card" onSubmit={handleReleaseLantern}>
          <h3 className="lantern-form-title">Viết Lời Chúc &amp; Thả Thêm Một Ngọn Đèn</h3>
          <p style={{ margin: 0, color: 'var(--sepia)', fontSize: '0.96rem' }}>
            Chạm nhanh một câu chúc gợi ý bên dưới hoặc tự viết lời nhắn gửi Bà:
          </p>

          <div className="quick-chips">
            {QUICK_WISH_SUGGESTIONS.map((chip) => (
              <button
                key={chip}
                type="button"
                className="quick-chip-btn"
                onClick={() => setMessageInput(chip)}
              >
                + {chip}
              </button>
            ))}
          </div>

          <div className="lantern-form-grid">
            <div className="field-group">
              <label htmlFor="lantern-sender">Tên người gửi (tùy chọn)</label>
              <input
                id="lantern-sender"
                type="text"
                className="field-input"
                maxLength={40}
                placeholder="Ví dụ: Cháu Minh, Cả nhà..."
                value={senderInput}
                onChange={(e) => setSenderInput(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label htmlFor="lantern-message">Lời chúc bình an gửi Bà</label>
              <input
                id="lantern-message"
                type="text"
                className="field-input"
                maxLength={180}
                placeholder="Chúc Bà sinh nhật 20/11 thật nhiều sức khỏe và niềm vui..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
            </div>
          </div>

          <div className="lantern-form-footer">
            <span style={{ color: 'var(--tea-green)', fontSize: '0.92rem', fontWeight: 600 }}>
              {feedback ?? 'Đèn mới sẽ bay lên và tỏa sáng ngay trên mặt hồ kỷ niệm.'}
            </span>
            <button type="submit" className="btn-primary vfx-glow-btn">
              <span>Thả Đèn Hoa Đăng</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
