import { useSiteContent } from '../context/ContentContext';

export function LanternRiver() {
  const { content } = useSiteContent();
  const lanterns = content.finale.lanterns;

  return (
    <section
      id="chuong-6-hoa-dang"
      className="lantern-watercolor-section"
      aria-labelledby="lantern-heading"
    >
      <div className="container">
        <div className="section-heading">
          <div className="section-kicker">
            <span>{content.finale.lanternKicker}</span>
          </div>
          <h2 id="lantern-heading" className="section-title">
            {content.finale.lanternTitle}
          </h2>
          <p className="section-desc">{content.finale.lanternDesc}</p>
        </div>

        {/* Background-Free Hand-Painted Watercolor Lotus Lantern Pond Vignette */}
        <div className="watercolor-lantern-pond-art vfx-levitate">
          <img
            src="/images/watercolor-lanterns.png"
            alt="Tranh màu nước đèn hoa đăng hoa sen nổi trên mặt hồ cùng hoa cúc vàng và lá sen xanh"
            className="watercolor-cutout-img"
            width={740}
            height={415}
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Pure display cards of lotus lantern wishes */}
        <div className="lantern-pond-stage">
          {lanterns.map((lantern) => {
            const petalColor =
              lantern.tone === 'coral'
                ? '#D4726A'
                : lantern.tone === 'ivory'
                  ? '#E8C574'
                  : '#E2A43B';

            return (
              <article
                key={lantern.id}
                className="storybook-sheet lantern-watercolor-card"
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
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
