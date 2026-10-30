import { compareData, compareSections, derivedSpecs } from "~/data/compare";
import type { MatrixRow, MatrixSection, SpecValue } from "~/types/compare";
import type { CatalogCategory } from "~/types/catalog";
import type { DetailedProduct } from "~/types/product";

const MISSING: SpecValue = { value: "—" };

/**
 * Builds the comparison matrix for a list of product ids and tracks the view
 * options (highlight differences, hide identical rows, collapsed sections).
 */
export const useComparison = (ids: Ref<string[]>) => {
  const money = useMoney();
  const { findProduct } = useCatalogStore();

  const products = computed(() =>
    ids.value
      .map((id) => findProduct(id))
      .filter((p): p is DetailedProduct => !!p),
  );

  const highlight = ref(true);
  const hideIdentical = ref(false);
  const collapsed = ref<string[]>([]);

  // Facts every product has, so any selection can be compared.
  const coreValues = (p: DetailedProduct): Record<string, SpecValue> => ({
    price: { value: money.format(p.price) },
    rating: { value: `${p.rating.toFixed(1)} / 5`, note: `${p.reviews} reviews` },
    lease: p.lease ? { value: `${money.format(p.lease)} / mo`, note: "Lease" } : MISSING,
    dispatch: { value: p.badge.label },
  });

  const coreRows = [
    { key: "price", label: "Price" },
    { key: "rating", label: "Customer rating" },
    { key: "lease", label: "Lease from" },
    { key: "dispatch", label: "Availability" },
  ];

  const sections = computed<MatrixSection[]>(() => {
    const list = products.value;
    if (!list.length) return [];

    const category = (list[0] as { category?: CatalogCategory }).category ?? "printers";
    const defs = [{ key: "core", title: "Core facts", rows: coreRows }, ...compareSections[category]];
    const out: MatrixSection[] = [];

    for (const def of defs) {
      const rows: MatrixRow[] = [];
      for (const row of def.rows) {
        const values = list.map((p) =>
          def.key === "core"
            ? coreValues(p)[row.key]
            : (compareData[p.id]?.specs[row.key] ?? derivedSpecs(p)[row.key]),
        );
        if (!values.some(Boolean)) continue; // nobody has this row

        const cells = values.map((v) => v ?? MISSING);
        const unique = new Set(cells.map((c) => c.value.trim().toLowerCase()));
        const delta = list.length > 1 && unique.size > 1;

        rows.push({
          key: row.key,
          label: row.label,
          hint: "hint" in row ? (row.hint as string) : undefined,
          delta,
          cells: cells.map((c) => ({ ...c, differs: delta })),
        });
      }
      if (rows.length)
        out.push({ key: def.key, title: def.title, deltas: rows.filter((r) => r.delta).length, rows });
    }
    return out;
  });

  const visibleSections = computed(() =>
    sections.value
      .map((s) => ({ ...s, rows: hideIdentical.value ? s.rows.filter((r) => r.delta) : s.rows }))
      .filter((s) => s.rows.length),
  );

  const totalDeltas = computed(() => sections.value.reduce((n, s) => n + s.deltas, 0));

  const isCollapsed = (key: string) => collapsed.value.includes(key);
  const toggleSection = (key: string) =>
    (collapsed.value = isCollapsed(key)
      ? collapsed.value.filter((k) => k !== key)
      : [...collapsed.value, key]);
  const allCollapsed = computed(
    () => visibleSections.value.length > 0 && visibleSections.value.every((s) => isCollapsed(s.key)),
  );
  const toggleAll = () =>
    (collapsed.value = allCollapsed.value ? [] : visibleSections.value.map((s) => s.key));

  return reactive({
    products,
    highlight,
    hideIdentical,
    visibleSections,
    totalDeltas,
    isCollapsed,
    toggleSection,
    allCollapsed,
    toggleAll,
  });
};
