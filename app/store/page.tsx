import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { getStoreProducts } from '@/lib/store'
import { formatNumber } from '@/lib/format'
import { RelatedLinks } from '@/components/related-links'
import { pageMetadata } from '@/lib/seo'

export const revalidate = 60
export const metadata: Metadata = pageMetadata({
  title: 'فروشگاه ماینکرفت',
  description: 'فروشگاه NexvorDev برای پکیج‌ها و رنک‌های حمایتی سرور ماینکرفت. وضعیت خرید آنلاین و محصولات را از این صفحه دنبال کن.',
  path: '/store'
})

type Item = { id: string; name: string; description: string; price: number; currency: string; popular: boolean }

const currencyLabel: Record<string, string> = { COINS: 'سکه', TOMAN: 'تومان' }

// Icon and the in-game prefix gradient of each rank (from the LuckPerms prefixes).
const rankStyle: Record<string, { icon: string; colors: string[] }> = {
  VIP: { icon: '🎖️', colors: ['#B9A9F2', '#A492E9', '#8F7BE0'] },
  'VIP+': { icon: '🎖️', colors: ['#C4B0FF', '#B199FA', '#9E83F5', '#8B6CF0'] },
  MVP: { icon: '🏆', colors: ['#9CB5FF', '#829AF5', '#687EEB'] },
  'MVP+': { icon: '🏆', colors: ['#D6A9FF', '#C18FF7', '#AD76F0', '#985CE8'] },
  ELITE: { icon: '💎', colors: ['#E7B5FF', '#CE90F4', '#B46BEA', '#9E5EE1', '#8752D8'] },
  LEGEND: { icon: '👑', colors: ['#FFF0C2', '#F5DD9F', '#EBCA7C', '#DCB686', '#C9A0BB', '#B58AF1'] },
  NEXVOR: { icon: '⚡', colors: ['#FFFFFF', '#E1D4FF', '#BCA1FF', '#946DEF', '#916AE0', '#FFFFFF'] }
}

async function loadItems(): Promise<Item[]> {
  try {
    const rows = await getStoreProducts()
    if (rows.length) {
      return rows.map((r) => ({
        id: r.id, name: r.name, description: r.description ?? '', price: r.price, currency: r.currency, popular: r.popular
      }))
    }
  } catch (error) {
    console.error('[store] could not load products:', error)
  }
  return []
}

export default async function StorePage() {
  const items = await loadItems()

  return (
    <>
      <PageHeader
        title="فروشگاه"
        path="/store"
        lead="پکیج‌های حمایتی NexvorDev. خرید آنلاین هنوز فعال نشده و به‌زودی از همین صفحه انجام می‌شود."
      />
      <div className="container">
        {items.length === 0 && (
          <p className="empty">پکیج‌ها هنوز اضافه نشده‌اند. به‌زودی رنک‌ها و پکیج‌های حمایتی اینجا نمایش داده می‌شوند.</p>
        )}
        <ul className="tiers">
          {items.map((item) => (
            <li
              key={item.id}
              className="tier tier-rank"
              style={{ '--rank-grad': `linear-gradient(90deg, ${(rankStyle[item.name]?.colors ?? ['#B9A9F2', '#8F7BE0']).join(', ')})`, '--rank-color': (rankStyle[item.name]?.colors ?? ['#B9A9F2'])[Math.floor(((rankStyle[item.name]?.colors.length ?? 1) - 1) / 2)] } as React.CSSProperties}
            >
              {item.popular && <span className="tier-flag">پیشنهادی</span>}
              <h2>{rankStyle[item.name] && <span className="rank-icon" aria-hidden="true">{rankStyle[item.name].icon}</span>} {item.name}</h2>
              <p>{item.description}</p>
              <p className="tier-price">
                {item.price > 0 ? (
                  <>
                    <span className="game-num">{formatNumber(item.price)}</span>
                    <span>{currencyLabel[item.currency] ?? item.currency}</span>
                  </>
                ) : (
                  <span>قیمت به‌زودی</span>
                )}
              </p>
              <button className="btn btn-ghost btn-block" type="button" disabled>به‌زودی</button>
            </li>
          ))}
        </ul>
        {items.length > 0 && (
          <p className="store-note">خرید آنلاین هنوز فعال نیست. برای خرید رنک از بخش <a href="/support">پشتیبانی</a> پیام بده.</p>
        )}
      </div>
      <RelatedLinks keys={['rules', 'support', 'status']} />
    </>
  )
}
