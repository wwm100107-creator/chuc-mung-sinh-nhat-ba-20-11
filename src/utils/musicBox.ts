// Web Audio API Music Box Synthesizer & Tactile Ceremony Sound Effects
// Zero external MP3 dependencies — works reliably offline and on any browser.

interface MelodyStep {
  freq: number;
  beats: number;
  bass?: number;
}

const NOTE = {
  C3: 130.81,
  F3: 174.61,
  G3: 196.0,
  A3: 220.0,
  Bb3: 233.08,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  Bb4: 466.16,
  C5: 523.25,
} as const;

// Gentle Happy Birthday arrangement in F Major (~90 BPM)
const BIRTHDAY_MELODY: MelodyStep[] = [
  // "Happy Birthday to you"
  { freq: NOTE.C4, beats: 0.75 },
  { freq: NOTE.C4, beats: 0.25 },
  { freq: NOTE.D4, beats: 1.0, bass: NOTE.F3 },
  { freq: NOTE.C4, beats: 1.0, bass: NOTE.A3 },
  { freq: NOTE.F4, beats: 1.0, bass: NOTE.C4 },
  { freq: NOTE.E4, beats: 2.0, bass: NOTE.C3 },

  // "Happy Birthday to you"
  { freq: NOTE.C4, beats: 0.75 },
  { freq: NOTE.C4, beats: 0.25 },
  { freq: NOTE.D4, beats: 1.0, bass: NOTE.G3 },
  { freq: NOTE.C4, beats: 1.0, bass: NOTE.C4 },
  { freq: NOTE.G4, beats: 1.0, bass: NOTE.Bb3 },
  { freq: NOTE.F4, beats: 2.0, bass: NOTE.F3 },

  // "Happy Birthday dear Ba"
  { freq: NOTE.C4, beats: 0.75 },
  { freq: NOTE.C4, beats: 0.25 },
  { freq: NOTE.C5, beats: 1.0, bass: NOTE.F3 },
  { freq: NOTE.A4, beats: 1.0, bass: NOTE.C4 },
  { freq: NOTE.F4, beats: 1.0, bass: NOTE.Bb3 },
  { freq: NOTE.E4, beats: 1.0, bass: NOTE.A3 },
  { freq: NOTE.D4, beats: 1.5, bass: NOTE.Bb3 },

  // "Happy Birthday to you"
  { freq: NOTE.Bb4, beats: 0.75 },
  { freq: NOTE.Bb4, beats: 0.25 },
  { freq: NOTE.A4, beats: 1.0, bass: NOTE.F3 },
  { freq: NOTE.F4, beats: 1.0, bass: NOTE.C4 },
  { freq: NOTE.G4, beats: 1.0, bass: NOTE.C3 },
  { freq: NOTE.F4, beats: 2.6, bass: NOTE.F3 },
];

let sharedCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (typeof window === 'undefined') return null;
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    if (!sharedCtx) {
      sharedCtx = new Ctor();
    }
    if (sharedCtx.state === 'suspended') {
      void sharedCtx.resume().catch(() => {});
    }
    return sharedCtx;
  } catch {
    return null;
  }
}

function playBellTone(
  ctx: AudioContext,
  destination: AudioNode,
  freq: number,
  startTime: number,
  duration: number,
  volume: number,
) {
  const oscMain = ctx.createOscillator();
  const oscHarmonic = ctx.createOscillator();
  const gain = ctx.createGain();
  const harmGain = ctx.createGain();

  oscMain.type = 'sine';
  oscMain.frequency.setValueAtTime(freq, startTime);

  // Subtle music-box tine shimmer at 2x frequency
  oscHarmonic.type = 'triangle';
  oscHarmonic.frequency.setValueAtTime(freq * 2, startTime);
  oscHarmonic.detune.setValueAtTime(3, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + Math.max(duration * 1.15, 0.9));

  harmGain.gain.setValueAtTime(0.0001, startTime);
  harmGain.gain.linearRampToValueAtTime(volume * 0.18, startTime + 0.01);
  harmGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.38);

  oscMain.connect(gain);
  oscHarmonic.connect(harmGain);
  harmGain.connect(gain);
  gain.connect(destination);

  oscMain.start(startTime);
  oscHarmonic.start(startTime);
  const stopAt = startTime + Math.max(duration * 1.25, 1.05);
  oscMain.stop(stopAt);
  oscHarmonic.stop(stopAt);
}

