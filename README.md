# Chef Adex demo (Next.js + Tailwind v4)

    npm install
    npm run dev      # http://localhost:3000

Edit these first:
- `lib/site.ts`       name, WhatsApp number, email, phone, city, nav
- `lib/data/*`        services, menu, packages, FAQs, reviews, stats (all placeholder)
- `lib/images.ts`     100 placeholder photos (loremflickr). Swap for /public/photos/*.jpg
- `app/globals.css`   brand blue scale (`--color-brand-*`). Change it to recolor the whole site

Structure: one folder per section in `components/`, shared primitives in `components/ui/`,
state and effects in `hooks/`.
