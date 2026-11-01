<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:050505,35:171717,70:303030,100:050505&height=190&section=header&text=KotletLand%20Website&fontSize=54&fontColor=ffffff&fontAlignY=38&desc=THE%20WEB%20HUB%20FOR%20THE%20NETWORK&descAlignY=62&descSize=13" width="100%" />

<br/>

<img src="https://img.shields.io/badge/NEXT.JS-111111?style=for-the-badge&logo=nextdotjs&logoColor=white" /> <img src="https://img.shields.io/badge/MYSQL-111111?style=for-the-badge&logo=mysql&logoColor=white" /> <img src="https://img.shields.io/badge/VERCEL-111111?style=for-the-badge&logo=vercel&logoColor=white" /> <img src="https://img.shields.io/github/stars/TheROMZ52/kotletland-site?style=for-the-badge&color=111111&labelColor=050505&logo=github" /> <img src="https://img.shields.io/github/last-commit/TheROMZ52/kotletland-site?style=for-the-badge&color=111111&labelColor=050505" />

<br/>

### The KotletLand hub: live server info, news, accounts, and support — no actual کتلت delivery (yet).

<img src="https://skillicons.dev/icons?i=nextjs,react,ts,mysql,vercel&theme=dark" />

</div>

---

The official website for the KotletLand Minecraft server. It brings together live server status, news, rules, the store, player accounts, and support.

Built with Next.js (App Router) and a MySQL database shared by the website and the Minecraft server.

---

## 01 / RUN LOCALLY

```bash
npm install
cp .env.example .env.local
npm run dev
```

To validate the project:

```bash
npm run typecheck
npm run build
```

---

## 02 / DATABASE

The complete database contract is documented in [docs/mysql-schema.sql](docs/mysql-schema.sql). The SQL file does not hard-code a database name; run it against the database referenced by `DATABASE_URL`.

On first access, the website creates missing tables and synchronizes a few recognized legacy structures.

Main website tables:

- `users`: website accounts, roles, and ban status
- `profiles`: profiles and Minecraft account links
- `players`: player overview and LuckPerms information
- `minecraft_servers`: registered Minecraft servers
- `player_server_stats`: per-player statistics, separated by server
- `minecraft_link_codes`: temporary codes for linking website and Minecraft accounts
- `minecraft_server_registrations`: registration and verification of installed servers
- `news`: news posts
- `support_tickets` and `ticket_messages`: support tickets and messages
- `notifications`: account notifications
- `admin_audit_logs`: administrative action logs
- `store_products` and `store_purchases`: store catalog and purchase history
- `sessions`: login sessions

Punishment history is read directly from LiteBans tables (`litebans_bans`, `litebans_mutes`, `litebans_warnings`, and `litebans_kicks`). It is not copied into a separate website table.

The website and the `kotletland-sync` plugin must use the same shared MySQL database.

---

## 03 / MINECRAFT ACCOUNT LINKING

A player's name alone is not sufficient to access private account information. To enable purchase history and account details, linking must use the player's real UUID and an in-game verification flow.

---

<details>
<summary><b>04 / DATABASE HEALTH</b></summary>
<br/>

To check whether MySQL is reachable and the website can connect to it, use:

```http
GET /api/health/db
```

A healthy database returns HTTP `200`. If the database is unavailable, the endpoint returns `503`.

</details>

---

## 05 / DEPLOY TO VERCEL

Set `DATABASE_URL` in the project's Environment Variables:

```text
mysql://USERNAME:PASSWORD@HOST:3306/DATABASE_NAME
```

For a production database, use a strong password and a TLS-enabled connection.

---

<details>
<summary><b>06 / DOMAIN AND SEO</b></summary>
<br/>

- The website URL is read from `NEXT_PUBLIC_SITE_URL` in `lib/site.ts`. When empty, the `*.vercel.app` URL is used.
- The canonical URL, `sitemap.xml`, `robots.txt`, structured data (JSON-LD), `llms.txt`, and `llms-full.txt` are generated from this value.
- For a new public page, use `pageMetadata()` from `lib/seo.ts` and add `<PageHeader path="/path" />` to include breadcrumbs. Also add the route to `app/sitemap.ts`.

</details>

---

<div align="center">

<a href="https://github.com/TheROMZ52?tab=repositories"><img src="https://img.shields.io/badge/MORE%20PROJECTS-111111?style=for-the-badge&logo=github&logoColor=white" /></a>

<br/><br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:050505,50:202020,100:050505&height=110&section=footer" width="100%" />

<sub>© TheROMZ52 • Built with code, curiosity, and a suspicious number of tabs.</sub>

</div>
