import { useState, type MouseEvent } from 'react';
import { BookOpenCheck, Gift, Sparkles } from 'lucide-react';
import { BLESSINGS_LIST, SECRET_SEVENTH_BLESSING } from '../data/birthdayContent';

interface BlessingsGridProps {
  onBurst: (x?: number, y?: number) => void;
}

export function BlessingsGrid({ onBurst }: BlessingsGridProps) {
  const [openedIds, setOpenedIds] = useState<string[]>([]);

  const openedCount = openedIds.length;
  const allOpened = openedCount === BLESSINGS_LIST.length;

  const handleToggleCard = (id: string, e: MouseEvent<HTMLButtonElement>) => {
    const isAlreadyOpen = openedIds.includes(id);
    if (!isAlreadyOpen) {
      const rect = e.currentTarget.getBoundingClientRect();
      onBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
      setOpenedIds((prev) => [...prev, id]);
    } else {
      setOpenedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleOpenAll = () => {
    setOpenedIds(BLESSINGS_LIST.map((b) => b.id));
    onBurst(window.innerWidth * 0.5, window.innerHeight * 0.48);
  };

  return (
    <section id="sau-loi-chuc" className="section-block" aria-labelledby="blessings-heading">
      <div className="container">
        <div className="section-heading">
          <div className="section-kicker">Sáu Tấm Lụa Chúc Thọ</div>
          <h2 id="blessings-heading" className="section-title">
            Chạm Mở Từng Lời Chúc Bình An
          </h2>
          <p className="section-desc">
            Mỗi tấm lụa là một lời chúc chân thành gửi đến Bà. Khi mở đủ cả sáu tấm, sẽ có một món
            quà bất ngờ thứ bảy hiện ra.
          </p>
        </div>

        <div className="blessings-toolbar">
          <span className="blessings-counter" role="status" aria-live="polite">
            Đã mở {openedCount} / {BLESSINGS_LIST.length} lời chúc
          </span>

          {!allOpened && (
            <button type="button" className="btn-secondary" onClick={handleOpenAll}>
              <BookOpenCheck size={18} aria-hidden="true" />
              <span>Mở Tất Cả Lời Chúc</span>
            </button>
          )}
        </div>

        <div className="blessings-grid">
          {BLESSINGS_LIST.map((item) => {
            const isOpen = openedIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                className={`blessing-card ${isOpen ? 'is-opened' : ''}`}
                onClick={(e) => handleToggleCard(item.id, e)}
                aria-expanded={isOpen}
              >
                <div>
                  <div className="blessing-card-top">
                    <span className={`blessing-seal accent-${item.accent}`}>{item.sealLabel}</span>
                    {isOpen ? (
                      <Sparkles size={18} color="#C88D32" aria-hidden="true" />
                    ) : (
                      <Gift size={18} color="#9B2C2C" aria-hidden="true" />
                    )}
                  </div>
                  <h3 className="blessing-title">{item.title}</h3>
                </div>

                {isOpen ? (
                  <p className="blessing-body">{item.message}</p>
                ) : (
                  <p className="blessing-closed-prompt">{item.subtitle} →</p>
                )}
              </button>
            );
          })}
        </div>

        {allOpened && (
          <aside className="secret-blessing-card" aria-live="polite">
            <div className="secret-blessing-badge">{SECRET_SEVENTH_BLESSING.badge}</div>
            <h3>{SECRET_SEVENTH_BLESSING.title}</h3>
            <p>{SECRET_SEVENTH_BLESSING.message}</p>
          </aside>
        )}
      </div>
    </section>
  );
}
