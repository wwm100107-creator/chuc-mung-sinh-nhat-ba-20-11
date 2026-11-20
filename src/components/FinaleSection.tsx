import { CLOSING_POEM } from '../data/birthdayContent';

interface FinaleSectionProps {
  onGrandCelebrate: () => void;
  onScrollToTop: () => void;
}

export function FinaleSection({ onGrandCelebrate, onScrollToTop }: FinaleSectionProps) {
  return (
    <section className="finale-section" aria-labelledby="finale-heading">
      <div className="container">
        <div className="storybook-sheet finale-medallion">
          <div className="finale-watercolor-vignette">
            <img
              src="/images/watercolor-blessings.png"
              alt="Vòng hoa cúc màu nước chúc thọ Bà"
              className="watercolor-blend-img"
              width={160}
              height={160}
            />
            <span className="finale-seal-num">20·11</span>
          </div>

          <div className="section-kicker" style={{ marginBottom: '0.75rem' }}>
            Lời Thơ Kết Kính Dâng Bà
          </div>
          <h2 id="finale-heading" className="section-title" style={{ marginBottom: '1.1rem' }}>
            Mãi Khỏe Mạnh &amp; An Nhiên, Bà Nhé
          </h2>

          <blockquote className="finale-poem">
            {CLOSING_POEM.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </blockquote>

          <div className="finale-actions">
            <button type="button" className="btn-primary" onClick={onGrandCelebrate}>
              <span>Tung Cánh Hoa Cúc Chúc Mừng</span>
            </button>

            <button type="button" className="btn-secondary" onClick={onScrollToTop}>
              <span>Cuộn Lên Đầu Trang</span>
            </button>
          </div>
        </div>

        <footer className="site-footer">
          Tấm thiệp màu nước kỷ niệm ngày sinh nhật Bà 20 tháng 11 · Làm bằng trọn vẹn yêu thương
          từ con cháu
        </footer>
      </div>
    </section>
  );
}
