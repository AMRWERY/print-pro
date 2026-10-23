# Business pivot: Printers, Photocopiers and Inks & Toner

Date: 2026-10-23
Status: Draft for review

## 1. Goal

PrintPro stops selling photography and optics equipment and becomes a store for:

1. **Printers**
2. **Photocopiers**
3. **Inks & Toner**

Everything customer-visible must fit that business: catalog, navigation, home page, product and compare pages, search, footer, info pages, account and checkout wording, and both locales (en, ar).

## 2. Confirmed decisions

| Decision | Choice |
| --- | --- |
| Scope | Full pivot. Camera, lens, lighting, audio and tripod content is removed everywhere. |
| Top-level categories | Printers, Photocopiers, Inks & Toner. No Paper & Supplies, no Parts & Service plans for now. |
| Product data | Invented, realistic sample products with placeholder prices. A real product list can replace them later. |
| Print Lab (`/printing`) | Stays. It is a print-job service and fits the new business. Its copy is checked for photography wording only. |

Out of scope: a real backend or API, real pricing, real product photography, new payment or shipping logic, new top-level pages beyond what is listed in section 5.

## 3. Constraints

- Nuxt 4, Tailwind 3 and `@nuxtjs/i18n`. Arabic (RTL) is the primary locale.
- `design.md` stays the design contract: existing tokens, motion, accessibility, light and dark modes.
- Existing components (`VProductCard`, `catalog-page`, filters, compare, wishlist, cart) are reused. They are changed only where their content is photography-specific.
- No new visual language. The layout and look stay; the content and attributes change.

## 4. Success criteria

1. A search of `app/` for the old vocabulary (camera, lens, lighting, audio, tripod, medium format, colorimeter, baryta, cine, Hasselblad) returns no customer-visible matches. Intentional exceptions are listed in the final sweep.
2. Every category page, product page, compare view, wishlist and cart works with the new data.
3. Filters offer attributes that matter for the new products (section 5.2) and active filters remain visible and removable.
4. `/products/cameras` and other removed routes redirect to `/products` instead of returning 404.
5. English and Arabic both read naturally. The Arabic strings are written, not machine-translated.
6. `nuxi typecheck` reports no new errors.

## 5. Design

### 5.1 Taxonomy

`CatalogCategory` in `app/types/catalog/index.ts` becomes:

```
"printers" | "copiers" | "inks-toner"
```

- `categoryOptions`, `categoryPages` and `categoryKeywords` in `app/data/catalog.ts` are rewritten for the three categories.
- Route slugs: `/products/printers`, `/products/photocopiers`, `/products/inks-toner`. A slug-to-category map keeps `photocopiers` mapped to the `copiers` key.
- The header `categories` list in `app/data/home.ts` and `useCategorySearchMatch` use the same three entries, with icons and search terms (for example "copier", "photocopier", "toner", "cartridge", "ink").

### 5.2 Product data and attributes

`CatalogProduct` keeps its current fields and gains a typed `attrs` object per category:

- **Printers:** technology (inkjet, laser, large-format), colour or mono, max paper size, connectivity, duplex.
- **Photocopiers:** print speed in ppm, A3 or A4, functions (copy, print, scan, fax), duplex, finishing options.
- **Inks & Toner:** type (ink, toner, drum), colour, compatible brand and models, page yield or volume.

Sample catalog target: roughly 8 to 12 products per category, using generic brand-style names so no real manufacturer claims are made. Prices stay in EGP, as in the current app.

Filters in `useCatalog` and the catalog filter components:

- Always: category, brand, price, availability, rating.
- Category-specific filters appear only when that category is selected (for example speed for copiers, compatibility for inks).
- `dispatchOptions` and `sortOptions` are reviewed for photography wording and otherwise kept.

### 5.3 Product details and compare

- `app/data/product-details.ts`: rich detail entries are rewritten for one flagship product per category. Other products keep the generated default detail.
- Detail sections change to fit: spec groups by category, a "Compatible with" list for inks and toner, and yield per cartridge.
- `app/data/compare.ts` and the compare page get spec rows per category. Compare stays limited to products of one category at a time.
- Reviews (already built) work unchanged.

### 5.4 Home, header, footer, search

- Home (`pages/index.vue` and `components/home/*`): hero, category tiles, discipline grid, archival feature, promo banner and digest signup are rewritten around the three categories and the Print Lab service.
- Header nav, mobile menu and search suggestions use the new categories.
- Footer columns: **Printers & Copiers**, **Inks & Toner**, **Services**. Link targets are the new category pages and the info pages in 5.5.
- Announcement bar and concierge modal copy are rewritten.

### 5.5 Info pages (added earlier)

`app/data/info-pages.ts` is rewritten. The slugs and routes can change because the old pages no longer fit.

- Services: maintenance contracts, trade-in, financing, shipping and delivery.
- Guides: choosing a printer, choosing a photocopier, ink and toner compatibility.
- Legal: equipment terms and privacy, kept with light edits.

Footer links and cross-links are updated to match. Old URLs redirect to the nearest new page.

### 5.6 Removals

Deleted:

- `app/pages/products/cameras.vue`
- `app/data/cameras.ts`
- `app/composables/useCameraInventory.ts`
- `app/types/cameras/`
- Category components that exist only for the camera page (`components/category/*`), after confirming nothing else imports them.

Redirects (in `nuxt.config.ts` route rules): `/products/cameras`, `/products/lenses`, `/products/lighting`, `/products/audio`, `/products/tripods` and `/products/accessories` go to `/products`. `/products/paper-ink` goes to `/products/inks-toner`.

### 5.7 Account, orders, checkout, wishlist

Seed data and copy in `data/account.ts`, `data/auth.ts`, `data/wishlist.ts`, `data/order.ts`, `data/tracking.ts` and the account and checkout components are updated so order history, wishlist and cart items reference the new products. Account wording about calibration, cleanrooms and docks is replaced with printer and copier equivalents (service plans, install location, supplies reorder).

### 5.8 Translations

`app/config/i18n/locales/en.json` and `ar.json` are updated for every changed string. Strings that are currently hard-coded in components stay hard-coded unless a component already uses i18n keys; moving them to i18n is out of scope.

## 6. Order of work

1. Taxonomy, types, sample data and filters (5.1, 5.2).
2. Product detail and compare (5.3).
3. Home, header, footer, search (5.4).
4. Info pages (5.5).
5. Account, orders, checkout, wishlist data and copy (5.7).
6. Removals and redirects (5.6).
7. Translations and the final vocabulary sweep (5.8, success criterion 1).

Each step leaves the app building and running, so work can pause between steps.

## 7. Risks

- **Wide surface:** 78 files mention the old vocabulary. The final sweep and typecheck are the safety net.
- **Images:** current product images and the hero are existing placeholders. They will not match the new products. Replacing them needs real or generated imagery and is a follow-up.
- **Stored data:** wishlist, cart and review data in visitors' localStorage may reference removed product IDs. The stores must ignore unknown IDs instead of failing.
- **Arabic copy:** needs a native review before launch.
- **Legal text:** terms and privacy copy is placeholder and needs legal review.
