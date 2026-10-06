# Architecture

My Tech Stop is a Next.js App Router application. Public routes live under `src/app/[locale]`: home, wholesale, sell to us, products, international, insights, about, contact, and legal placeholders. It does not pretend that CRM, CMS, analytics, or a live language model are connected.

## Stack

- Next.js, React, TypeScript, App Router
- Tailwind CSS 4
- next-intl for English and Spanish
- Zod for server-side form validation
- Vitest for locale, upload, assistant, and attribution tests

No paid service is installed. See Cost approval below.

## Request flow

```
Request
  → middleware
      URL locale? use it
      else cookie? use it
      else edge country? map it
      else Accept-Language
      else English
  → /[locale]/...
  → page composed from fallback content and messages/pages.json
```

Files:

- `src/middleware.ts`
- `src/lib/locale/detectCountry.ts`
- `src/lib/locale/resolveLocale.ts`
- `src/lib/locale/countryMap.ts`
- `src/lib/locale/localeCookie.ts`
- `src/config/countries.ts`
- `messages/en`, `messages/es`

The language switcher writes `NEXT_LOCALE`. Automatic detection does not.

## UI

`src/app/[locale]/page.tsx` composes the homepage. The header, footer, and mobile menu use `src/config/navigation.ts` and link to real routes. Product categories, the hero device, trust points, and operation slots come from `src/content/fallback`. Page copy for the other routes is in `messages/*/pages.json`. Legal pages are labeled placeholders and are not counsel-reviewed. Insights lists topics only. There are no dated articles and no country doorway pages.

`InventoryService` (`src/lib/cms/inventory.ts`) is the only read path the page uses. `getAvailability()` returns `null` on purpose. Do not render a quantity or a price from this service.

When a real photo is ready, set `image` or `media` on the content object. The components already prefer that file over the line drawing.

## Leads

```
Form or assistant
  → POST /api/leads
  → same-origin check, rate limit, Zod
  → optional upload validation
  → LeadService
```

`LeadService` writes a local JSON file during development. In production it returns `not_configured` until GoHighLevel is actually implemented and tested. The UI says so. Priority is set only when `LEAD_PRIORITY_QUANTITY` is present.

Attribution (`utm_*`, landing page, referrer) is kept in `sessionStorage` and sent with the inquiry. The server adds the detected country. Do not put phone numbers or email addresses into analytics events.

## Uploads

Allowed: `.xlsx`, `.csv`, `.pdf`.

Rejected: other extensions, HTML/script content, mismatched signatures, and files over the size limit (default 8 MB).

Files are stored under `storage/uploads` with a random prefix. That directory is gitignored and is not served by Next. Nothing executes the file.

## WhatsApp

`src/config/whatsapp.ts` reads public env vars. `src/lib/whatsapp/link.ts` builds `wa.me` links and returns `null` when the number is missing. Buttons render only with a real link.

English locale → Dwayne. Spanish locale → Melissa. A buyer who picks a language inside the assistant is routed with `src/lib/ai/routing.ts`.

## Assistant

The panel in `src/components/ai/AIWidget.tsx` runs a fixed buyer or seller questionnaire from `src/lib/ai/flow.ts`. Free questions are answered only from `src/content/fallback/knowledge.ts`. Anything else, including price, stock, shipping, warranty, and payment terms, gets:

"A sales representative will confirm current availability and pricing."

`src/lib/ai/agent.ts` is the provider boundary. No model is called. Missing credentials do not enable a fake model.

## GoHighLevel

`src/lib/ghl/client.ts` exposes `createContact`, `updateContact`, `createBuyerLead`, `createSellerLead`, `addTags`, `movePipelineStage`, `createTask`, and `triggerWorkflow`.

Every method returns `not_configured` or `not_implemented`. There is no HTTP client yet. Do not mark the CRM complete until a company account is tested against the real API.

Suggested pipeline names, when the account exists: New Website Lead, Wholesale Buyer, Inventory Seller, Qualified Buyer, Qualified Seller, Quote Requested, Quote Sent, Negotiating, Order Pending, Customer, Repeat Customer, Lost / Unqualified.

Suggested sources: Google, Facebook, Instagram, TikTok, Organic Search, Direct, WhatsApp, Referral. The site already stores UTM values for that mapping.

## CMS

