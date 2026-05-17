// Placeholder for nav/tab icon slots until proper icon assets are ready
export function IconBox({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: 'inline-block', flexShrink: 0, opacity: 0.75 }}
    >
      <rect x="1" y="1" width={size - 2} height={size - 2} rx="2"
        fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="1" y1="1" x2={size - 1} y2={size - 1}
        stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
