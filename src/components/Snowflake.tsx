'use client'

export function SnowflakeIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* vertical */}
      <line x1="32" y1="4" x2="32" y2="60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* horizontal */}
      <line x1="4" y1="32" x2="60" y2="32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* diagonal 1 */}
      <line x1="11" y1="11" x2="53" y2="53" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* diagonal 2 */}
      <line x1="53" y1="11" x2="11" y2="53" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* branches top */}
      <line x1="32" y1="12" x2="26" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="32" y1="12" x2="38" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* branches bottom */}
      <line x1="32" y1="52" x2="26" y2="46" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="32" y1="52" x2="38" y2="46" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* branches left */}
      <line x1="12" y1="32" x2="18" y2="26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="32" x2="18" y2="38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* branches right */}
      <line x1="52" y1="32" x2="46" y2="26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="52" y1="32" x2="46" y2="38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* center */}
      <circle cx="32" cy="32" r="4" fill="currentColor" />
    </svg>
  )
}
