import { useSiteContent } from '../context/ContentContext';

export function FinaleSection() {
  const { content } = useSiteContent();

  return (
    <section className="finale-section" aria-labelledby="finale-heading">
      <div className="container">
        <div className="storybook-sheet finale-medallion">
          <div className="finale-watercolor-vignette vfx-levitate">
            <img
              src="/images/watercolor-blessings.png"
              alt="Vòng hoa cúc màu nước chúc thọ Bà"
              className="watercolor-cutout-img"
              width={160}
              height={160}
              loading="lazy"
              decoding="async"
            />
            <span className="finale-seal-num">{content.finale.finaleSealText}</span>
          </div>

          <div className="section-kicker" style={{ marginBottom: '0.75rem' }}>
            {content.finale.finaleKicker}
          </div>
          <h2 id="finale-heading" className="section-title" style={{ marginBottom: '1.1rem' }}>
            {content.finale.finaleTitle}
          </h2>

          <blockquote className="finale-poem" style={{ marginBottom: 0 }}>
            {content.finale.poemLines.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </blockquote>
        </div>

        <footer className="site-footer">{content.finale.footerText}</footer>
      </div>
    </section>
  );
}
