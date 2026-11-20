import { RotateCcw, Sparkles } from 'lucide-react';
import { CLOSING_POEM } from '../data/birthdayContent';

interface FinaleSectionProps {
  onGrandCelebrate: () => void;
  onReplayIntro: () => void;
}

export function FinaleSection({ onGrandCelebrate, onReplayIntro }: FinaleSectionProps) {
  return (
    <section className="finale-section" aria-labelledby="finale-heading">
      <div className="container">
        <div className="heirloom-card finale-medallion">
          <div className="finale-seal" aria-hidden="true">
            20·11
          </div>

          <div className="section-kicker" style={{ marginBottom: '0.85rem' }}>
            Lời Kết Kính Tặng Bà
          </div>
          <h2 id="finale-heading" className="section-title" style={{ marginBottom: '1.15rem' }}>
            Mãi Khỏe Mạnh &amp; An Nhiên, Bà Nhé
          </h2>

          <blockquote className="finale-poem">
            {CLOSING_POEM.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </blockquote>

          <div className="finale-actions">
            <button type="button" className="btn-primary" onClick={onGrandCelebrate}>
              <Sparkles size={18} aria-hidden="true" />
              <span>Bắn Pháo Hoa Chúc Mừng</span>
            </button>

            <button type="button" className="btn-secondary" onClick={onReplayIntro}>
              <RotateCcw size={18} aria-hidden="true" />
              <span>Mở Lại Thiệp Từ Đầu</span>
            </button>
          </div>
        </div>

        <footer className="site-footer">
          Tấm thiệp kỷ niệm ngày sinh nhật Bà 20 tháng 11 · Làm bằng trọn vẹn yêu thương từ con cháu
        </footer>
      </div>
    </section>
  );
}
