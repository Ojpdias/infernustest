import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Infernus - RPG Platform',
  description: 'Interactive RPG platform for tactical combat and narrative control',
};

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="game-layout">
      {children}
    </div>
  );
}

