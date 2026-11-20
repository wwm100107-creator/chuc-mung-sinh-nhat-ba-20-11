import { useEffect, useRef, useState } from 'react';
import { playCandlePuff, playWishCelebration } from '../utils/musicBox';
import { useChapterScroll, useScrollProgressJump } from '../utils/useScrollStory';

interface BirthdayCakeProps {
  onGrandCelebrate: () => void;
}

const CANDLE_POSITIONS = [
  { id: 0, x: 118, y: 114, bodyColor: '#E6B85C', stripeColor: '#FFF7E4' },
  { id: 1, x: 164, y: 106, bodyColor: '#D46A5E', stripeColor: '#FFEFE9' },
  { id: 2, x: 210, y: 102, bodyColor: '#C88D32', stripeColor: '#FFF7E4' },
  { id: 3, x: 256, y: 106, bodyColor: '#D46A5E', stripeColor: '#FFEFE9' },
  { id: 4, x: 302, y: 114, bodyColor: '#E6B85C', stripeColor: '#FFF7E4' },
];

export function BirthdayCake({ onGrandCelebrate }: BirthdayCakeProps) {
  const trackRef = useRef<HTMLElement | null>(null);
  const { progress } = useChapterScroll(trackRef, 0.15);
  const jumpToProgress = useScrollProgressJump(trackRef);

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
  // Scroll lighting progress when entering the chapter
  const awakeCount = progress < 0.02 ? 1 : Math.min(5, Math.ceil((progress / 0.22) * 5));
  const activeFlameCount = litCandles.filter((lit, idx) => lit && idx < awakeCount).length;
  const roomLightRatio = activeFlameCount / 5;

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

  const blowAllRemaining = () => {
    const indices = litRef.current
      .map((isLit, idx) => (isLit ? idx : -1))
      .filter((idx) => idx >= 0);

    indices.forEach((candleIdx, step) => {
      window.setTimeout(() => {
        extinguishCandle(candleIdx);
      }, step * 125);
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
          const nextLit = litRef.current.findIndex(Boolean);
          if (nextLit !== -1) {
            extinguishCandle(nextLit);
          }
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
          ['--candle-aura' as string]: (0.06 + roomLightRatio * 0.24).toFixed(2),
        }}
      >
        <div className="container cake-stage-inner">
          <div className="section-heading cake-compact-heading">
            <div className="section-kicker">Nghi Thức Ánh Nến Đêm Thu 20·11</div>
            <h2 id="cake-heading" className="section-title">
              Ước Một Điều Thật Bình An, Bà Nhé
            </h2>
            <p className="section-desc">
              Chạm vào từng ngọn nến, bấm thổi tất cả, dùng micro — hoặc cuộn nhẹ xuống để làn gió
              thu thổi nến cùng pháo hoa rực rỡ.
            </p>
          </div>

          <div className="cake-dark-card vfx-hearth-card">
            <div className="cake-svg-wrap">
              <svg
                viewBox="0 0 420 330"
                className="cake-svg"
                role="img"
                aria-label="Chiếc bánh sinh nhật hai tầng trang trí hoa cúc vàng với năm ngọn nến"
              >
                <defs>
                  <radialGradient id="candleGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFF0B3" stopOpacity="0.95" />
                    <stop offset="45%" stopColor="#F59E0B" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="cakeCreamTop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFFDF7" />
                    <stop offset="100%" stopColor="#F5E5CB" />
                  </linearGradient>
                  <linearGradient id="cakeCreamBottom" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FAF0DD" />
                    <stop offset="100%" stopColor="#ECD2AC" />
                  </linearGradient>
                  <linearGradient id="cakePlatter" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#B87E28" />
                    <stop offset="50%" stopColor="#F1CA78" />
                    <stop offset="100%" stopColor="#B87E28" />
                  </linearGradient>
                </defs>

                {/* Dynamic overarching candlelight pool on cake */}
                <ellipse
                  cx="210"
                  cy="125"
                  rx={120 + activeFlameCount * 16}
                  ry={55 + activeFlameCount * 9}
                  fill="url(#candleGlow)"
                  opacity={0.18 + roomLightRatio * 0.55}
                />

                {/* Warm pedestal & shadow */}
                <ellipse cx="210" cy="306" rx="168" ry="16" fill="rgba(0, 0, 0, 0.42)" />
                <path d="M180 282 L240 282 L254 303 L166 303 Z" fill="url(#cakePlatter)" />
                <ellipse
                  cx="210"
                  cy="282"
                  rx="164"
                  ry="18"
                  fill="#E8C272"
                  stroke="#B67C27"
                  strokeWidth="2"
                />
                <ellipse cx="210" cy="280" rx="146" ry="12" fill="#FFF9EE" />

                {/* Bottom cake tier */}
                <path
                  d="M78 196 L78 268 C78 282 342 282 342 268 L342 196 Z"
                  fill="url(#cakeCreamBottom)"
                  stroke="#D9B783"
                  strokeWidth="1.5"
                />
                <path
                  d="M78 242 C130 256 290 256 342 242 L342 256 C290 270 130 270 78 256 Z"
                  fill="#9B2C2C"
                />
                <ellipse
                  cx="210"
                  cy="196"
                  rx="132"
                  ry="16"
                  fill="#FBF2E1"
                  stroke="#DFC08E"
                  strokeWidth="1.2"
                />

                {/* Frosting scallops */}
                <path
                  d="M80 198 Q98 220 116 202 Q134 224 154 203 Q174 226 196 204 Q216 226 238 204 Q258 224 278 203 Q298 222 318 201 Q332 215 340 198"
                  fill="#FFFDF8"
                  stroke="#E5C89A"
                  strokeWidth="1.2"
                />

                {/* Top cake tier */}
                <path
                  d="M104 128 L104 190 C104 202 316 202 316 190 L316 128 Z"
                  fill="url(#cakeCreamTop)"
                  stroke="#DFC08E"
                  strokeWidth="1.5"
                />
                <ellipse
                  cx="210"
                  cy="128"
                  rx="106"
                  ry="14"
                  fill="#FFFDF9"
                  stroke="#E5C89A"
                  strokeWidth="1.5"
                />

                {[136, 173, 210, 247, 284].map((cx) => (
                  <g key={`blossom-${cx}`} transform={`translate(${cx}, 168)`}>
                    <circle r="7.5" fill="#E6B85C" fillOpacity="0.88" />
                    <circle r="3.2" fill="#9B2C2C" />
                  </g>
                ))}
                {[112, 160, 210, 260, 308].map((cx) => (
                  <circle key={`pearl-${cx}`} cx={cx} cy="228" r="4" fill="#E6B85C" />
                ))}

                {/* 20·11 badge */}
                <rect
                  x="176"
                  y="224"
                  width="68"
                  height="30"
                  rx="15"
                  fill="#FFFDF8"
                  stroke="#C88D32"
                  strokeWidth="1.6"
                />
                <text
                  x="210"
                  y="244"
                  textAnchor="middle"
                  fill="#9B2C2C"
                  fontFamily="Cormorant Garamond, Georgia, serif"
                  fontWeight="700"
                  fontSize="16"
                >
                  20 · 11
                </text>

                {/* 5 Interactive Beeswax Candles */}
                {CANDLE_POSITIONS.map((candle, idx) => {
                  const isLit = litCandles[idx] && idx < awakeCount;
                  const smokeCount = smokeTick[idx];
                  return (
                    <g
                      key={candle.id}
                      className="candle-hit"
                      role="button"
                      tabIndex={0}
                      aria-label={
                        litCandles[idx]
                          ? `Ngọn nến số ${idx + 1} đang cháy — bấm để thổi tắt`
                          : `Ngọn nến số ${idx + 1} đã thổi tắt`
                      }
                      onClick={() => extinguishCandle(idx)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          extinguishCandle(idx);
                        }
                      }}
                    >
                      <rect
                        x={candle.x - 18}
                        y={candle.y - 54}
                        width="36"
                        height="94"
                        fill="transparent"
                      />

                      <rect
                        x={candle.x - 6}
                        y={candle.y - 2}
                        width="12"
                        height="34"
                        rx="3"
                        fill={candle.bodyColor}
                        stroke="#9F6B1E"
                        strokeWidth="1"
                        className="candle-body-outline"
                      />
                      <path
                        d={`M${candle.x - 6} ${candle.y + 10} L${candle.x + 6} ${candle.y + 4}`}
                        stroke={candle.stripeColor}
                        strokeWidth="2"
                        strokeOpacity="0.65"
                      />
                      <path
                        d={`M${candle.x - 6} ${candle.y + 22} L${candle.x + 6} ${candle.y + 16}`}
                        stroke={candle.stripeColor}
                        strokeWidth="2"
                        strokeOpacity="0.65"
                      />

                      <line
                        x1={candle.x}
                        y1={candle.y - 2}
                        x2={candle.x}
                        y2={candle.y - 9}
                        stroke="#3A281E"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />

                      {isLit ? (
                        <g>
                          <circle cx={candle.x} cy={candle.y - 22} r="28" fill="url(#candleGlow)" />
                          <path
                            className="flame-outer"
                            d={`M${candle.x} ${candle.y - 40} C${candle.x + 8.5} ${candle.y - 27}, ${candle.x + 7.5} ${candle.y - 12}, ${candle.x} ${candle.y - 10} C${candle.x - 7.5} ${candle.y - 12}, ${candle.x - 8.5} ${candle.y - 27}, ${candle.x} ${candle.y - 40} Z`}
                            fill="#F59E0B"
                          />
                          <path
                            className="flame-inner"
                            d={`M${candle.x} ${candle.y - 31} C${candle.x + 4} ${candle.y - 22}, ${candle.x + 4} ${candle.y - 14}, ${candle.x} ${candle.y - 12} C${candle.x - 4} ${candle.y - 14}, ${candle.x - 4} ${candle.y - 22}, ${candle.x} ${candle.y - 31} Z`}
                            fill="#FFF8D6"
                          />
                        </g>
                      ) : (
                        smokeCount > 0 && (
                          <path
                            key={`smoke-${candle.id}-${smokeCount}`}
                            className="candle-smoke"
                            d={`M${candle.x} ${candle.y - 10} C${candle.x - 5} ${candle.y - 20}, ${candle.x + 6} ${candle.y - 28}, ${candle.x - 2} ${candle.y - 40}`}
                            fill="none"
                            stroke="#E8D8C8"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                          />
                        )
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="cake-progress-text cake-progress-dark" role="status" aria-live="polite">
              {remainingCount > 0
                ? `Đang thắp sáng ${activeFlameCount} / 5 ngọn nến ước nguyện`
                : 'Cả 5 ngọn nến đã tắt! Điều ước bình an đã sáng rực bầu trời'}
            </div>

            <div className="cake-controls">
              {remainingCount > 0 ? (
                <>
                  <button type="button" className="btn-primary vfx-glow-btn" onClick={blowAllRemaining}>
                    <span>Thổi Tắt Tất Cả Nến</span>
                  </button>

                  <button
                    type="button"
                    className="btn-secondary btn-dark-ghost"
                    onClick={toggleMicrophone}
                    aria-pressed={micActive}
                  >
                    <span>{micActive ? 'Tắt Micro' : 'Dùng Micro Để Thổi'}</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn-secondary btn-dark-ghost"
                  onClick={relightCandles}
                >
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

            {micMessage && <p className="mic-note-dark">{micMessage}</p>}

            {wishRevealed && (
              <div className="wish-reveal-card vfx-foil-card" role="region" aria-live="polite">
                <h3>Chúc Mừng Sinh Nhật Bà 20/11!</h3>
                <p>
                  Kính chúc Bà tuổi mới luôn dồi dào sức khỏe, tay chân vững vàng và nụ cười rạng
                  rỡ mỗi sớm mai!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