export class MusicBoxController {
  private playing = false;
  private masterGain: GainNode | null = null;
  private loopTimer: number | null = null;
  private beatSeconds = 60 / 88;
  private listeners = new Set<(playing: boolean) => void>();

  subscribe(listener: (playing: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.playing));
  }

  isPlaying(): boolean {
    return this.playing;
  }

  start() {
    if (this.playing) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      this.playing = true;
      this.notify();

      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.85, ctx.currentTime + 0.25);

      // Gentle warm echo feedback for music-box ambiance
      const delay = ctx.createDelay(0.6);
      delay.delayTime.setValueAtTime(0.26, ctx.currentTime);
      const delayGain = ctx.createGain();
      delayGain.gain.setValueAtTime(0.18, ctx.currentTime);

      this.masterGain.connect(ctx.destination);
      this.masterGain.connect(delay);
      delay.connect(delayGain);
      delayGain.connect(ctx.destination);

      this.schedulePhraseLoop();
    } catch {
      this.playing = false;
      this.masterGain = null;
      this.notify();
    }
  }

  private schedulePhraseLoop() {
    if (!this.playing || !this.masterGain) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    let cursor = ctx.currentTime + 0.08;
    for (const step of BIRTHDAY_MELODY) {
      if (!this.playing) return;
      const dur = step.beats * this.beatSeconds;
      playBellTone(ctx, this.masterGain, step.freq, cursor, dur, 0.14);
      if (step.bass) {
        playBellTone(ctx, this.masterGain, step.bass, cursor, dur * 1.4, 0.05);
      }
      cursor += dur;
    }

    // Peaceful 1.6s pause before repeating
    const totalMs = (cursor - ctx.currentTime + 1.6) * 1000;
    this.loopTimer = window.setTimeout(() => {
      this.schedulePhraseLoop();
    }, totalMs);
  }

  pause() {
    if (!this.playing) return;
    this.playing = false;
    this.notify();

    if (this.loopTimer !== null) {
      window.clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }

    const ctx = sharedCtx;
    const gain = this.masterGain;
    this.masterGain = null;

    if (ctx && gain) {
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0.0001, now + 0.22);
      window.setTimeout(() => {
        try {
          gain.disconnect();
        } catch {
          // Ignore already disconnected node
        }
      }, 260);
    }
  }

  toggle(): boolean {
    if (this.playing) {
      this.pause();
    } else {
      this.start();
    }
    return this.playing;
  }

  dispose() {
    this.pause();
    this.listeners.clear();
  }
}

export function playWaxSealChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    const notes = [349.23, 440.0, 523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      playBellTone(ctx, gain, freq, now + i * 0.085, 1.1, 0.09);
    });
  } catch {
    // Ignore audio errors on restricted devices
  }
}

export function playCandlePuff() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const duration = 0.24;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(620, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + duration);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch {
    // Ignore audio errors on restricted devices
  }
}

export function playWishCelebration() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    // Sparkling F major 9th upward chime
    const notes = [349.23, 440.0, 523.25, 659.25, 783.99, 880.0, 1046.5];
    notes.forEach((freq, idx) => {
      playBellTone(ctx, gain, freq, now + idx * 0.075, 1.4, 0.09);
    });
  } catch {
    // Ignore audio errors on restricted devices
  }
}

export function playLanternBell() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    playBellTone(ctx, gain, 523.25, now, 1.3, 0.08);
    playBellTone(ctx, gain, 783.99, now + 0.12, 1.5, 0.065);
  } catch {
    // Ignore audio errors on restricted devices
  }
}
