import { ArrowUp, Sparkles } from 'lucide-react';
import { CLOSING_POEM } from '../data/birthdayContent';

interface FinaleSectionProps {
  onGrandCelebrate: () => void;
  onScrollToTop: () => void;
}

export function FinaleSection({ onGrandCelebrate, onScrollToTop }: FinaleSectionProps) {
  return (
    <section className="finale-section" aria-labelledby="finale-heading">
      <div className="container">
        <div className="heirloom-card finale-medallion vfx-foil-card">
          <div className="finale-seal" aria-hidden="true">
            <span>20·11</span>
          </div>

          <div className="section-kicker" style={{ marginBottom: '0.85rem' }}>
            Lời Thơ Kết Kính Dâng Bà
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
            <button type="button" className="btn-primary vfx-glow-btn" onClick={onGrandCelebrate}>
              <Sparkles size={18} aria-hidden="true" />
              <span>Bắn Đại Tiệc Pháo Hoa</span>
            </button>

            <button type="button" className="btn-secondary" onClick={onScrollToTop}>
              <ArrowUp size={18} aria-hidden="true" />
              <span>Cuộn Lên Đầu Trang</span>
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
