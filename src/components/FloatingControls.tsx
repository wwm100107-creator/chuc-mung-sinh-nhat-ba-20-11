interface FloatingControlsProps {
  globalProgress: number;
}

export function FloatingControls({ globalProgress }: FloatingControlsProps) {
  const progressPct = Math.round(globalProgress * 1000) / 10;

  return (
    <div className="scroll-ribbon-track" aria-hidden="true">
      <div className="scroll-ribbon-fill" style={{ width: `${progressPct}%` }} />
    </div>
  );
}
