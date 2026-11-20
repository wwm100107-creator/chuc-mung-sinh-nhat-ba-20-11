import { LETTER_CONTENT } from '../data/birthdayContent';

export function LetterSection() {
  return (
    <section id="thu-gui-ba" className="section-block letter-band" aria-labelledby="letter-heading">
      <div className="container">
        <div className="section-heading">
          <div className="section-kicker">Tâm Tình Từ Cháu</div>
          <h2 id="letter-heading" className="section-title">
            Lá Thư Nhỏ Gửi Bà Ngày 20 Tháng 11
          </h2>
        </div>

        <article className="letter-sheet">
          <div className="letter-seal-mark" aria-hidden="true">
            <span>20</span>
            <span>Th11</span>
          </div>

          <div className="letter-ornament" aria-hidden="true">
            <svg width="110" height="24" viewBox="0 0 110 24" fill="none">
              <line x1="2" y1="12" x2="38" y2="12" stroke="#C88D32" strokeOpacity="0.6" />
              <circle cx="55" cy="12" r="5" fill="#9B2C2C" />
              <circle cx="55" cy="12" r="9" stroke="#C88D32" strokeWidth="1" strokeOpacity="0.6" />
              <line x1="72" y1="12" x2="108" y2="12" stroke="#C88D32" strokeOpacity="0.6" />
            </svg>
          </div>

          <h3 className="letter-salutation">{LETTER_CONTENT.salutation}</h3>

          <div className="letter-body">
            {LETTER_CONTENT.paragraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <footer className="letter-signoff">
            <p className="letter-closing">{LETTER_CONTENT.closing}</p>
            <p className="letter-signature">{LETTER_CONTENT.signature}</p>
          </footer>
        </article>
      </div>
    </section>
  );
}
