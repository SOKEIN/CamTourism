import React from 'react'

interface LogoProps {
  variant?: 'navbar' | 'footer' | 'symbol' | 'hero'
  isDark?: boolean
  className?: string
}

export function CamTourismLogo({ variant = 'navbar', isDark = false, className = '' }: LogoProps) {
  // Brand colors from design palette - optimized for both dark hero & light navbar
  const primaryColor = isDark ? '#FFFFFF' : '#0F766E'
  const accentGold = '#F59E0B'
  const emblemFill = isDark ? '#F59E0B' : '#0F766E'
  const mutedColor = isDark ? 'rgba(255, 255, 255, 0.8)' : '#64748B'

  // Dedicated SVG Symbol representing Logo Option 1: Classic & Professional
  const LogoSymbol = ({ size = 44 }: { size?: number }) => (
    <svg
      width={size}
      height={(size * 42) / 54}
      viewBox="0 0 108 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform group-hover:scale-105"
    >
      <defs>
        {/* Golden Sun Radiant Gradient */}
        <radialGradient id={`sunGlow-${isDark ? 'dark' : 'light'}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="60%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </radialGradient>
        {/* Dual Wave Gradients */}
        <linearGradient id={`tealWave-${isDark ? 'dark' : 'light'}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={isDark ? '#2DD4BF' : '#0F766E'} />
          <stop offset="50%" stopColor={isDark ? '#14B8A6' : '#0D9488'} />
          <stop offset="100%" stopColor={isDark ? '#5EEAD4' : '#115E59'} />
        </linearGradient>
        <linearGradient id={`goldWave-${isDark ? 'dark' : 'light'}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
      </defs>

      {/* 1. Golden Rising Sun */}
      <circle cx="54" cy="24" r="16" fill={`url(#sunGlow-${isDark ? 'dark' : 'light'})`} />

      {/* 2. Iconic 5 Towers of Angkor Wat Silhouette */}
      <g fill={emblemFill}>
        {/* Palm tree silhouettes flanking left */}
        <path
          d="M14 43c-3-2-7-2-9 1 3 0 6 1 8 3-4-1-8 1-9 4 3 0 6 0 8-1-2 2-3 5-3 8 1-3 3-5 5-6l1 12h2l-1-12c2 1 4 3 5 6-1-3-2-6-3-8 2 1 5 1 8 1-1-3-5-5-9-4 2-2 5-3 8-3-2-3-6-3-9-1z"
          opacity="0.85"
        />

        {/* Outer Left Tower */}
        <path d="M26 48l1-5h4l1-5h2l1-4 1-5h1l1 5 1 4h2l1 5h4l1 5z" />

        {/* Mid Left Tower */}
        <path d="M37 46l1-7h4l1-6h2l1-6 1-7h1l1 7 1 6h2l1 6h4l1 7z" />

        {/* Central Tallest Pinnacle Tower */}
        <path d="M48 44l1-9h4l1-8h2l1-8 1-10h2l1 10 1 8h2l1 8h4l1 9z" />

        {/* Mid Right Tower */}
        <path d="M63 46l1-7h4l1-6h2l1-6 1-7h1l1 7 1 6h2l1 6h4l1 7z" />

        {/* Outer Right Tower */}
        <path d="M74 48l1-5h4l1-5h2l1-4 1-5h1l1 5 1 4h2l1 5h4l1 5z" />

        {/* Palm tree silhouettes flanking right */}
        <path
          d="M94 43c3-2 7-2 9 1-3 0-6 1-8 3 4-1 8 1 9 4-3 0-6 0-8-1 2 2 3 5 3 8-1-3-3-5-5-6l-1 12h-2l1-12c-2 1-4 3-5 6 1-3 2-6 3-8-2 1-5 1-8 1 1-3 5-5 9-4-2-2-5-3-8-3 2-3 6-3 9-1z"
          opacity="0.85"
        />

        {/* Lower Gallery & Tiered Stone Base */}
        <rect x="22" y="47" width="64" height="6" rx="1" />
        <rect x="18" y="52" width="72" height="5" rx="1" />
        <rect x="14" y="56" width="80" height="4" rx="1" />

        {/* Gallery pillar slit cutouts */}
        <g fill={isDark ? '#0F172A' : '#FFFFFF'} opacity={isDark ? '0.7' : '0.4'}>
          <rect x="26" y="49" width="1.5" height="3" />
          <rect x="30" y="49" width="1.5" height="3" />
          <rect x="34" y="49" width="1.5" height="3" />
          <rect x="42" y="49" width="1.5" height="3" />
          <rect x="46" y="49" width="1.5" height="3" />
          <rect x="52" y="49" width="1.5" height="3" />
          <rect x="56" y="49" width="1.5" height="3" />
          <rect x="62" y="49" width="1.5" height="3" />
          <rect x="66" y="49" width="1.5" height="3" />
          <rect x="74" y="49" width="1.5" height="3" />
          <rect x="78" y="49" width="1.5" height="3" />
          <rect x="82" y="49" width="1.5" height="3" />
        </g>
      </g>

      {/* 3. Water Reflection Ripples */}
      <g stroke={emblemFill} strokeWidth="1" strokeLinecap="round" opacity="0.4">
        <line x1="28" y1="62" x2="80" y2="62" />
        <line x1="36" y1="64.5" x2="72" y2="64.5" />
        <line x1="44" y1="67" x2="64" y2="67" />
      </g>

      {/* 4. Sweeping Dynamic Wave Swooshes (Teal & Gold) */}
      <path
        d="M6 68C18 61 34 60 52 65C68 69 84 70 102 62C92 73 70 77 50 73C34 70 20 72 6 68Z"
        fill={`url(#tealWave-${isDark ? 'dark' : 'light'})`}
      />
      <path
        d="M20 72C34 68 48 69 66 73C78 75 90 75 104 69C94 77 78 81 62 78C46 75 32 75 20 72Z"
        fill={`url(#goldWave-${isDark ? 'dark' : 'light'})`}
      />
    </svg>
  )

  // Golden Lotus divider icon
  const LotusIcon = () => (
    <svg width="14" height="12" viewBox="0 0 24 20" fill="none" className="inline-block shrink-0">
      <path d="M12 2C10 7 7 11 2 13C6 15 10 14 12 18C14 14 18 15 22 13C17 11 14 7 12 2Z" fill="#F59E0B" />
      <circle cx="12" cy="11" r="2" fill="#D97706" />
    </svg>
  )

  // Symbol variant (app icon / favicon / mobile)
  if (variant === 'symbol') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <LogoSymbol size={40} />
      </div>
    )
  }

  // Footer / Hero full badge variant with taglines & Khmer text
  if (variant === 'footer' || variant === 'hero') {
    return (
      <div className={`flex flex-col items-start ${className}`}>
        <div className="flex items-center gap-3">
          <LogoSymbol size={48} />
          <div>
            <div className="flex items-baseline tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <span className="text-2xl font-black tracking-tight" style={{ color: primaryColor }}>
                Cam
              </span>
              <span className="text-2xl font-black tracking-tight" style={{ color: accentGold }}>
                Tourism
              </span>
            </div>
            <div
              className="text-[10px] font-semibold tracking-wider uppercase -mt-0.5"
              style={{ color: mutedColor, fontFamily: 'Poppins, sans-serif', letterSpacing: '0.12em' }}
            >
              Explore the Kingdom of Wonder
            </div>
          </div>
        </div>

        {/* Tagline with Lotus and Khmer Slogan */}
        <div
          className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/20 text-xs"
          style={{ color: mutedColor }}
        >
          <LotusIcon />
          <span className="font-semibold text-[11px]" style={{ fontFamily: 'Noto Sans Khmer, sans-serif' }}>
            ស្វែងរក • ស្វែងយល់ • ទស្សនាកម្ពុជា
          </span>
        </div>
      </div>
    )
  }

  // Default Navbar variant: horizontal, clean, responsive, high contrast
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoSymbol size={44} />
      <div className="flex flex-col">
        <div className="flex items-baseline leading-none" style={{ fontFamily: 'Poppins, sans-serif' }}>
          <span
            className="text-xl sm:text-2xl font-black tracking-tight"
            style={{
              color: primaryColor,
              textShadow: isDark ? '0 2px 10px rgba(0,0,0,0.5)' : 'none',
            }}
          >
            Cam
          </span>
          <span
            className="text-xl sm:text-2xl font-black tracking-tight"
            style={{
              color: accentGold,
              textShadow: isDark ? '0 2px 10px rgba(0,0,0,0.5)' : 'none',
            }}
          >
            Tourism
          </span>
        </div>
        <div
          className="text-[9px] font-bold tracking-wider uppercase mt-1 hidden sm:block leading-none"
          style={{
            color: isDark ? '#FDE68A' : mutedColor,
            fontFamily: 'Poppins, sans-serif',
            letterSpacing: '0.1em',
          }}
        >
          Kingdom of Wonder
        </div>
      </div>
    </div>
  )
}

export default CamTourismLogo
