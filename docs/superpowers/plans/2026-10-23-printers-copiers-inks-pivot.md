# Printers, Photocopiers and Inks & Toner Pivot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the photography/optics store into a store for Printers, Photocopiers and Inks & Toner, in both English and Arabic.

**Architecture:** The catalog is static data served by `server/api/catalog.get.ts` and `server/api/products/[id].get.ts` from `app/data/*`. The pivot swaps the category taxonomy, rewrites the sample data, adds category-specific attribute filters, and rewrites every customer-visible string. Pages and components are reused. Two small Node scripts (a vocabulary check and a route smoke test) stand in for a test runner, because the repo has none.

**Tech Stack:** Nuxt 4, Vue 3, Tailwind 3, Pinia, `@nuxtjs/i18n` (en/ar), `nuxi typecheck`.

**Spec:** `docs/superpowers/specs/2026-10-23-printers-copiers-inks-pivot-design.md`

## Global Constraints

- Categories are exactly `printers`, `copiers`, `inks-toner`. No Paper & Supplies, no Parts & Service plans.
- Route slugs: `/products/printers`, `/products/photocopiers`, `/products/inks-toner`. Slug `photocopiers` maps to category key `copiers`.
- Sample products are invented, with generic brand-style names, placeholder prices in EGP, about 8 to 12 per category.
- `/printing` (Print Lab) stays. Only its photography wording changes.
- `design.md` stays the design contract: existing tokens, light and dark modes, RTL, reduced motion. No new visual language.
- Arabic strings are written, not machine-translated.
- Removed routes redirect to `/products`: `/products/cameras`, `/products/lenses`, `/products/lighting`, `/products/audio`, `/products/tripods`, `/products/accessories`. `/products/paper-ink` redirects to `/products/inks-toner`.
- Banned customer-visible vocabulary after the pivot: camera, lens, lenses, lighting, audio, tripod, medium format, colorimeter, baryta, cine, Hasselblad, photograph.
- `nuxi typecheck` reports no new errors after every task. The app builds and runs after every task.
- Do not commit unless the user asks. The "Checkpoint" step at the end of each task means: run the verification and report. Commit only if told to.

## Review Focus

1. Stale localStorage: cart, wishlist, compare and recently viewed hold removed product IDs. Expected: they are ignored or dropped, never a crash or a blank card.
2. Old URLs: `/product/x2d` (removed product) and `/products/cameras`. Expected: the first shows the existing "Product not found" page; the second redirects to `/products`.
3. Compare with products from different categories. Expected: compare accepts one category at a time and tells the user why an add was refused.
4. Category pages and filters that yield zero results. Expected: an empty state with a way to clear filters, not a blank grid.
5. Search for removed words ("camera", "lens"). Expected: a helpful no-results state, not an error.

---

## File Structure

- Create `scripts/check-vocabulary.mjs`: fails on banned words in `app/` and `server/`.
- Create `scripts/smoke-routes.mjs`: requests a list of routes against a base URL and checks status codes and redirects.
- Create `app/components/product/compatibility-list.vue`: "Compatible with" list for inks and toner.
- Modify `app/types/catalog/index.ts`, `app/types/home/index.ts`, `app/types/product/index.ts`, `app/types/compare/index.ts`.
- Modify `app/data/catalog.ts`, `product-details.ts`, `compare.ts`, `home.ts`, `info-pages.ts`, `wishlist.ts`, `cart.ts`, `account.ts`, `account-orders.ts`, `auth.ts`, `printing.ts`.
- Modify `app/composables/useCatalog.ts`, `useCategorySearchMatch.ts`.
- Modify `nuxt.config.ts` (route rules) and `app/config/i18n/locales/{en,ar}.json`.
- Delete `app/pages/products/cameras.vue`, `app/data/cameras.ts`, `app/composables/useCameraInventory.ts`, `app/types/cameras/`, and unused files in `app/components/category/`.

---

### Task 1: Safety net (vocabulary check and route smoke test)

**Files:**
- Create: `scripts/check-vocabulary.mjs`, `scripts/smoke-routes.mjs`
- Modify: `package.json` (scripts `check:vocab`, `smoke`)

**Interfaces:**
- Produces: `npm run check:vocab` exits 1 and prints `file:line: word` for each banned word found in `app/**/*.{vue,ts,json}` and `server/**/*.ts` (case-insensitive, whole word, ignoring `docs/` and `node_modules/`). `npm run smoke -- <baseUrl>` exits 1 and prints each failing route; routes and expected statuses live in an array at the top of the script.

