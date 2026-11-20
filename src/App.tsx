import { useCallback, useEffect, useMemo, useRef } from 'react';
import { AmbientPetalsCanvas, type PetalsCanvasHandle } from './components/AmbientPetalsCanvas';
import { BirthdayCake } from './components/BirthdayCake';
import { BlessingsGrid } from './components/BlessingsGrid';
import { ContentEditorModal } from './components/ContentEditorModal';
import { EnvelopeIntro } from './components/EnvelopeIntro';
import { FinaleSection } from './components/FinaleSection';
import { FloatingControls } from './components/FloatingControls';
import { HeroSection } from './components/HeroSection';
import { LanternRiver } from './components/LanternRiver';
import { LetterSection } from './components/LetterSection';
import { ContentProvider } from './context/ContentContext';
import { CHAPTERS_META } from './data/birthdayContent';
import { MusicBoxController } from './utils/musicBox';
import { useGlobalScrollStory } from './utils/useScrollStory';

const CHAPTER_IDS = CHAPTERS_META.map((c) => c.id);

export default function App() {
  const canvasRef = useRef<PetalsCanvasHandle | null>(null);
  const musicBox = useMemo(() => new MusicBoxController(), []);
  const { globalProgress, activeChapterIndex, velocityRef } = useGlobalScrollStory(CHAPTER_IDS);

  const nightMode = activeChapterIndex >= 4;

  // Automatically start the gentle Web Audio music box on first user gesture
  useEffect(() => {
    const startAudioOnce = () => {
      musicBox.start();
      window.removeEventListener('pointerdown', startAudioOnce);
      window.removeEventListener('touchstart', startAudioOnce);
      window.removeEventListener('keydown', startAudioOnce);
    };

    window.addEventListener('pointerdown', startAudioOnce, { passive: true });
    window.addEventListener('touchstart', startAudioOnce, { passive: true });
    window.addEventListener('keydown', startAudioOnce, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', startAudioOnce);
      window.removeEventListener('touchstart', startAudioOnce);
      window.removeEventListener('keydown', startAudioOnce);
      musicBox.dispose();
    };
  }, [musicBox]);

  const handleBurst = useCallback((x?: number, y?: number) => {
    canvasRef.current?.launchBurst(x, y);
  }, []);

  const handleGrandCelebrate = useCallback(() => {
    canvasRef.current?.launchGrandCelebration();
  }, []);

  return (
    <ContentProvider>
      <AmbientPetalsCanvas ref={canvasRef} velocityRef={velocityRef} nightMode={nightMode} />
      <FloatingControls globalProgress={globalProgress} />
      <ContentEditorModal />
      <div className="app-shell">
        <main>
          <EnvelopeIntro onBurst={handleBurst} />
          <HeroSection />
          <LetterSection />
          <BlessingsGrid onBurst={handleBurst} />
          <BirthdayCake onGrandCelebrate={handleGrandCelebrate} />
          <LanternRiver />
          <FinaleSection />
        </main>
      </div>
    </ContentProvider>
  );
}
