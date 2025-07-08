import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-infernal flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-12">
          <Image
            src="/infernus_logo_3.png"
            alt="Infernus"
            width={300}
            height={120}
            className="mx-auto opacity-90"
          />
        </div>

        {/* Título */}
        <h1 className="text-4xl font-bold text-infernus-gold mb-4 gothic-title">
          Welcome to Infernus
        </h1>
        <p className="text-xl text-infernus-silver mb-12 max-w-2xl mx-auto">
          An interactive RPG platform for tactical combat and narrative control.
          Choose your role and enter the infernal depths.
        </p>

        {/* Botões de seleção */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
          <Link
            href="/master"
            className="group relative overflow-hidden"
          >
            <div className="infernal-button text-xl px-12 py-6 transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🛡️</span>
                <div>
                  <div className="font-bold">Dungeon Master</div>
                  <div className="text-sm opacity-80">Control the narrative</div>
                </div>
              </div>
            </div>
          </Link>

          <Link
            href="/player"
            className="group relative overflow-hidden"
          >
            <div className="infernal-button text-xl px-12 py-6 transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">⚔️</span>
                <div>
                  <div className="font-bold">Player</div>
                  <div className="text-sm opacity-80">Join the adventure</div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Informações adicionais */}
        <div className="mt-16 text-infernus-silver">
          <p className="text-sm">
            Built for D&D 5e • Real-time multiplayer • Tactical combat
          </p>
        </div>
      </div>
    </div>
  );
}

