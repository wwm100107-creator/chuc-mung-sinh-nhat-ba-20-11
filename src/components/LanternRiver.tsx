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
    setFeedback('Đèn hoa đăng mới đã tỏa sáng và trôi nhẹ trên mặt hồ màu nước!');
    playLanternBell();
    onBurst(window.innerWidth * 0.5, window.innerHeight * 0.36);

    window.setTimeout(() => {
      setLaunchingId((current) => (current === newId ? null : current));
    }, 1400);
  };

  return (
    <section
      id="chuong-6-hoa-dang"
      className="lantern-watercolor-section"
      aria-labelledby="lantern-heading"
    >
      <div className="container">
        <div className="section-heading">
          <div className="section-kicker">
            <span>Hồ Hoa Đăng Mùa Thu 20·11</span>
          </div>
          <h2 id="lantern-heading" className="section-title">
            Thả Đèn Hoa Đăng Cầu Phúc Thọ Bình An
          </h2>
          <p className="section-desc">
            Vuốt ngang hoặc chạm từng ngọn đèn để xem lời chúc trên mặt hồ, và tự tay thả thêm ngọn
            đèn mới gửi tới Bà.
          </p>
        </div>

        {/* Hand-Painted Watercolor Lotus Lantern Pond Vignette */}
        <div className="watercolor-lantern-pond-art">
          <img
            src="/images/watercolor-lanterns.png"
            alt="Tranh màu nước đèn hoa đăng hoa sen nổi trên mặt hồ cùng hoa cúc vàng và lá sen xanh"
            className="watercolor-blend-img"
            width={780}
            height={440}
          />
        </div>

        {/* Horizontal snap carousel on mobile, paper-ink grid on desktop */}
        <div className="lantern-pond-stage">
          {lanterns.map((lantern) => {
            const isSelected = lantern.id === activeLantern?.id;
            const isNewlyLaunched = lantern.id === launchingId;
            const petalColor =
              lantern.tone === 'coral'
                ? '#D4726A'
                : lantern.tone === 'ivory'
                  ? '#E8C574'
                  : '#E2A43B';

            return (
              <button
                key={lantern.id}
                type="button"
                className={`storybook-sheet lantern-watercolor-card ${isSelected ? 'is-selected' : ''} ${isNewlyLaunched ? 'is-launching' : ''}`}
                onClick={() => setSelectedId(lantern.id)}
              >
                <div className="lantern-card-header">
                  <span className="lantern-sender">{lantern.sender}</span>
                  <div className="lotus-icon-wrap" aria-hidden="true">
                    <svg width="34" height="28" viewBox="0 0 34 28">
                      <ellipse
                        cx="17"
                        cy="23"
                        rx="13"
                        ry="2.5"
                        fill="#789878"
                        fillOpacity="0.45"
                      />
                      <path
                        d="M17 3 C21 9, 28 12, 30 18 C23 22, 11 22, 4 18 C6 12, 13 9, 17 3 Z"
                        fill={petalColor}
                        fillOpacity="0.88"
                        stroke="#6E4A2E"
                        strokeWidth="1"
                      />
                      <circle cx="17" cy="14" r="2.8" fill="#FFFDF6" />
                    </svg>
                  </div>
                </div>
                <p className="lantern-quote">“{lantern.message}”</p>
              </button>
            );
          })}
        </div>

        {activeLantern && (
          <div className="lantern-spotlight-sheet" role="status" aria-live="polite">
            <div>
              <strong>Hoa đăng đang chọn · Từ {activeLantern.sender}:</strong>{' '}
              <span>“{activeLantern.message}”</span>
            </div>
          </div>
        )}

        <form className="storybook-sheet lantern-form-card" onSubmit={handleReleaseLantern}>
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
              {feedback ?? 'Đèn mới sẽ nổi lên ngay trên mặt hồ kỷ niệm.'}
            </span>
            <button type="submit" className="btn-primary">
              <span>Thả Đèn Hoa Đăng</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