- [ ] **Step 1:** Write `check-vocabulary.mjs` with the banned words from Global Constraints and an `ALLOW` array (empty at first) of `file:word` pairs for intentional exceptions.
- [ ] **Step 2:** Write `smoke-routes.mjs`. Initial route list: `/en`, `/en/products`, `/en/products/printers`, `/en/products/photocopiers`, `/en/products/inks-toner`, `/en/compare`, `/en/wishlist`, `/en/cart`, `/en/printing`, `/en/track` expect 200; `/en/products/cameras` expects a 30x redirect to `/en/products`.
- [ ] **Step 3:** Run `npm run check:vocab`. Expected: FAIL with many matches (this is the baseline).
- [ ] **Step 4:** Checkpoint: report the baseline match count.

### Task 2: Taxonomy, types and category pages

**Files:**
- Modify: `app/types/catalog/index.ts`, `app/types/home/index.ts`, `app/data/catalog.ts` (`categoryOptions`, `categoryPages`, `categoryKeywords`), `app/composables/useCategorySearchMatch.ts`, `app/pages/products/[category].vue`
- Delete: `app/pages/products/cameras.vue`

**Interfaces:**
- Produces:
  - `type CatalogCategory = "printers" | "copiers" | "inks-toner"`.
  - `Product.group: "printer" | "copier" | "ink"` (replaces `"camera" | "print" | "lighting"`).
  - `categoryPages` keys `printers`, `photocopiers`, `inks-toner`, each `{ label, description, scope: CatalogCategory[] }`; `photocopiers.scope` is `["copiers"]`.
  - `categoryKeywords: Record<CatalogCategory, string>` with search words (copier, photocopier, toner, cartridge, ink, and so on).
- Consumes: nothing.

- [ ] **Step 1:** Replace the three exports in `app/data/catalog.ts` and the type unions. Let `nuxi typecheck` list every consumer of the old keys.
- [ ] **Step 2:** Fix each consumer the typecheck reports. Temporary: product data (Task 3) may fail typecheck until it is rewritten; do Tasks 2 and 3 together before running the full typecheck.
- [ ] **Step 3:** Delete `pages/products/cameras.vue`. `pages/products/[category].vue` then serves all three slugs with its existing 404 for unknown slugs.
- [ ] **Step 4:** Checkpoint: after Task 3, run `npx nuxi typecheck` and `npm run smoke -- http://localhost:3000` against the three category routes.

### Task 3: Sample catalog data

**Files:**
- Modify: `app/data/catalog.ts` (`baseProducts`, `stockImages` mapping kept)

**Interfaces:**
- Produces: `CatalogProduct` gains `attrs: PrinterAttrs | CopierAttrs | InkAttrs` (typed per category in `app/types/catalog/index.ts`):
  - `PrinterAttrs { technology: "inkjet" | "laser" | "large-format"; colour: "colour" | "mono"; maxPaper: "A4" | "A3" | "A2" | "A0"; connectivity: ("wifi" | "ethernet" | "usb")[]; duplex: boolean }`
  - `CopierAttrs { ppm: number; paper: "A4" | "A3"; functions: ("copy" | "print" | "scan" | "fax")[]; duplex: boolean }`
  - `InkAttrs { kind: "ink" | "toner" | "drum"; colour: "black" | "cyan" | "magenta" | "yellow" | "multi"; compatibleWith: string[]; yield: string }`
- Product IDs are kebab-case, SKUs `PP-<BRAND2>-<NUM>`, all unique. Keep `dispatch` keys and `badge` constants. Each product keeps `specs: string[]` as 3 short strings.
- Content: 8 to 12 products per category, generic brand names, plausible EGP prices, ratings between 4.0 and 5.0, a mix of `dispatch` values.

- [ ] **Step 1:** Rewrite `baseProducts` with the products above. Keep `rating`, `reviews`, `lease` and `icon` fields (icons: `lucide:printer`, `lucide:copy`, `lucide:droplets`).
- [ ] **Step 2:** Run `npx nuxi typecheck`. Expected: no errors from `data/catalog.ts` or its consumers.
- [ ] **Step 3:** Run `curl -s http://localhost:3000/api/catalog | head -c 400`. Expected: JSON array of the new products.
- [ ] **Step 4:** Checkpoint: report product counts per category.

### Task 4: Category-specific filters

**Files:**
- Modify: `app/data/catalog.ts` (add `attrFilterDefs`), `app/composables/useCatalog.ts`, `app/components/catalog/catalog-filters.vue`, `catalog-page.vue`, `active-filters.vue`, `filter-drawer.vue`

**Interfaces:**
- Produces:
  - `attrFilterDefs: Record<CatalogCategory, { key: string; label: string; options: { value: string; label: string }[] }[]>`, covering the attributes in Task 3 (printers: technology, colour, max paper, connectivity; copiers: speed band, paper, functions; inks-toner: kind, colour, compatible brand).
  - `CatalogFilters.attrs: Record<string, string[]>`, empty by default.
  - `useCatalog()` returns `attrGroups` (the defs for the currently selected single category, or `[]` when zero or several categories are selected) and `toggleAttr(key: string, value: string)`.
