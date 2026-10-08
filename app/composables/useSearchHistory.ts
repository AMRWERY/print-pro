export interface SavedSearch {
  q: string;
  at: string;
}

const MAX_RECENT = 5;

/** Recent and saved searches, kept in this browser only. */
export const useSearchHistory = () => {
  // initOnMounted keeps SSR and the first client render identical (both empty).
  const recent = useLocalStorage<string[]>("recent-searches", [], {
    initOnMounted: true,
  });
  const saved = useLocalStorage<SavedSearch[]>("saved-searches", [], {
    initOnMounted: true,
  });

  const add = (q: string) => {
    const term = q.trim();
    if (!term) return;
    recent.value = [
      term,
      ...recent.value.filter((r) => r.toLowerCase() !== term.toLowerCase()),
    ].slice(0, MAX_RECENT);
  };

  const clearRecent = () => (recent.value = []);

  const isSaved = (q: string) =>
    saved.value.some((s) => s.q.toLowerCase() === q.trim().toLowerCase());

  const save = (q: string) => {
    const term = q.trim();
    if (!term || isSaved(term)) return;
    saved.value = [{ q: term, at: new Date().toISOString() }, ...saved.value];
  };

  const remove = (q: string) =>
    (saved.value = saved.value.filter((s) => s.q !== q));

  return { recent, saved, add, clearRecent, isSaved, save, remove };
};
