// Formats through vue-i18n's `n()` so symbol, digits and grouping follow the
// active locale (en / ar). The `currency_<ISO>` formats live in i18n.config.ts.
export const useMoney = () => {
  const { n } = useI18n();
  return {
    code: STORE_CURRENCY,
    format: (value: number) => n(value, `currency_${STORE_CURRENCY}`),
  };
};
