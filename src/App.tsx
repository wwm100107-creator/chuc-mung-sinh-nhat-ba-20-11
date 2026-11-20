import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AmbientPetalsCanvas, type PetalsCanvasHandle } from './components/AmbientPetalsCanvas';
import { BirthdayCake } from './components/BirthdayCake';
import { BlessingsGrid } from './components/BlessingsGrid';
import { EnvelopeIntro } from './components/EnvelopeIntro';
import { FinaleSection } from './components/FinaleSection';
import { FloatingControls } from './components/FloatingControls';
import { HeroSection } from './components/HeroSection';
import { LanternRiver } from './components/LanternRiver';
import { LetterSection } from './components/LetterSection';
import { MusicBoxController } from './utils/musicBox';

export default function App() {
  const [opened, setOpened] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const canvasRef = useRef<PetalsCanvasHandle | null>(null);
  const musicBox = useMemo(() => new MusicBoxController(), []);

  useEffect(() => {
    const unsubscribe = musicBox.subscribe(setIsPlaying);
    return () => {
      unsubscribe();
      musicBox.dispose();
    };
  }, [musicBox]);

  useEffect(() => {
    document.documentElement.setAttribute('data-large-text', largeText ? 'true' : 'false');
  }, [largeText]);

  const handleBurst = useCallback((x?: number, y?: number) => {
    canvasRef.current?.launchBurst(x, y);
  }, []);

  const handleGrandCelebrate = useCallback(() => {
    canvasRef.current?.launchGrandCelebration();
  }, []);

  const handleEnvelopeComplete = useCallback(() => {
    setOpened(true);
    musicBox.start();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [musicBox]);

  const handleToggleMusic = useCallback(() => {
    musicBox.toggle();
  }, [musicBox]);

  const handleToggleLargeText = useCallback(() => {
    setLargeText((prev) => !prev);
  }, []);

  const handleReplayIntro = useCallback(() => {
    setOpened(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <AmbientPetalsCanvas ref={canvasRef} />
      <div className="app-shell">
        {!opened ? (
          <EnvelopeIntro onComplete={handleEnvelopeComplete} onBurst={handleBurst} />
        ) : (
          <>
            <FloatingControls
              isPlaying={isPlaying}
              onToggleMusic={handleToggleMusic}
              largeText={largeText}
              onToggleLargeText={handleToggleLargeText}
              onLaunchFireworks={handleGrandCelebrate}
            />
            <main>
              <HeroSection />
              <BirthdayCake onGrandCelebrate={handleGrandCelebrate} />
              <LetterSection />
              <BlessingsGrid onBurst={handleBurst} />
              <LanternRiver onBurst={handleBurst} />
              <FinaleSection
                onGrandCelebrate={handleGrandCelebrate}
                onReplayIntro={handleReplayIntro}
              />
            </main>
          </>
        )}
      </div>
    </>
  );
}
