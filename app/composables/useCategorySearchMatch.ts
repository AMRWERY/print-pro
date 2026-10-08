/**
 * True when the current page is a search whose whole query names a category
 * ("camera", "cameras", "paper"…), so the category row can highlight it.
 */
export const useCategorySearchMatch = () => {
  const route = useRoute();

  const query = computed(() => {
    if (!/\/search\/?$/.test(route.path)) return "";
    const q = route.query.q;
    return String((Array.isArray(q) ? q[0] : q) ?? "")
      .trim()
      .toLowerCase();
  });

  return (category: { terms?: string[] }) =>
    !!query.value && !!category.terms?.includes(query.value);
};
