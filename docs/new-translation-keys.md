# New translation keys

These keys are used with a default message (`t("key", "English text")`), so the pages show the English text until
the key is added to `app/config/i18n/locales/en.json` and `ar.json`. Beware vue-i18n special characters if the text changes
(`{ } @ $ |`).

| Key | English | Where used |
| --- | --- | --- |
| `orders.track_lookup_hint` | Enter your order number and the PIN from your confirmation. If you're signed in, your own orders don't need a PIN. | `components/track-order/track-lookup.vue` |
| `orders.track_pin_label` | Order PIN | `components/track-order/track-lookup.vue` |
| `orders.track_pin_required` | Enter the PIN from your order confirmation. | `components/track-order/track-lookup.vue` |
| `orders.track_pin_placeholder` | e.g. 4821-9307 | `components/track-order/track-lookup.vue` |
| `orders.track_idle_description` | Your order number and PIN are on the confirmation page. Orders placed in this tab also appear above. | `pages/track/index.vue` |
| `orders.track_not_found` | We couldn't find that order. Check the order number and PIN. | `pages/track/index.vue` |
| `orders.track_failed` | We couldn't reach the order system. Try again in a moment. | `pages/track/index.vue` |
| `orders.track_need_pin` | Enter the order number and PIN to look up this order. | `pages/track/index.vue` |
| `orders.order_not_found_description` | We couldn't find that order, or it needs its PIN. Open the link from your confirmation, or track it with the order number and PIN. | `pages/order/[id].vue` |
| `orders.voucher_not_valid` | That code doesn't apply to this cart. Check it for typos or try another. | `components/cart/order-summary.vue` |
| `orders.place_stock_error` | Some items are no longer available in that quantity | `pages/checkout/index.vue` (toast title; the server's message is the description) |
| `orders.place_invalid_error` | We couldn't place this order | `pages/checkout/index.vue` (toast title) |
| `orders.place_failed_error` | The order wasn't placed | `pages/checkout/index.vue` (toast title) |
| `orders.profile_not_saved` | Your changes couldn't be saved. Try again. | `components/account/profile/profile-identity.vue` (toast) |
| `catalog.load_error_title` | We couldn't load the catalog | `components/catalog/catalog-load-error.vue` |
| `catalog.load_error_description` | The product list is temporarily unavailable. Check your connection and try again. | `components/catalog/catalog-load-error.vue` |
| `catalog.load_error_retry` | Try again | `components/catalog/catalog-load-error.vue` |
| `account.orders_load_error_title` | We couldn't load your orders | `pages/account/orders/index.vue` |
| `account.orders_load_error_description` | Your order history is temporarily unavailable. Your orders are safe; try again in a moment. | `pages/account/orders/index.vue` |
| `account.orders_load_error_retry` | Try again | `pages/account/orders/index.vue` |
