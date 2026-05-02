export default function Logo({ size = 'md', forceWhite = false }) {
  const sizes = {
    sm: { icon: 32, font: 'text-base', pulse: 10 },
    md: { icon: 40, font: 'text-xl', pulse: 12 },
    lg: { icon: 52, font: 'text-2xl', pulse: 15 },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Icon: Shield with pulse line */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="TrustPulse logo icon"
      >
        <defs>
          <linearGradient id="shield-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(120,18%,44%)" />
            <stop offset="100%" stopColor="hsl(130,16%,58%)" />
          </linearGradient>
          <linearGradient id="pulse-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(120,30%,85%)" />
            <stop offset="100%" stopColor="hsl(120,40%,96%)" />
          </linearGradient>
        </defs>

        {/* Shield body */}
        <path
          d="M20 3L5 9v10c0 8.5 6.4 16.4 15 18.4C28.6 35.4 35 27.5 35 19V9L20 3z"
          fill="url(#shield-grad)"
        />

        {/* Inner shield highlight */}
        <path
          d="M20 7L9 12v8c0 6.5 4.9 12.6 11 14.2C26.1 32.6 31 26.5 31 20v-8L20 7z"
          fill="hsl(120,18%,38%)"
          opacity="0.4"
        />

        {/* Pulse / heartbeat line */}
        <polyline
          points="8,20 13,20 15.5,13 18,26 21,15 23.5,23 26,20 32,20"
          stroke="url(#pulse-grad)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span
          className={`font-heading font-extrabold tracking-tight ${s.font}`}
          style={{ color: forceWhite ? '#fff' : 'hsl(120,20%,28%)' }}
        >
          Trust<span style={{ color: forceWhite ? 'rgba(255,255,255,0.7)' : 'hsl(120,18%,52%)' }}>Pulse</span>
        </span>
        <span className="text-[9px] font-medium tracking-widest uppercase" style={{ color: forceWhite ? 'rgba(255,255,255,0.55)' : 'hsl(120,10%,52%)' }}>
          Shop Verified
        </span>
      </div>
    </div>
  );
}