- Consumes: Task 3 `attrs`.

- [ ] **Step 1:** Add `attrFilterDefs` and the `attrs` filter field. Matching rule: every selected key must match at least one selected value.
- [ ] **Step 2:** Extend `matches` and `chips` in `useCatalog` so attribute filters apply and appear as removable chips; clearing all filters clears `attrs`.
- [ ] **Step 3:** Render `attrGroups` in `catalog-filters.vue` (and so in the mobile drawer) using the existing `filter-group` and `filter-option` components. Group labels and options must wrap in RTL without truncation.
- [ ] **Step 4:** Verify in the browser: on `/en/products/printers`, selecting "Laser" shows only laser printers, a chip appears and removes the filter; selecting no category shows no attribute groups. Zero results must show the existing empty state with a clear-filters action.
- [ ] **Step 5:** Checkpoint: typecheck and report.

### Task 5: Product details and compare

**Files:**
- Modify: `app/data/product-details.ts`, `app/types/product/index.ts`, `app/types/compare/index.ts`, `app/data/compare.ts`, `app/pages/product/[id].vue`, `app/composables/useComparison.ts`, `app/stores/compareStore.ts`, `app/components/compare/*`
- Create: `app/components/product/compatibility-list.vue`

**Interfaces:**
- Produces:
  - `ProductDetail.compatibleWith?: string[]` and `ProductDetail.yieldNote?: string`. `<compatibility-list :items :yield-note />` renders them; the product page shows it only when `compatibleWith` is set.
  - `compareSections` becomes `Record<CatalogCategory, CompareSectionDef[]>`, with spec rows per category (printers: technology, resolution, speed, paper handling, connectivity, running cost; copiers: ppm, paper capacity, duplex, scan features, monthly duty cycle; inks-toner: yield, compatibility, colour, kind).
  - `compareData` keys are the new product IDs. `comparePresets` are rewritten to pairs and trios within one category.
- Consumes: Task 3 product IDs and `attrs`.

- [ ] **Step 1:** Rewrite the rich `richDetails` entries for one flagship per category (a printer, a copier, an ink or toner). Rewrite the default `getProductDetail` fallback text (packages, assurance, key facts) for the new business.
- [ ] **Step 2:** Add `compatibility-list.vue` and wire it into `pages/product/[id].vue`.
- [ ] **Step 3:** Rewrite `compare.ts` sections, data and presets. In `compareStore`, refuse adding a product whose category differs from the first item and show a toast saying compare works within one category.
- [ ] **Step 4:** Verify: open the flagship of each category, check specs, compatibility list (inks only) and reviews; add two printers and one copier to compare and confirm the refusal toast.
- [ ] **Step 5:** Checkpoint: typecheck and smoke test.

### Task 6: Home page and search copy

**Files:**
- Modify: `app/data/home.ts` (`promoItems`, `categories`, `partners`, `heroStats`, `featured`, `arrivals`, `valueProps`, `trust`), `app/components/home/{home-hero,discipline-grid,archival-feature,promo-banner,digest-signup,concierge-modal,bench-arrivals,featured-equipment}.vue`, `app/components/layouts/announcement-bar.vue`, `app/components/search/*`, `app/components/shared/VSearchInput.vue`, `app/pages/index.vue`

**Interfaces:**
- Produces: `categories` in `home.ts` has exactly three entries (`label`, `to`, `terms`, `icon`, `blurb`, `meta`) pointing at the three category routes. `featured` and `arrivals` reference only product IDs that exist in Task 3.
- Consumes: Task 2 slugs, Task 3 IDs.

- [ ] **Step 1:** Rewrite the data exports above and the hero, tiles and banner copy for printers, copiers, inks and the Print Lab service.
- [ ] **Step 2:** Replace search placeholders and suggestions. Searching "camera" must show the existing no-results state with category links.
- [ ] **Step 3:** Verify the home page in light, dark and RTL; every tile and CTA links to an existing page.
- [ ] **Step 4:** Checkpoint: run `npm run check:vocab` and report the drop from baseline.

### Task 7: Header, mobile menu and footer

**Files:**
- Modify: `app/components/layouts/{category-nav,mobile-menu,site-footer,site-header}.vue`, `app/data/home.ts` (`footerColumns`)

**Interfaces:**
- Produces: `footerColumns` has three entries: "Printers & Copiers", "Inks & Toner", "Services". Each link is `{ label, to }` and points to a category route or an info page from Task 8.
- Consumes: Task 8 slugs (use the slugs defined there).

