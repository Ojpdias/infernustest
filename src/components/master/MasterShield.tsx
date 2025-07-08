import React from 'react';
import Image from 'next/image';

interface MasterShieldProps {
  className?: string;
}

const MasterShield: React.FC<MasterShieldProps> = ({ className = '' }) => {
  return (
    <div className={`master-shield relative ${className}`}>
      {/* Escudo principal */}
      <div className="w-full h-full flex items-center justify-center relative">
        {/* Logo Infernus no centro do escudo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/infernus_logo_3.png"
            alt="Infernus Logo"
            width={120}
            height={120}
            className="opacity-80"
          />
        </div>
        
        {/* Ornamentos do escudo */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
          <div className="w-4 h-4 bg-infernus-gold rounded-full shadow-gold"></div>
        </div>
        
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-2 bg-infernus-gold rounded shadow-gold"></div>
        </div>
        
        {/* Detalhes laterais */}
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
          <div className="w-2 h-8 bg-infernus-gold rounded shadow-gold"></div>
        </div>
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <div className="w-2 h-8 bg-infernus-gold rounded shadow-gold"></div>
        </div>
      </div>
      
      {/* Efeito de brilho */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-infernus-gold/10 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default MasterShield;

