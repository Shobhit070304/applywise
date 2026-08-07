'use client';

export default function JitterBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Ambient Blurry Gradient Nodes */}
      <div
        className="absolute -top-[20%] left-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-amber-600/20 via-orange-500/10 to-transparent blur-[140px] animate-pulse-glow"
      />
      <div
        className="absolute top-[35%] -right-[10%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-indigo-600/15 via-purple-600/10 to-transparent blur-[150px] animate-pulse-glow"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="absolute -bottom-[15%] left-[30%] w-[650px] h-[650px] rounded-full bg-gradient-to-t from-zinc-800/30 via-amber-900/10 to-transparent blur-[160px] animate-pulse-glow"
        style={{ animationDelay: '4s' }}
      />

      {/* SVG Grain Noise & Jitter Overlay */}
      <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay animate-jitter">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Subtle Grid Line Texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
}
