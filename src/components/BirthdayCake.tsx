import { useEffect, useRef, useState } from 'react';
import { useSiteContent } from '../context/ContentContext';
import { playCandlePuff, playWishCelebration } from '../utils/musicBox';
import { clamp, useChapterScroll, useScrollProgressJump } from '../utils/useScrollStory';

interface BirthdayCakeProps {
  onGrandCelebrate: () => void;
}

const PAINTED_CANDLE_WICKS = [
  { id: 0, x: 427, y: 248 },
  { id: 1, x: 464, y: 243 },
  { id: 2, x: 500, y: 253 },
  { id: 3, x: 538, y: 248 },
  { id: 4, x: 574, y: 248 },
];

export function BirthdayCake({ onGrandCelebrate }: BirthdayCakeProps) {
  const trackRef = useRef<HTMLElement | null>(null);
  const { progress, enterProgress, exitProgress } = useChapterScroll(trackRef, 0.12);
  const jumpToProgress = useScrollProgressJump(trackRef);
  const { content } = useSiteContent();

  const [litCandles, setLitCandles] = useState<boolean[]>([true, true, true, true, true]);
  const [smokeTick, setSmokeTick] = useState<number[]>([0, 0, 0, 0, 0]);
  const [wishRevealed, setWishRevealed] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [micMessage, setMicMessage] = useState<string | null>(null);

  const litRef = useRef<boolean[]>(litCandles);
  litRef.current = litCandles;

  const micStreamRef = useRef<MediaStream | null>(null);
  const micCtxRef = useRef<AudioContext | null>(null);
  const micRafRef = useRef<number | null>(null);
  const lastBlowTimeRef = useRef(0);
  const celebrationFiredRef = useRef(false);
  const scrollAutoBlowTriggeredRef = useRef(false);

  const remainingCount = litCandles.filter(Boolean).length;
  const awakeCount = progress < 0.02 ? 1 : Math.min(5, Math.ceil((progress / 0.22) * 5));
  const activeFlameCount = litCandles.filter((lit, idx) => lit && idx < awakeCount).length;

  const stopMicListener = () => {
    if (micRafRef.current !== null) {
      window.cancelAnimationFrame(micRafRef.current);
      micRafRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (micCtxRef.current) {
      void micCtxRef.current.close();
      micCtxRef.current = null;
    }
    setMicActive(false);
    setMicLevel(0);
  };

  useEffect(() => {
    return () => {
      stopMicListener();
    };
  }, []);

  const extinguishCandle = (index: number) => {
    if (!litRef.current[index]) return;
    playCandlePuff();
    setLitCandles((prev) => prev.map((v, idx) => (idx === index ? false : v)));
    setSmokeTick((prev) => prev.map((v, idx) => (idx === index ? v + 1 : v)));
  };

  const extinguishNextLit = () => {
    const nextIdx = litRef.current.findIndex(Boolean);
    if (nextIdx !== -1) {
      extinguishCandle(nextIdx);
    }
  };

  const blowAllRemaining = () => {
    const indices = litRef.current
      .map((isLit, idx) => (isLit ? idx : -1))
      .filter((idx) => idx >= 0);

    indices.forEach((candleIdx, step) => {
      window.setTimeout(() => {
        extinguishCandle(candleIdx);
      }, step * 120);
    });
  };

  useEffect(() => {
    if (progress >= 0.86 && remainingCount > 0 && !scrollAutoBlowTriggeredRef.current) {
      scrollAutoBlowTriggeredRef.current = true;
      blowAllRemaining();
    }
  }, [progress, remainingCount]);

  useEffect(() => {
    if (remainingCount === 0 && !celebrationFiredRef.current) {
      celebrationFiredRef.current = true;
      setWishRevealed(true);
      playWishCelebration();
      onGrandCelebrate();
      stopMicListener();
    }
  }, [remainingCount, onGrandCelebrate]);

  const relightCandles = () => {
    celebrationFiredRef.current = false;
    scrollAutoBlowTriggeredRef.current = true;
    setWishRevealed(false);
    setLitCandles([true, true, true, true, true]);
    setMicMessage(null);
    jumpToProgress(0.42);
  };

  const toggleMicrophone = async () => {
    if (micActive) {
      stopMicListener();
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicMessage('Trình duyệt này chưa hỗ trợ micro — Bà cứ bấm nút "Thổi Tắt Tất Cả Nến" nhé ạ.');
      return;
    }

    try {
      setMicMessage(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtor) {
        setMicMessage('Thiết bị không hỗ trợ xử lý âm thanh — Bà bấm trực tiếp lên ngọn nến nhé ạ.');
        stopMicListener();
        return;
      }

      const ctx = new AudioCtor();
      micCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);
      setMicActive(true);

      const detectBlow = () => {
        if (!micStreamRef.current) return;
        analyser.getByteTimeDomainData(data);
        let sumSq = 0;
        for (let i = 0; i < data.length; i += 1) {
          const norm = (data[i] - 128) / 128;
          sumSq += norm * norm;
        }
        const rms = Math.sqrt(sumSq / data.length);
        const levelPct = Math.min(100, Math.round(rms * 380));
        setMicLevel(levelPct);

        const now = performance.now();
        if (rms > 0.13 && now - lastBlowTimeRef.current > 240) {
          lastBlowTimeRef.current = now;
          extinguishNextLit();
        }

        micRafRef.current = window.requestAnimationFrame(detectBlow);
      };

      micRafRef.current = window.requestAnimationFrame(detectBlow);
    } catch {
      setMicMessage(
        'Chưa cấp quyền micro — không sao cả, Bà chạm vào từng ngọn nến hoặc bấm nút bên dưới nhé ạ.',
      );
      stopMicListener();
    }
  };

  const sceneOpacity = clamp(enterProgress * 1.15 - exitProgress * 0.7, 0, 1).toFixed(3);
  const sceneY = ((1 - enterProgress) * 48 - exitProgress * 38).toFixed(1);
  const sceneScale = (0.93 + enterProgress * 0.07 - exitProgress * 0.05).toFixed(3);

  return (
    <section
      id="chuong-5-thoi-nen"
      ref={trackRef}
      className="scrolly-track track-cake"
      aria-labelledby="cake-heading"
    >
      <div
        className="sticky-stage cake-sticky-stage"
        style={{
          opacity: sceneOpacity,
          transform: `translate3d(0, ${sceneY}px, 0) scale(${sceneScale})`,
        }}
      >
        <div
          className="vfx-ambient-halo"
          aria-hidden="true"
          style={{
            transform: `translate(-50%, -45%) scale(${0.85 + (activeFlameCount / 5) * 0.4})`,
          }}
        />

        <div className="container cake-stage-inner">
          <div className="section-heading cake-compact-heading">
            <div className="section-kicker">{content.cake.sectionKicker}</div>
            <h2 id="cake-heading" className="section-title">
              {content.cake.sectionTitle}
            </h2>
            <p className="section-desc">{content.cake.sectionDesc}</p>
          </div>

          <div
            className={`storybook-sheet cake-watercolor-card ${wishRevealed ? 'is-wish-revealed' : ''}`}
          >
            <div className="watercolor-cake-painting-box vfx-levitate" onClick={extinguishNextLit}>
              <img
                src="/images/watercolor-cake.png"
                alt="Tranh màu nước bánh sinh nhật hai tầng trang trí hoa cúc vàng, nơ lụa hồng và năm ngọn nến sáp ong"
                className="watercolor-cake-img watercolor-cutout-img"
                width={480}
                height={480}
                loading="lazy"
                decoding="async"
              />

              <svg
                viewBox="0 0 1000 1000"
                className="watercolor-flames-overlay"
                aria-label="Năm ngọn nến tương tác trên bánh sinh nhật"
              >
                <defs>
                  <radialGradient id="watercolorFlameHalo" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FCE08B" stopOpacity="0.88" />
                    <stop offset="55%" stopColor="#E8A23A" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#E8A23A" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {PAINTED_CANDLE_WICKS.map((wick, idx) => {
                  const isLit = litCandles[idx] && idx < awakeCount;
                  const smokeCount = smokeTick[idx];
                  return (
                    <g
                      key={wick.id}
                      className="candle-hit"
                      role="button"
                      tabIndex={0}
                      aria-label={
                        litCandles[idx]
                          ? `Ngọn nến số ${idx + 1} đang cháy — chạm để thổi tắt`
                          : `Ngọn nến số ${idx + 1} đã thổi tắt`
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        extinguishCandle(idx);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          extinguishCandle(idx);
                        }
                      }}
                    >
                      <rect
                        x={wick.x - 28}
                        y={wick.y - 90}
                        width="56"
                        height="240"
                        fill="transparent"
                      />

                      {isLit ? (
                        <g>
                          <circle
                            cx={wick.x}
                            cy={wick.y - 26}
                            r="50"
                            fill="url(#watercolorFlameHalo)"
                          />
                          <path
                            className="flame-outer"
                            d={`M${wick.x} ${wick.y - 62} C${wick.x + 15} ${wick.y - 38}, ${wick.x + 13} ${wick.y - 12}, ${wick.x} ${wick.y - 4} C${wick.x - 13} ${wick.y - 12}, ${wick.x - 15} ${wick.y - 38}, ${wick.x} ${wick.y - 62} Z`}
                            fill="#E89A32"
                            stroke="#8F4E14"
                            strokeWidth="2"
                          />
                          <path
                            className="flame-inner"
                            d={`M${wick.x} ${wick.y - 44} C${wick.x + 7} ${wick.y - 30}, ${wick.x + 7} ${wick.y - 14}, ${wick.x} ${wick.y - 8} C${wick.x - 7} ${wick.y - 14}, ${wick.x - 7} ${wick.y - 30}, ${wick.x} ${wick.y - 44} Z`}
                            fill="#FFF7D6"
                          />
                        </g>
                      ) : (
                        smokeCount > 0 && (
                          <path
                            key={`smoke-${wick.id}-${smokeCount}`}
                            className="candle-smoke"
                            d={`M${wick.x} ${wick.y - 8} C${wick.x - 14} ${wick.y - 34}, ${wick.x + 16} ${wick.y - 58}, ${wick.x - 6} ${wick.y - 88}`}
                            fill="none"
                            stroke="#8A6E56"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                        )
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="cake-progress-text" role="status" aria-live="polite">
              {remainingCount > 0
                ? `Đang thắp sáng ${activeFlameCount} / 5 ngọn nến sáp ong — chạm vào bánh hoặc nến để thổi`
                : 'Cả 5 ngọn nến đã tắt! Điều ước bình an đã gửi tới bầu trời thu'}
            </div>

            <div className="cake-controls">
              {remainingCount > 0 ? (
                <>
                  <button type="button" className="btn-primary" onClick={blowAllRemaining}>
                    <span>Thổi Tắt Tất Cả Nến</span>
                  </button>

                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={toggleMicrophone}
                    aria-pressed={micActive}
                  >
                    <span>{micActive ? 'Tắt Micro' : 'Dùng Micro Để Thổi'}</span>
                  </button>
                </>
              ) : (
                <button type="button" className="btn-secondary" onClick={relightCandles}>
                  <span>Thắp Lại Nến Để Thổi Tiếp</span>
                </button>
              )}
            </div>

            {micActive && remainingCount > 0 && (
              <div className="mic-meter-box">
                <div>Bà thổi nhẹ vào micro nhé:</div>
                <div className="mic-meter-track" aria-hidden="true">
                  <div className="mic-meter-fill" style={{ width: `${micLevel}%` }} />
                </div>
              </div>
            )}

            {micMessage && <p className="mic-note-sepia">{micMessage}</p>}

            {wishRevealed && (
              <div className="wish-reveal-card" role="region" aria-live="polite">
                <h3>{content.cake.wishTitle}</h3>
                <p>{content.cake.wishMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
