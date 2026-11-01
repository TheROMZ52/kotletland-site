<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:050505,35:171717,70:303030,100:050505&height=190&section=header&text=KotletLand%20Website&fontSize=54&fontColor=ffffff&fontAlignY=38&desc=THE%20WEB%20HUB%20FOR%20THE%20NETWORK&descAlignY=62&descSize=13" width="100%" />

<br/>

<img src="https://img.shields.io/badge/NEXT.JS-111111?style=for-the-badge&logo=nextdotjs&logoColor=white" /> <img src="https://img.shields.io/badge/MYSQL-111111?style=for-the-badge&logo=mysql&logoColor=white" /> <img src="https://img.shields.io/badge/VERCEL-111111?style=for-the-badge&logo=vercel&logoColor=white" /> <img src="https://img.shields.io/github/stars/TheROMZ52/kotletland-site?style=for-the-badge&color=111111&labelColor=050505&logo=github" /> <img src="https://img.shields.io/github/last-commit/TheROMZ52/kotletland-site?style=for-the-badge&color=111111&labelColor=050505" />

<br/>

## کتلت‌لند — وب‌سایت

[فارسی](README.md) · [English](README.en.md)

### اینجا مرکز فرماندهی کتلت‌لنده؛ خبرها، آمار و حساب بازیکن‌ها یک‌جا جمع شده‌اند. (بوی کتلت هنوز از دیتابیس پشتیبانی نمی‌شه.)

<img src="https://skillicons.dev/icons?i=nextjs,react,ts,mysql,vercel&theme=dark" />

</div>

---

سایت رسمی سرور ماینکرفت کتلت‌لند: وضعیت زنده‌ی سرور، اخبار، قوانین، فروشگاه، اکانت بازیکن و پشتیبانی.
ساخته‌شده با Next.js (App Router) و یک دیتابیس MySQL مشترک بین سایت و سرور Minecraft.

---

## 01 / اجرا

```bash
npm install
cp .env.example .env.local
npm run dev
```

برای بررسی پروژه:

```bash
npm run typecheck
npm run build
```

---

## 02 / دیتابیس

قرارداد کامل دیتابیس در `docs/mysql-schema.sql` قرار دارد. فایل SQL نام دیتابیس را hard-code نمی‌کند و باید روی همان دیتابیسی اجرا شود که `DATABASE_URL` به آن اشاره می‌کند. خود سایت هم هنگام اولین دسترسی، جدول‌های موردنیاز را در صورت نبودن ایجاد و چند ساختار قدیمی شناخته‌شده را همگام می‌کند.

جداول اصلی سایت:

- `users`: اکانت‌های سایت، نقش و وضعیت مسدودی
- `profiles`: پروفایل و اتصال Minecraft
- `players`: نمای کلی بازیکنان و اطلاعات LuckPerms
- `minecraft_servers`: فهرست سرورهای Minecraft
- `player_server_stats`: آمار هر بازیکن به‌صورت جداگانه برای هر سرور
- `minecraft_link_codes`: کدهای موقت اتصال حساب سایت و Minecraft
- `minecraft_server_registrations`: ثبت و احراز سرورهای نصب‌شده
- `news`: اخبار
- `support_tickets` و `ticket_messages`: پشتیبانی و پیام‌های تیکت
- `notifications`: اعلان‌های حساب
- `admin_audit_logs`: لاگ عملیات مدیریتی
- `store_products` و `store_purchases`: فروشگاه و سابقه خرید
- `sessions`: نشست‌های ورود

سابقه مجازات‌ها از جدول‌های خود LiteBans خوانده می‌شود (`litebans_bans`, `litebans_mutes`, `litebans_warnings`, `litebans_kicks`) و به جدول جداگانه‌ای در دیتابیس سایت کپی نمی‌شود.

سایت و افزونه‌ی `kotletland-sync` باید از همان MySQL مشترک استفاده کنند.

---

## 03 / اتصال Minecraft

اتصال مستقیم نام بازیکن به اکانت سایت برای اطلاعات خصوصی کافی نیست. برای فعال کردن سابقه‌ی خرید و اطلاعات حساب، اتصال باید با UUID واقعی بازیکن و یک جریان تأیید داخل بازی انجام شود.

---

<details>
<summary><b>04 / سلامت دیتابیس</b></summary>
<br/>

برای بررسی اینکه MySQL برگشته و سایت می‌تواند به آن وصل شود:

```text
GET /api/health/db
```

در حالت سالم پاسخ `200` و در صورت در دسترس نبودن دیتابیس پاسخ `503` برمی‌گردد.

</details>

---

## 05 / استقرار روی Vercel

در Environment Variables مقدار `DATABASE_URL` را قرار بده:

`mysql://USERNAME:PASSWORD@HOST:3306/DATABASE_NAME`

برای دیتابیس واقعی از رمز قوی و اتصال TLS استفاده کن.

---

<details>
<summary><b>06 / دامنه و سئو</b></summary>
<br/>

- آدرس سایت از متغیر `NEXT_PUBLIC_SITE_URL` خوانده می‌شود (`lib/site.ts`). اگر خالی باشد، آدرس `*.vercel.app` استفاده می‌شود.
- canonical، `sitemap.xml`، `robots.txt`، داده‌ی ساخت‌یافته (JSON-LD)، `llms.txt` و `llms-full.txt` همه از همین مقدار ساخته می‌شوند.
- برای افزودن صفحه‌ی عمومی جدید از `pageMetadata()` در `lib/seo.ts` استفاده کن و `<PageHeader path="/مسیر" />` را بده تا breadcrumb هم بیاید؛ مسیر را به `app/sitemap.ts` هم اضافه کن.

</details>

---

<div align="center">

<a href="https://github.com/TheROMZ52?tab=repositories"><img src="https://img.shields.io/badge/MORE%20PROJECTS-111111?style=for-the-badge&logo=github&logoColor=white" /></a>

<br/><br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:050505,50:202020,100:050505&height=110&section=footer" width="100%" />

<sub>© TheROMZ52 • ساخته‌شده با کد، کنجکاوی و تعداد مشکوکی تب باز.</sub>

</div>
