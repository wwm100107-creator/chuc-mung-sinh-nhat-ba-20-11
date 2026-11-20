import { CalendarHeart, Flame, HeartHandshake, MailOpen } from 'lucide-react';
import { getBirthdayDateInfo } from '../data/birthdayContent';

export function HeroSection() {
  const dateInfo = getBirthdayDateInfo();

  return (
    <section className="hero-section" aria-labelledby="hero-heading">
      <div className="container hero-grid">
        <div>
          <div className="hero-date-pill">
            <CalendarHeart size={18} aria-hidden="true" />
            <span>{dateInfo.badgeText}</span>
          </div>

          <div className="hero-numerals" aria-hidden="true">
            <span>20 · 11</span>
            <span className="hero-numerals-line" />
          </div>

          <h1 id="hero-heading" className="hero-title">
            Chúc Mừng Sinh Nhật
            <span className="hero-title-accent">Bà Yêu Quý</span>
          </h1>

          <p className="hero-lead">
            Mùa thu ghé qua hiên nhà cùng sắc vàng hoa cúc và hương trà ấm. Cả nhà kính chúc Bà
            một ngày 20 tháng 11 thật nhiều niềm vui, bình an và mãi khỏe mạnh bên con cháu.
          </p>

          <p className="hero-substatus">{dateInfo.subStatusText}</p>

          <div className="hero-actions">
            <a href="#banh-sinh-nhat" className="btn-primary">
              <Flame size={18} aria-hidden="true" />
              <span>Thổi Nến Sinh Nhật</span>
            </a>
            <a href="#thu-gui-ba" className="btn-secondary">
              <MailOpen size={18} aria-hidden="true" />
              <span>Đọc Thư Gửi Bà</span>
            </a>
            <a href="#tha-den-hoa-dang" className="btn-secondary">
              <HeartHandshake size={18} aria-hidden="true" />
              <span>Thả Đèn Hoa Đăng</span>
            </a>
          </div>
        </div>

        <div className="hero-art-frame">
          <div className="hero-art-halo">
            <img
              src="/images/hero-chrysanthemum.png"
              alt="Tranh màu nước hoa cúc vàng, cúc họa mi trắng và ấm trà xanh dịu dàng kính tặng sinh nhật Bà"
              className="hero-art-img"
              width={640}
              height={640}
            />
            <div className="hero-art-caption">Sắc thu dịu dàng · Kính dâng Bà 20/11</div>
          </div>
        </div>
      </div>
    </section>
  );
}
