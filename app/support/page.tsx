import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { faq, telegramGroupUrl, telegramUrl, teamspeakAddress } from '@/lib/data'
import { JsonLd } from '@/components/json-ld'
import { RelatedLinks } from '@/components/related-links'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'پشتیبانی سرور',
  description: 'پشتیبانی NexvorDev برای مشکلات اکانت، گزارش بازیکن، وضعیت سرور و سؤال‌های پرتکرار Minecraft.',
  path: '/support'
})

export default function SupportPage() {
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'fa-IR',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a }
    }))
  }

  return (
    <>
      <JsonLd data={faqData} />
      <PageHeader title="پشتیبانی" path="/support" lead="گیر کردی؟ راه درست را انتخاب کن تا سریع‌تر جواب بگیری." />
      <div className="container">
        <ul className="help-grid">
          <li>
            <h2>تیکت خصوصی</h2>
            <p>مشکل اکانت، خرید یا گزارش بازیکن را خصوصی برای تیم بفرست.</p>
            <Link className="btn btn-primary" href="/account">ثبت تیکت</Link>
          </li>
          <li>
            <h2>تلگرام و تیم‌اسپیک</h2>
            <p>با بقیه‌ی بازیکن‌ها و استاف چت کن. کانال: <span className="ltr">@NexvorDeveloper</span> | گروه: <span className="ltr">@NexvorDeveloper_Gap</span> | تیم‌اسپیک: <span className="ltr">{teamspeakAddress}</span></p>
            <a className="btn btn-ghost" href={telegramGroupUrl} target="_blank" rel="noopener noreferrer">ورود به گروه</a> <a className="btn btn-ghost" href={telegramUrl} target="_blank" rel="noopener noreferrer">کانال تلگرام</a>
          </li>
          <li>
            <h2>وضعیت سرور</h2>
            <p>قبل از تیکت، ببین سرور آنلاین است یا نه.</p>
            <Link className="btn btn-ghost" href="/status">بررسی وضعیت</Link>
          </li>
        </ul>

        <h2 className="faq-title">سؤال‌های پرتکرار</h2>
        <div className="faq">
          {faq.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
      <RelatedLinks keys={['rules', 'store', 'status']} />
    </>
  )
}
