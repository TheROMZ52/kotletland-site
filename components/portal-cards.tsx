import Link from 'next/link'

const portals = [
  { href: '/news', label: 'اخبار', hint: 'تازه‌ترین اتفاق‌ها', icon: '📰' },
  { href: '/status', label: 'وضعیت', hint: 'چند نفر آنلاین‌اند؟', icon: '📡' },
  { href: '/store', label: 'فروشگاه', hint: 'پکیج‌های حمایتی', icon: '💎' },
  { href: '/rules', label: 'قوانین', hint: 'قبل از ورود بخوان', icon: '📜' },
  { href: '/support', label: 'پشتیبانی', hint: 'گیر کردی؟', icon: '🛟' }
]

/** Homepage section portals. */
export function PortalCards() {
  return (
    <nav className="portals" aria-label="بخش‌های سایت">
      {portals.map((p, i) => (
        <Link key={p.href} href={p.href} className="portal" style={{ '--i': i } as React.CSSProperties}>
          <span className="portal-icon" aria-hidden="true">{p.icon}</span>
          <span className="portal-label">{p.label}</span>
          <span className="portal-hint">{p.hint}</span>
        </Link>
      ))}
    </nav>
  )
}
