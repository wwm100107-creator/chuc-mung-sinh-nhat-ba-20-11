import { useEffect, useRef, useState } from 'react';
import { useSiteContent } from '../context/ContentContext';

export function LanternRiver() {
  const { content } = useSiteContent();
  const lanterns = content.finale.lanterns;
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="chuong-6-hoa-dang"
      ref={sectionRef}
      className={`lantern-watercolor-section ${isVisible ? 'is-revealed' : ''}`}
      aria-labelledby="lantern-heading"
    >
      <div className="vfx-ambient-halo lantern-section-halo" aria-hidden="true" />

      <div className="container">
        <div className="section-heading lantern-heading-wrap">
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

        {/* Harmonious display cards of lotus lantern wishes */}
        <div
          className={`lantern-pond-stage ${lanterns.length === 3 ? 'is-trio-layout' : ''}`}
        >
          {lanterns.map((lantern, idx) => {
            const petalOuter =
              lantern.tone === 'coral'
                ? '#D97870'
                : lantern.tone === 'ivory'
                  ? '#E8C374'
                  : '#E5A63E';
            const petalInner =
              lantern.tone === 'coral'
                ? '#F3B2AA'
                : lantern.tone === 'ivory'
                  ? '#FAF0D7'
                  : '#F8D486';
            const isCenterpiece = lanterns.length === 3 && idx === 2;

            return (
              <article
                key={lantern.id}
                className={`storybook-sheet lantern-watercolor-card ${isCenterpiece ? 'is-centerpiece-lantern' : ''}`}
                style={{
                  transitionDelay: `${idx * 110}ms`,
                }}
              >
                <div className="lantern-card-glow" aria-hidden="true" />
                <div className="lantern-card-header">
                  <span className="lantern-sender">{lantern.sender}</span>
                  <div className="lotus-icon-wrap" aria-hidden="true">
                    <svg width="42" height="34" viewBox="0 0 42 34">
                      <ellipse
                        cx="21"
                        cy="29"
                        rx="17"
                        ry="3"
                        fill="#7A9A78"
                        fillOpacity="0.38"
                      />
                      <ellipse
                        cx="21"
                        cy="29"
                        rx="11"
                        ry="1.6"
                        fill="#E5A83E"
                        fillOpacity="0.35"
                      />
                      <path
                        d="M21 5 C26 12, 35 15, 37 23 C28 27, 14 27, 5 23 C7 15, 16 12, 21 5 Z"
                        fill={petalOuter}
                        fillOpacity="0.9"
                        stroke="#64442C"
                        strokeWidth="1.1"
                      />
                      <path
                        d="M21 7 C24.5 13, 30 16, 31 22.5 C25 25.5, 17 25.5, 11 22.5 C12 16, 17.5 13, 21 7 Z"
                        fill={petalInner}
                        fillOpacity="0.92"
                        stroke="#64442C"
                        strokeWidth="0.95"
                      />
                      <path
                        d="M21 10 C23.2 14, 23 19.5, 21 22 C19 19.5, 18.8 14, 21 10 Z"
                        fill="#FFFDF5"
                        stroke="#8C5A2B"
                        strokeWidth="0.8"
                      />
                      <circle cx="21" cy="17.5" r="2.6" fill="#F5B041" />
                      <circle cx="21" cy="17.5" r="1.3" fill="#FFFDF8" />
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