Ordinary edits today are code edits in `src/content/fallback` and `messages/`. That is intentional until a CMS is chosen.

Recommended later option: a self-hosted editor such as Payload or Keystatic, because both can run without a new monthly SaaS bill. Do not buy a CMS seat without the cost approval below.

The content shapes to preserve:

- Product: id, manufacturer, model, generation, storage, color, condition, grade, carrier, lock status, activation, country specification, quantity, availability, featured, image, description
- Country page, article, FAQ, testimonial, landing page, and site settings as described in the project brief

Do not publish AI-written articles without fact check, review, and a named author. The homepage insight cards are topics, not articles, and they have no fake dates.

## Analytics

`src/lib/analytics/track.ts` pushes to `dataLayer` only when `NEXT_PUBLIC_GTM_ID` is set. GA, Meta, TikTok, and Google Ads IDs are reserved in `.env.example` and are not loaded. Adding them requires a CSP update in `next.config.ts`.

## Security headers

Production responses set:

- Content-Security-Policy
- X-Content-Type-Options: nosniff
- Referrer-Policy
- X-Frame-Options: SAMEORIGIN
- Permissions-Policy (camera, microphone, and geolocation disabled)

CSP exception: `script-src` and `style-src` allow `'unsafe-inline'` because the App Router bootstraps with inline scripts. Replace that with a nonce before adding third-party tags. CSP is off in development so the dev server can run.

Cookies used for language are `SameSite=Lax` and `Secure` on HTTPS.

## Deploy and roll back

1. Create the company-owned repository and host. Do not put the remote under a personal account.
2. Set the environment variables from `.env.example` in the host, not in git.
3. Build with `npm run build` and start with `npm start`, or use the host's Next.js adapter.
4. Put Cloudflare, or another edge that sends a country header, in front if automatic language by country is required. Without that header, language falls through to the cookie, then the browser language, then English.
5. Roll back by redeploying the previous Git commit or the host's previous deployment. There is no database in this phase. Local `storage/` is not a production system of record.

## How to change the homepage

| Change | Where |
| --- | --- |
| Hero product | `src/content/fallback/catalog.ts` |
| Category | same file, `catalog` array |
| Visible sentence | `messages/en` and `messages/es` |
| Buyer market | `src/config/countries.ts` |
| WhatsApp number | `.env` `NEXT_PUBLIC_WHATSAPP_*` |
| SEO title | `messages/*/home.json` → `meta` |
| Assistant question | `src/lib/ai/flow.ts` and `messages/*/ai.json` |
| Approved answer | `src/content/fallback/knowledge.ts` |

## Later phases

Keep these as boundaries. Do not build them in the homepage pass.

- Real inventory feed behind `InventoryService`
- Tested GoHighLevel workflows
- A reviewed CMS
- Analytics tags and a stricter CSP
- A model behind `AIService`, still limited to approved facts
- Dealer portal and private pricing (not started; no customer login)
- Counsel-reviewed legal text to replace the placeholders

Do not generate a landing page per country. A market on the map is a buyer market, not an office.

## Cost approval

No new paid service is required for Phase 1A.

### GoHighLevel

- Feature: CRM delivery of buyer and seller leads
- Why: the sales team already intends to work leads there
- Monthly cost: the company's existing subscription; not purchased by this project
- Free alternative: development files in `storage/leads`, which are not a CRM
- What breaks without it: production forms explain that the inquiry was not delivered

### AI model provider

- Feature: free-form sales chat beyond the scripted questionnaire
- Why: not required; the questionnaire and approved answers already qualify a lead
- Monthly cost: varies by vendor; do not enable until approved
- Free alternative: the current scripted assistant
- What breaks without it: nothing in the current homepage

### CMS

- Feature: non-developer editing
- Why: not required to launch the homepage
- Monthly cost: $0 if self-hosted; hosted seats vary
- Free alternative: the typed content files in this repo
- What breaks without it: content updates are code changes

### Geo IP vendor

- Feature: country detection
- Why not needed: the edge host already supplies a country header
- Monthly cost: $0
- What breaks without an edge header: language uses the cookie, then the browser language, then English

## Tests

`npm test` covers locale resolution, country mapping, WhatsApp links, upload rejection, assistant state, knowledge limits, lead priority, and UTM merging.
