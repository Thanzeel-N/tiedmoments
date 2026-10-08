# Tied Moments

A single-page Next.js wedding photography website using the supplied photographs and a transparent version of the supplied logo.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000. For production, use `npm run build` followed by `npm start`.

## Connect WhatsApp

WhatsApp is configured for +91 90378 67720. To change it, copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_WHATSAPP_NUMBER` to the international number, including the country code. Use digits only. Restart the dev server, or rebuild for production.

The short enquiry form opens WhatsApp with the visitor's name, wedding date, and location. The visitor sends the message themselves. No details are sent to a server or stored.

## Assets and content

- `app/page.tsx`: copy, selected gallery images, services, contact form.
- `app/globals.css`: responsive layout, animations, reduced-motion support.
- `public/images/`: optimised WebP copies of all 17 unique supplied photographs (one exact duplicate source is preserved but displayed once). The complete gallery appears immediately after What we capture.
- `public/logo.png`: background-extracted logo.
- `gallery/` and `logo/`: supplied originals, preserved.
- `scripts/prepare-assets.mjs`: reproducible photo optimisation.

The minimal layout includes gallery filters, an accessible native-dialog photo viewer, keyboard navigation, mobile navigation, and slideshow controls. An illustrated About section, photography coverage, a three-step experience, travel availability, and expandable FAQs give the single page more depth. Animations respect reduced-motion preferences. Inter is bundled locally with system fallbacks; no external font request is needed.

The 500+ wedding claim and travel availability are supplied by the client. No invented reviews, prices, team identities, phone numbers, or social links are included. Service copy should be reviewed by the team before launch.

## Logo processing

Processed with the built-in imagegen tool (background-extraction). Prompt: remove the brown background from the supplied Tied Moments logo, preserve the original white brush lettering, output transparent PNG with a small margin and no added decoration.

## Checks

```sh
npm run typecheck
npm run build
```
