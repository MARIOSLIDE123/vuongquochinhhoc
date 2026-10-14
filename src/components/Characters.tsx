import React from 'react';

interface CharacterProps {
  size?: 'sm' | 'md' | 'lg';
  mood?: 'happy' | 'thinking' | 'celebrating' | 'cheering';
  className?: string;
}

/**
 * Bé Vuông: Cheerful energetic square buddy
 */
export const BeVuong: React.FC<CharacterProps> = ({ size = 'md', mood = 'happy', className = '' }) => {
  const dim = size === 'sm' ? 'w-12 h-12' : size === 'lg' ? 'w-24 h-24' : 'w-16 h-16';

  return (
    <div className={`relative inline-flex items-center justify-center ${dim} ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        {/* Shadow */}
        <ellipse cx="50" cy="92" rx="36" ry="6" fill="#000000" opacity="0.12" />

        {/* Square Body with rounded corners */}
        <rect
          x="15"
          y="18"
          width="70"
          height="70"
          rx="16"
          fill="#fbbf24"
          stroke="#d97706"
          strokeWidth="4"
        />

        {/* Shiny Highlight */}
        <path
          d="M 22 26 Q 50 20 78 26"
          stroke="#fef08a"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cute Baseball Cap */}
        <path d="M 28 20 C 28 10, 72 10, 72 20 Z" fill="#ef4444" />
        <ellipse cx="74" cy="22" rx="14" ry="4" fill="#dc2626" />
        <circle cx="50" cy="11" r="3" fill="#ffffff" />

        {/* Eyes */}
        {mood === 'celebrating' ? (
          <>
            <path d="M 32 48 Q 40 40 48 48" stroke="#78350f" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M 52 48 Q 60 40 68 48" stroke="#78350f" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="38" cy="46" r="5" fill="#78350f" />
            <circle cx="36" cy="44" r="2" fill="#ffffff" />
            <circle cx="62" cy="46" r="5" fill="#78350f" />
            <circle cx="60" cy="44" r="2" fill="#ffffff" />
          </>
        )}

        {/* Rosy Cheeks */}
        <circle cx="28" cy="54" r="5" fill="#f87171" opacity="0.6" />
        <circle cx="72" cy="54" r="5" fill="#f87171" opacity="0.6" />

        {/* Mouth */}
        {mood === 'cheering' || mood === 'celebrating' ? (
          <path d="M 40 56 Q 50 72 60 56 Z" fill="#b91c1c" stroke="#78350f" strokeWidth="2" />
        ) : mood === 'thinking' ? (
          <circle cx="50" cy="58" r="4" fill="#78350f" />
        ) : (
          <path d="M 40 56 Q 50 68 60 56" stroke="#78350f" strokeWidth="3" fill="none" strokeLinecap="round" />
        )}

        {/* Small Hands */}
        <circle cx="12" cy="52" r="6" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
        <circle cx="88" cy="52" r="6" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
      </svg>
    </div>
  );
};

/**
 * Bé Chữ Nhật: Smart and clever rectangle buddy with glasses
 */
export const BeChuNhat: React.FC<CharacterProps> = ({ size = 'md', mood = 'happy', className = '' }) => {
  const dim = size === 'sm' ? 'w-14 h-11' : size === 'lg' ? 'w-28 h-20' : 'w-20 h-14';

  return (
    <div className={`relative inline-flex items-center justify-center ${dim} ${className}`}>
      <svg viewBox="0 0 120 80" className="w-full h-full drop-shadow-md">
        {/* Shadow */}
        <ellipse cx="60" cy="74" rx="46" ry="5" fill="#000000" opacity="0.12" />

        {/* Rectangle Body */}
        <rect
          x="10"
          y="12"
          width="100"
          height="58"
          rx="14"
          fill="#38bdf8"
          stroke="#0284c7"
          strokeWidth="3.5"
        />

        {/* Highlight */}
        <path
          d="M 18 18 Q 60 14 102 18"
          stroke="#e0f2fe"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Round Smart Glasses */}
        <circle cx="45" cy="38" r="12" fill="#ffffff" opacity="0.9" stroke="#0f172a" strokeWidth="2.5" />
        <circle cx="75" cy="38" r="12" fill="#ffffff" opacity="0.9" stroke="#0f172a" strokeWidth="2.5" />
        <line x1="57" y1="38" x2="63" y2="38" stroke="#0f172a" strokeWidth="2.5" />

        {/* Eyes behind glasses */}
        <circle cx="46" cy="38" r="4.5" fill="#0284c7" />
        <circle cx="44" cy="36" r="1.5" fill="#ffffff" />
        <circle cx="76" cy="38" r="4.5" fill="#0284c7" />
        <circle cx="74" cy="36" r="1.5" fill="#ffffff" />

        {/* Smile */}
        <path d="M 52 56 Q 60 64 68 56" stroke="#0369a1" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Cute Bowtie */}
        <polygon points="54,68 66,68 60,65" fill="#f43f5e" />
        <polygon points="54,68 66,68 60,71" fill="#f43f5e" />
        <circle cx="60" cy="68" r="2.5" fill="#e11d48" />
      </svg>
    </div>
  );
};

/**
 * Thỏ Toán Học: The wise & friendly bunny guide
 */
export const ThoToanHoc: React.FC<CharacterProps> = ({ size = 'md', className = '' }) => {
  const dim = size === 'sm' ? 'w-12 h-14' : size === 'lg' ? 'w-24 h-28' : 'w-16 h-20';

  return (
    <div className={`relative inline-flex items-center justify-center ${dim} ${className}`}>
      <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md">
        {/* Shadow */}
        <ellipse cx="50" cy="112" rx="30" ry="5" fill="#000000" opacity="0.12" />

        {/* Long Bunny Ears */}
        <ellipse cx="38" cy="32" rx="10" ry="26" fill="#ffffff" stroke="#e2e8f0" strokeWidth="3" transform="rotate(-12 38 32)" />
        <ellipse cx="38" cy="32" rx="6" ry="18" fill="#fbcfe8" transform="rotate(-12 38 32)" />

        <ellipse cx="62" cy="32" rx="10" ry="26" fill="#ffffff" stroke="#e2e8f0" strokeWidth="3" transform="rotate(12 62 32)" />
        <ellipse cx="62" cy="32" rx="6" ry="18" fill="#fbcfe8" transform="rotate(12 62 32)" />

        {/* Bunny Head */}
        <ellipse cx="50" cy="72" rx="34" ry="30" fill="#ffffff" stroke="#e2e8f0" strokeWidth="3" />

        {/* Eyes */}
        <ellipse cx="38" cy="68" rx="4" ry="6" fill="#1e293b" />
        <circle cx="36" cy="66" r="1.8" fill="#ffffff" />
        <ellipse cx="62" cy="68" rx="4" ry="6" fill="#1e293b" />
        <circle cx="60" cy="66" r="1.8" fill="#ffffff" />

        {/* Pink Nose */}
        <polygon points="47,76 53,76 50,80" fill="#f43f5e" />

        {/* Cute Bunny Whiskers */}
        <line x1="20" y1="74" x2="32" y2="76" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="20" y1="80" x2="32" y2="80" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="68" y1="76" x2="80" y2="74" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="68" y1="80" x2="80" y2="80" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />

        {/* Cheerful Mouth */}
        <path d="M 45 80 Q 50 85 55 80" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Pink Cheeks */}
        <circle cx="28" cy="78" r="5" fill="#fbcfe8" opacity="0.8" />
        <circle cx="72" cy="78" r="5" fill="#fbcfe8" opacity="0.8" />

        {/* Star Wand in Hand */}
        <line x1="75" y1="90" x2="88" y2="60" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
        <polygon points="88,52 92,60 100,60 94,65 96,73 88,68 81,73 83,65 77,60 85,60" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
      </svg>
    </div>
  );
};
