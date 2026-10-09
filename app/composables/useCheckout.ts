const KEY: InjectionKey<ReturnType<typeof createCheckout>> = Symbol("checkout");

const digits = (s: string) => s.replace(/\D/g, "");

// Luhn check: catches most mistyped card numbers before they go anywhere.
const luhn = (num: string) => {
  let sum = 0;
  let alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = Number(num[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};

export const formatCardNumber = (v: string) =>
  digits(v)
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();

export const formatExpiry = (v: string) => {
  const d = digits(v).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

const createCheckout = () => {
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

  const errors = reactive<Record<string, string>>({});

  // Each message says what is wrong and how to fix it (design.md §14).
  const rules: Record<string, () => string> = {
    email: () =>
      !form.email.trim()
        ? "Enter your email so we can send the order confirmation."
        : /^\S+@\S+\.\S+$/.test(form.email.trim())
          ? ""
          : "That email looks incomplete. Use the format studio@example.com.",
    phone: () =>
      digits(form.phone).length >= 7
        ? ""
        : "Enter a phone number the carrier can reach (at least 7 digits).",
    fullName: () =>
      form.fullName.trim().length >= 2
        ? ""
        : "Enter the recipient's full name.",
    line1: () =>
      form.line1.trim() ? "" : "Enter the street address for delivery.",
    city: () => (form.city.trim() ? "" : "Enter the city."),
    region: () =>
      form.region.trim() ? "" : "Enter the state, province or region.",
    postal: () =>
      form.postal.trim().length >= 3 ? "" : "Enter the postal or ZIP code.",
    country: () => (form.country ? "" : "Choose the delivery country."),
    cardName: () =>
      form.cardName.trim()
        ? ""
        : "Enter the name exactly as printed on the card.",
    cardNumber: () => {
      const n = digits(form.cardNumber);
      if (!n) return "Enter the card number.";
      if (n.length < 13 || n.length > 19 || !luhn(n))
        return "That card number doesn't look right. Check each digit.";
      return "";
    },
    cardExpiry: () => {
      const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(form.cardExpiry);
      if (!m) return "Enter the expiry as MM/YY, for example 08/28.";
      const end = new Date(2000 + Number(m[2]), Number(m[1]), 0, 23, 59, 59);
      return end.getTime() < Date.now()
        ? "This card has expired. Use a different card."
        : "";
    },
    cardCvc: () =>
      /^\d{3,4}$/.test(form.cardCvc)
        ? ""
        : "Enter the 3 or 4 digit security code.",
    terms: () => (form.terms ? "" : "Accept the terms to place your order."),
  };

  const fieldsFor = (n: number): string[] => {
    if (n === 1)
      return [
        "email",
        "phone",
        "fullName",
        "line1",
        "city",
        "region",
        "postal",
        "country",
      ];
    if (n === 3)
      return form.payment === "card"
        ? ["cardName", "cardNumber", "cardExpiry", "cardCvc"]
        : [];
    if (n === 4) return ["terms"];
    return [];
  };

  const validate = (field: string) => {
    errors[field] = rules[field]?.() ?? "";
    return !errors[field];
  };
  const validateStep = (n: number) => fieldsFor(n).map(validate).every(Boolean);

  const step = ref(1);

  // Moving to another step (Continue, Edit, the progress bar) starts at the top of the page,
  // so the new step is in view instead of leaving the user halfway down.
  if (import.meta.client) {
    watch(step, async () => {
      await nextTick();
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }
  const completed = ref<number[]>([]);
  const canOpen = (n: number) => n === 1 || completed.value.includes(n - 1);

  const focusFirstError = async () => {
    await nextTick();
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  };

  /** Validates the current step and moves on. Returns false when something needs fixing. */
  const next = () => {
    if (!validateStep(step.value)) {
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
  const firstInvalidStep = () => [1, 3, 4].find((n) => !validateStep(n)) ?? 0;

  // Fixing a field clears its message as soon as the value becomes valid.
  const watchField = (field: string) =>
    watch(
      () => (form as Record<string, unknown>)[field],
      () => {
        if (errors[field]) validate(field);
      },
    );
  Object.keys(rules).forEach(watchField);

  return reactive({
    form,
    errors,
    step,
    completed,
    validate,
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
  if (!state)
    throw new Error("useCheckoutState() needs provideCheckout() above it.");
  return state;
};
