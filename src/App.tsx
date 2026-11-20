import { useCallback, useEffect, useMemo, useRef } from 'react';
import { AmbientPetalsCanvas, type PetalsCanvasHandle } from './components/AmbientPetalsCanvas';
import { BirthdayCake } from './components/BirthdayCake';
import { BlessingsGrid } from './components/BlessingsGrid';
import { EnvelopeIntro } from './components/EnvelopeIntro';
import { FinaleSection } from './components/FinaleSection';
import { FloatingControls } from './components/FloatingControls';
import { HeroSection } from './components/HeroSection';
import { LanternRiver } from './components/LanternRiver';
import { LetterSection } from './components/LetterSection';
import { CHAPTERS_META } from './data/birthdayContent';
import { MusicBoxController } from './utils/musicBox';
import { useGlobalScrollStory } from './utils/useScrollStory';

const CHAPTER_IDS = CHAPTERS_META.map((c) => c.id);

export default function App() {
  const canvasRef = useRef<PetalsCanvasHandle | null>(null);
  const musicBox = useMemo(() => new MusicBoxController(), []);
  const { globalProgress, activeChapterIndex, velocityRef } = useGlobalScrollStory(CHAPTER_IDS);

  // Chapters 5 (BirthdayCake) and 6 (LanternRiver) enter cozy evening & twilight ambiance
  const nightMode = activeChapterIndex >= 4;

  useEffect(() => {
    return () => {
      musicBox.dispose();
    };
  }, [musicBox]);

  const handleBurst = useCallback((x?: number, y?: number) => {
    canvasRef.current?.launchBurst(x, y);
  }, []);

  const handleGrandCelebrate = useCallback(() => {
    canvasRef.current?.launchGrandCelebration();
  }, []);

  const handleStartMusic = useCallback(() => {
    musicBox.start();
  }, [musicBox]);

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <AmbientPetalsCanvas ref={canvasRef} velocityRef={velocityRef} nightMode={nightMode} />
      <FloatingControls
        globalProgress={globalProgress}
        activeChapterIndex={activeChapterIndex}
        nightMode={nightMode}
      />
      <div className="app-shell">
        <main>
          <EnvelopeIntro onStartMusic={handleStartMusic} onBurst={handleBurst} />
          <HeroSection />
          <LetterSection />
          <BlessingsGrid onBurst={handleBurst} />
          <BirthdayCake onGrandCelebrate={handleGrandCelebrate} />
          <LanternRiver onBurst={handleBurst} />
          <FinaleSection
            onGrandCelebrate={handleGrandCelebrate}
            onScrollToTop={handleScrollToTop}
          />
        </main>
      </div>
    </>
  );
}
