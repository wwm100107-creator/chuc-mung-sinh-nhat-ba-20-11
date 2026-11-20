import { useEffect, useState, type FormEvent } from 'react';
import { Flame, Send } from 'lucide-react';
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

    const newLantern: LanternWish = {
      id: `l-${Date.now()}`,
      sender: senderInput.trim() || 'Người thương của Bà',
      message: trimmedMessage,
      tone: TONES[lanterns.length % TONES.length],
      createdAt: Date.now(),
    };

    setLanterns((prev) => [newLantern, ...prev]);
    setSelectedId(newLantern.id);
    setMessageInput('');
    setSenderInput('');
    setFeedback('Đèn hoa đăng mang lời chúc đã trôi nhẹ lên mặt hồ ấm áp!');
    playLanternBell();
    onBurst(window.innerWidth * 0.5, window.innerHeight * 0.38);
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
          <div className="section-kicker">Chương 06 · Đêm Hoa Đăng 20·11</div>
          <h2 id="lantern-heading" className="section-title">
            Thả Đèn Hoa Đăng Gửi Lời Chúc Tới Bà
          </h2>
          <p className="section-desc">
            Vuốt ngang hoặc chạm từng ngọn đèn để đọc lời nguyện cầu bình an, và thả thêm đèn hoa
            đăng từ con cháu.
          </p>
        </div>

        {/* Horizontal snap carousel on mobile, clean grid on desktop */}
        <div className="lantern-pond-stage">
          {lanterns.map((lantern) => {
            const isSelected = lantern.id === activeLantern?.id;
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
                className={`lantern-float-card ${isSelected ? 'is-selected' : ''}`}
                onClick={() => setSelectedId(lantern.id)}
              >
                <div className="lantern-card-header">
                  <span className="lantern-sender">{lantern.sender}</span>
                  <svg width="26" height="24" viewBox="0 0 26 24" aria-hidden="true">
                    <path
                      d="M13 3 C16 8, 22 10, 23 15 C18 18, 8 18, 3 15 C4 10, 10 8, 13 3 Z"
                      fill={flameFill}
                      fillOpacity="0.92"
                    />
                    <circle cx="13" cy="11" r="2.6" fill="#FFFDF5" />
                    <ellipse cx="13" cy="18.5" rx="10" ry="2.2" fill="#C88D32" fillOpacity="0.55" />
                  </svg>
                </div>
                <p className="lantern-quote">“{lantern.message}”</p>
              </button>
            );
          })}
        </div>

        {activeLantern && (
          <div className="lantern-spotlight" role="status" aria-live="polite">
            <div>
              <strong style={{ color: '#F6C86E' }}>
                <Flame
                  size={16}
                  style={{ verticalAlign: 'text-bottom', marginRight: 6 }}
                  aria-hidden="true"
                />
                Đèn đang sáng · Từ {activeLantern.sender}:
              </strong>{' '}
              <span>“{activeLantern.message}”</span>
            </div>
          </div>
        )}

        <form className="lantern-form-card" onSubmit={handleReleaseLantern}>
          <h3 className="lantern-form-title">Viết Lời Chúc &amp; Thả Thêm Một Ngọn Đèn</h3>
          <p style={{ margin: 0, color: 'var(--sepia)', fontSize: '0.96rem' }}>
            Chạm nhanh một câu chúc gợi ý hoặc tự viết lời nhắn gửi Bà:
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
            <span style={{ color: 'var(--tea-green)', fontSize: '0.92rem', fontWeight: 500 }}>
              {feedback ?? 'Đèn mới sẽ nổi sáng ngay trên dòng sông kỷ niệm.'}
            </span>
            <button type="submit" className="btn-primary">
              <Send size={17} aria-hidden="true" />
              <span>Thả Đèn Hoa Đăng</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
