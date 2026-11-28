import type { ReactNode } from 'react'

type Emblem = { colors: string[]; art: (fill: string, accent: string) => ReactNode }

const star = (cx: number, cy: number, r: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 === 0 ? r : r * 0.45
    const angle = (Math.PI / 5) * i - Math.PI / 2
    return `${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`
  }).join(' ')

const plusBadge = (accent: string) => (
  <g>
    <circle cx="72" cy="72" r="14" fill="#12091f" stroke={accent} strokeWidth="3" />
    <path d="M72 65v14M65 72h14" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
  </g>
)

const shield = (fill: string, accent: string, plus: boolean) => (
  <>
    <path d="M48 6 82 18v28c0 22-16 36-34 44C30 82 14 68 14 46V18z" fill={fill} stroke={accent} strokeWidth="3" strokeLinejoin="round" />
    <path d="M48 14 74 23v23c0 17-12 29-26 36-14-7-26-19-26-36V23z" fill="#12091f" opacity=".35" />
    <polygon points={star(48, 46, 22)} fill="#fff" opacity=".92" />
    {plus && plusBadge(accent)}
  </>
)

const trophy = (fill: string, accent: string, plus: boolean) => (
  <>
    <path d="M26 16h44v24c0 14-10 24-22 24S26 54 26 40z" fill={fill} stroke={accent} strokeWidth="3" strokeLinejoin="round" />
    <path d="M26 24H12c0 14 6 22 16 24M70 24h14c0 14-6 22-16 24" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
    <path d="M42 62h12v14H42z" fill={fill} stroke={accent} strokeWidth="3" />
    <path d="M30 78h36l4 12H26z" fill={fill} stroke={accent} strokeWidth="3" strokeLinejoin="round" />
    <polygon points={star(48, 38, 12)} fill="#fff" opacity=".9" />
    {plus && plusBadge(accent)}
  </>
)

const emblems: Record<string, Emblem> = {
  VIP: { colors: ['#B9A9F2', '#A492E9', '#8F7BE0'], art: (f, a) => shield(f, a, false) },
  'VIP+': { colors: ['#C4B0FF', '#B199FA', '#9E83F5', '#8B6CF0'], art: (f, a) => shield(f, a, true) },
  MVP: { colors: ['#9CB5FF', '#829AF5', '#687EEB'], art: (f, a) => trophy(f, a, false) },
  'MVP+': { colors: ['#D6A9FF', '#C18FF7', '#AD76F0', '#985CE8'], art: (f, a) => trophy(f, a, true) },
  ELITE: {
    colors: ['#E7B5FF', '#CE90F4', '#B46BEA', '#9E5EE1', '#8752D8'],
    art: (f, a) => (
      <>
        <path d="M26 14h44l18 24-40 50L8 38z" fill={f} stroke={a} strokeWidth="3" strokeLinejoin="round" />
        <path d="M8 38h80M36 38l12 50 12-50M26 14l10 24M70 14 60 38M48 14l-12 24M48 14l12 24" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="2" strokeLinejoin="round" />
        <path d="M36 38 48 14l12 24z" fill="#fff" opacity=".35" />
      </>
    )
  },
  LEGEND: {
    colors: ['#FFF0C2', '#F5DD9F', '#EBCA7C', '#DCB686', '#C9A0BB', '#B58AF1'],
    art: (f, a) => (
      <>
        <path d="M10 70 6 26l24 20 18-30 18 30 24-20-4 44z" fill={f} stroke={a} strokeWidth="3" strokeLinejoin="round" />
        <rect x="10" y="72" width="76" height="12" rx="3" fill={f} stroke={a} strokeWidth="3" />
        <circle cx="48" cy="52" r="6" fill="#7c3aed" stroke="#fff" strokeWidth="2" />
        <circle cx="28" cy="58" r="4" fill="#c084fc" stroke="#fff" strokeWidth="1.5" />
        <circle cx="68" cy="58" r="4" fill="#c084fc" stroke="#fff" strokeWidth="1.5" />
        <circle cx="6" cy="22" r="4" fill="#fff" />
        <circle cx="48" cy="12" r="4" fill="#fff" />
        <circle cx="90" cy="22" r="4" fill="#fff" />
      </>
    )
  },
  NEXVOR: {
    colors: ['#FFFFFF', '#E1D4FF', '#BCA1FF', '#946DEF', '#916AE0', '#FFFFFF'],
    art: (f, a) => (
      <>
        <polygon points="48,4 86,26 86,70 48,92 10,70 10,26" fill="#12091f" stroke={a} strokeWidth="3.5" strokeLinejoin="round" />
        <polygon points="48,14 77,31 77,65 48,82 19,65 19,31" fill={f} opacity=".22" />
        <polygon points="54,16 30,52 46,52 40,80 66,42 50,42" fill={f} stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
        <ellipse cx="48" cy="48" rx="44" ry="13" fill="none" stroke={a} strokeWidth="2" strokeOpacity=".8" transform="rotate(-28 48 48)" />
      </>
    )
  }
}

export function RankEmblem({ name }: { name: string }) {
  const emblem = emblems[name]
  if (!emblem) return null
  const id = `rank-${name.replace('+', 'plus').toLowerCase()}`
  const accent = emblem.colors[Math.floor((emblem.colors.length - 1) / 2)]
  const stops = emblem.colors.map((color, index) => <stop key={color + index} offset={`${(index / (emblem.colors.length - 1)) * 100}%`} stopColor={color} />)
  return (
    <svg className="rank-emblem" viewBox="0 0 96 96" role="img" aria-label={`نشان رنک ${name}`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">{stops}</linearGradient>
      </defs>
      {emblem.art(`url(#${id})`, accent)}
    </svg>
  )
}
