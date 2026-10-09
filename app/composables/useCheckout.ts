const KEY: InjectionKey<ReturnType<typeof createCheckout>> = Symbol("checkout");

/**
 * Checkout state. Fields are <LazyVInput> components that register themselves with the
 * vee-validate form created here (by `name`), so each field owns its rules and message.
 * `form` holds the values (they are also read by the summary and review).
 */
const createCheckout = () => {
  const formCtx = useForm();

  const form = reactive({
    email: "",
    phone: "",
    fullName: "",
    company: "",
    line1: "",
    line2: "",
    city: "",
    region: "",
    postal: "",
    country: "US",
    delivery: "crated" as "crated" | "express" | "pickup",
    payment: "card" as "card" | "wire",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    notes: "",
    terms: false,
  });

  /** Which fields a step is responsible for (the names used on the inputs). */
  const fieldsFor = (n: number): string[] => {
    if (n === 1) return ["email", "phone", "fullName", "line1", "city", "region", "postal", "country"];
    if (n === 3) return form.payment === "card" ? ["cardName", "cardNumber", "cardExpiry", "cardCvc"] : [];
    if (n === 4) return ["terms"];
    return [];
  };

  const validateStep = async (n: number) => {
    const results = await Promise.all(fieldsFor(n).map((name) => formCtx.validateField(name)));
    return results.every((r) => r.valid);
  };

  const step = ref(1);
  const completed = ref<number[]>([]);
  const canOpen = (n: number) => n === 1 || completed.value.includes(n - 1);

  // Moving to another step (Continue, Edit, the progress bar) starts at the top of the page,
  // so the new step is in view instead of leaving the user halfway down.
  if (import.meta.client) {
    watch(step, async () => {
      await nextTick();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  const focusFirstError = async () => {
    await nextTick();
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  };

  /** Validates the current step and moves on. Resolves false when something needs fixing. */
  const next = async () => {
    if (!(await validateStep(step.value))) {
      focusFirstError();
      return false;
    }
    if (!completed.value.includes(step.value)) completed.value.push(step.value);
    step.value = Math.min(4, step.value + 1);
    return true;
  };

  const edit = (n: number) => {
    if (canOpen(n)) step.value = n;
  };

  /** First step that still has a problem, or 0 when everything is valid. */
  const firstInvalidStep = async () => {
    for (const n of [1, 3, 4]) if (!(await validateStep(n))) return n;
    return 0;
  };

  return reactive({
    form,
    step,
    completed,
    validateStep,
    next,
    edit,
    canOpen,
    firstInvalidStep,
    focusFirstError,
  });
};

export const provideCheckout = () => {
  const state = createCheckout();
  provide(KEY, state);
  return state;
};

export const useCheckoutState = () => {
  const state = inject(KEY);
  if (!state) throw new Error("useCheckoutState() needs provideCheckout() above it.");
  return state;
};