- [ ] **Step 1:** Update category nav and mobile menu from `categories`. Replace the mobile menu's "Trade-in evaluation" and "ICC custom profile" actions with real links (trade-in page, Print Lab).
- [ ] **Step 2:** Update `footerColumns` and the footer's company line.
- [ ] **Step 3:** Verify: every header, mobile and footer link returns 200 via `npm run smoke`.
- [ ] **Step 4:** Checkpoint.

### Task 8: Info pages

**Files:**
- Modify: `app/data/info-pages.ts`, `app/components/info/info-page.vue` (only if a link target changes)

**Interfaces:**
- Produces: slugs (group/slug):
  - `services/maintenance-contracts`, `services/trade-in`, `services/financing`, `services/shipping-delivery`
  - `guides/choosing-a-printer`, `guides/choosing-a-photocopier`, `guides/ink-toner-compatibility`
  - `legal/equipment-terms`, `legal/privacy`
- Redirects (route rules, Task 11): old slugs `services/bench-calibration`, `services/studio-financing`, `services/shipping-freight`, `guides/icc-profiling`, `guides/medium-format-film`, `guides/calibration` go to the nearest new slug.

- [ ] **Step 1:** Rewrite the page entries. Legal pages keep their structure with printer/copier wording. CTAs link to category pages.
- [ ] **Step 2:** Verify each new slug returns 200 and the "On this page" sidebar still highlights and scrolls.
- [ ] **Step 3:** Checkpoint.

### Task 9: Account, orders, checkout, wishlist, cart and printing copy

**Files:**
- Modify: `app/data/{wishlist,cart,account,account-orders,auth,printing,checkout,tracking}.ts`, `app/components/account/*`, `app/components/checkout/payment-step.vue`, `app/components/order/order-support.vue`, `app/components/printing/*`, `app/pages/{account,auth,cart,wishlist,compare}/**`

**Interfaces:**
- Produces: `sampleRegistry` and `companionIds` contain only Task 3 IDs. Demo orders and the demo account reference new products. Wording changes: calibration, cleanroom, dock and atelier concepts become service plans, install location and supplies reorder. `studioTags` become business-appropriate (for example "Front office", "Print room").
- Consumes: Task 3 IDs.

- [ ] **Step 1:** Update the data files, then the components' hard-coded strings reported by `npm run check:vocab`.
- [ ] **Step 2:** Verify: sign up, view account, open an order, add a product to the wishlist and cart, start the Print Lab flow; no photography wording remains.
- [ ] **Step 3:** Checkpoint.

### Task 10: Removals and stale browser data

**Files:**
- Delete: `app/data/cameras.ts`, `app/composables/useCameraInventory.ts`, `app/types/cameras/`, and files in `app/components/category/` that nothing imports after Task 2.
- Modify: `app/stores/{cartStore,wishlistStore,compareStore}.ts`

**Interfaces:**
- Produces: each store drops product IDs that `findProduct(id)` does not return, on load. Cart quantities for dropped IDs are removed.
- Consumes: `findProduct` from `app/data/product-details.ts`.

- [ ] **Step 1:** Before deleting a file, run `grep -rn "<name>" app` and delete only files with no importers.
- [ ] **Step 2:** In each store, filter unknown IDs once after the persisted value loads (client side, after `initOnMounted`).
- [ ] **Step 3:** Verify: in the browser console set `localStorage["wishlist-ids"]='["x2d"]'` and reload `/en/wishlist`. Expected: empty wishlist, no error.
- [ ] **Step 4:** Run `npx nuxi typecheck`. Expected: no errors.
- [ ] **Step 5:** Checkpoint.

### Task 11: Redirects, translations and final sweep

**Files:**
- Modify: `nuxt.config.ts` (`routeRules`), `app/config/i18n/locales/en.json`, `app/config/i18n/locales/ar.json`, `scripts/check-vocabulary.mjs` (allow list)

**Interfaces:**
- Produces: `routeRules` redirects for every old URL in Global Constraints and in Task 8, using locale-prefixed sources (`/en/...` and `/ar/...`).

- [ ] **Step 1:** Add the redirects. Extend `smoke-routes.mjs` with each old URL expecting a redirect and each new URL expecting 200, for both `/en` and `/ar`.
- [ ] **Step 2:** Update both locale JSON files for every changed string. Arabic is written by hand and flagged for native review.
- [ ] **Step 3:** Run `npm run check:vocab`. Expected: no matches except entries deliberately added to `ALLOW`, each with a one-line reason.
- [ ] **Step 4:** Run `npm run smoke -- http://localhost:3000` and `npx nuxi typecheck`. Expected: both pass.
- [ ] **Step 5:** Walk the app in `/en` and `/ar`, light and dark: home, three categories with filters, a product page per category, compare, wishlist, cart, Print Lab, an info page, the footer. Report anything that still reads as photography or looks broken.
- [ ] **Step 6:** Checkpoint: final report with the vocabulary result, smoke result and the follow-ups from the spec (images, Arabic review, legal review).
