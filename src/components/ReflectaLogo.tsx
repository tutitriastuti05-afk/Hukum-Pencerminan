import React from 'react';

interface ReflectaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const ReflectaLogo: React.FC<ReflectaLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const sizeMap = {
    sm: { icon: 32, title: 'text-lg', sub: 'text-[10px]' },
    md: { icon: 42, title: 'text-2xl', sub: 'text-xs' },
    lg: { icon: 56, title: 'text-3xl', sub: 'text-sm' },
    xl: { icon: 84, title: 'text-5xl', sub: 'text-base' },
  };

  const { icon, title, sub } = sizeMap[size];

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* SVG Icon: Light Ray + Mirror Plane + Atomic Orbitals */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={icon}
          height={icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:scale-105"
        >
          <defs>
            <linearGradient id="rayGrad" x1="10" y1="20" x2="50" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <linearGradient id="reflGrad" x1="50" y1="50" x2="90" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FB923C" />
            </linearGradient>
            <linearGradient id="mirrorGrad" x1="50" y1="15" x2="50" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
            <radialGradient id="atomCore" cx="50" cy="50" r="12" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="60%" stopColor="#F97316" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Atomic Orbital Ring 1 */}
          <ellipse
            cx="50"
            cy="50"
            rx="38"
            ry="14"
            transform="rotate(-28 50 50)"
            stroke="#6366F1"
            strokeWidth="2"
            strokeDasharray="4 3"
            opacity="0.75"
          />

          {/* Atomic Orbital Ring 2 */}
          <ellipse
            cx="50"
            cy="50"
            rx="38"
            ry="14"
            transform="rotate(38 50 50)"
            stroke="#0284C7"
            strokeWidth="2"
            strokeDasharray="4 3"
            opacity="0.75"
          />

          {/* Mirror Backing Hatching */}
          <line x1="53" y1="20" x2="59" y2="26" stroke="#94A3B8" strokeWidth="2" />
          <line x1="53" y1="35" x2="59" y2="41" stroke="#94A3B8" strokeWidth="2" />
          <line x1="53" y1="50" x2="59" y2="56" stroke="#94A3B8" strokeWidth="2" />
          <line x1="53" y1="65" x2="59" y2="71" stroke="#94A3B8" strokeWidth="2" />
          <line x1="53" y1="80" x2="59" y2="86" stroke="#94A3B8" strokeWidth="2" />

          {/* Mirror Surface (Vertical line) */}
          <line
            x1="50"
            y1="16"
            x2="50"
            y2="84"
            stroke="url(#mirrorGrad)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Incident Light Beam (Left to center) */}
          <path
            d="M 12 25 L 50 50"
            stroke="url(#rayGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Arrow on Incident Beam */}
          <polygon points="30,33 36,38 31,42" fill="#0284C7" />

          {/* Reflected Light Beam (Center to top-left or back) */}
          <path
            d="M 50 50 L 14 78"
            stroke="url(#reflGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Virtual Ray Behind Mirror (Dashed) */}
          <path
            d="M 50 50 L 86 22"
            stroke="#A855F7"
            strokeWidth="2.5"
            strokeDasharray="4 3"
            opacity="0.85"
          />

          {/* Central Atom / Photonic Spark Core */}
          <circle cx="50" cy="50" r="8" fill="url(#atomCore)" />
          <circle cx="50" cy="50" r="3.5" fill="#FFFFFF" />

          {/* Electron/Photon orbiting dots */}
          <circle cx="24" cy="36" r="3" fill="#0284C7" />
          <circle cx="78" cy="62" r="3" fill="#F59E0B" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <span className={`font-display font-extrabold tracking-wider bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-500 bg-clip-text text-transparent ${title}`}>
            REFLECTA
          </span>
        </div>
        {showSubtitle && (
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className={`font-bold tracking-wider text-sky-600 uppercase ${sub}`}>
              ANTI GRAVITASI
            </span>
            <span className="text-slate-400 text-[10px]">·</span>
            <span className={`text-slate-500 font-medium hidden sm:inline ${sub}`}>
              Lab Fisika Anak
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
