import { defaultReceivingDocks } from "~/data/account";
import type { ReceivingDock } from "~/types/account";

/**
 * Receiving docks (delivery addresses) for the signed-in studio. Kept in this browser; the
 * first time the list is empty it is seeded with the demo docks so the page isn't blank.
 */
export const useDockStore = defineStore("docks", () => {
  // initOnMounted keeps SSR and the first client render identical.
  const docks = useLocalStorage<ReceivingDock[] | null>("account-docks", null, { initOnMounted: true });

  const list = computed(() => docks.value ?? defaultReceivingDocks);

  // Writing always starts from the visible list, so editing the demo docks saves a real copy.
  const write = (next: ReceivingDock[]) => {
    docks.value = next;
  };

  const save = (dock: ReceivingDock) => {
    const next = [...list.value];
    const i = next.findIndex((d) => d.id === dock.id);
    if (i === -1) next.push(dock);
    else next[i] = dock;
    // Only one primary dock.
    write(dock.isPrimary ? next.map((d) => (d.id === dock.id ? d : { ...d, isPrimary: false })) : next);
  };

  const remove = (id: string) => {
    const next = list.value.filter((d) => d.id !== id);
    // Deleting the primary hands the role to the next dock, so one is always primary.
    if (next.length && !next.some((d) => d.isPrimary)) next[0] = { ...next[0]!, isPrimary: true };
    write(next);
  };

  const makePrimary = (id: string) => write(list.value.map((d) => ({ ...d, isPrimary: d.id === id })));

  return { list, save, remove, makePrimary };
});
