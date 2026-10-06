# My Tech Stop

Wholesale website for My Tech Stop (`mytechstop.com`). The company buys and sells mobile devices in bulk. The public site is multi-page: home, wholesale, sell to us, product categories, international, insights, about, contact, and placeholder legal pages. English and Spanish, with country detection for the default language.

A CMS, GoHighLevel, a live AI model, analytics pixels, and WhatsApp numbers are not connected. The site does not invent prices, stock counts, reviews, or offices.

## Install

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` only with values the company has approved. Leave unknown values blank.

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The middleware sends `/` to `/en` or `/es`.

```bash
npm test
npm run lint
npm run build
npm start
```

## Content source

Homepage copy and categories come from typed fallback files in `src/content/fallback` and `messages/`. This is not a live CMS and it is not live inventory. Categories do not show prices or quantities.

Replace the hero product in `src/content/fallback/catalog.ts` (`heroProduct`). Set `active: false` to hide it. A future CMS should feed the same shape through `src/lib/cms/inventory.ts`.

## Localization

Supported locales: `en`, `es`.

Resolution order:

1. Locale in the URL (`/en`, `/es`)
2. `NEXT_LOCALE` cookie, set only when someone uses the language switcher
3. Edge country header
4. `Accept-Language`
5. English

Automatic detection does not write the cookie, so it cannot trap a visitor. Choosing English or Español does.

### Add a language

1. Add the locale to `src/i18n/routing.ts` and `src/config/locale.ts`.
2. Copy `messages/en` to `messages/<locale>` and translate every file.
3. Add the language to the switcher in `src/components/navigation/LanguageSwitcher.tsx`.
4. Map countries in `src/lib/locale/countryMap.ts`.

Do not translate the rendered page in the browser.

### Add a country

Add it to `src/config/countries.ts` if it should appear as a buyer market. Add it to `src/lib/locale/countryMap.ts` if it should change the default language. A market on the map is not an office.

### Country detection

`src/lib/locale/detectCountry.ts` reads, in order:

- `cf-ipcountry` (Cloudflare)
- `x-vercel-ip-country` (Vercel)
- `cloudfront-viewer-country` (CloudFront)
- `x-country-code` (any other host)

For local preview only, set `MTS_DEV_COUNTRY=CO`. Never set that in production.

## WhatsApp

Set `NEXT_PUBLIC_WHATSAPP_ENGLISH` and `NEXT_PUBLIC_WHATSAPP_SPANISH` in international format. English pages use Dwayne. Spanish pages use Melissa. If a number is missing, that button is hidden.

## Leads and uploads

`POST /api/leads` validates buyer, seller, and assistant submissions.

- In development, inquiries are written to `storage/leads` (gitignored). The form says they are not in the CRM.
- In production, without GoHighLevel, the form reports that delivery is not connected.
- Seller files must be PDF, CSV, or XLSX. They are checked by extension, MIME type, and file signature, then stored outside `public/` when `UPLOAD_DRIVER=local` (the development default). Production refuses uploads until `UPLOAD_DRIVER=local` is set on a server with a persistent disk.

## What is intentionally not live

See `ARCHITECTURE.md` for GoHighLevel, AI, CMS, and analytics boundaries.
