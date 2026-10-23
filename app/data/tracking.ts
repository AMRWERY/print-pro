import { addWorkingDays, estimatedHandover } from "~/data/order";
import type { StepStatus } from "~/types/order";
import type { Order } from "~/types/order";
import type { TrackStage, TrackEvent, TrackState } from "~/types/track-order";

// There is no carrier feed yet, so tracking is worked out from the order itself and the
// current time: each stage has a planned completion time and "now" decides where it is.

const HOUR = 3_600_000;

const atHour = (d: Date, h: number) => {
  const x = new Date(d);
  x.setHours(h, 0, 0, 0);
  return x;
};

export const trackingStages = (o: Order, now: Date): TrackStage[] => {
  const created = new Date(o.createdAt);
  const pickup = o.delivery.id === "pickup";
  const handover = estimatedHandover(o);

  const t1 = created;
  const t2 = new Date(created.getTime() + 4 * HOUR);
  const t3 = atHour(addWorkingDays(created, 1), 9);
  // Leaves our warehouse the working day before handover (same day for pickup), never before packing is done.
  const dispatch = pickup
    ? handover
    : atHour(addWorkingDays(created, Math.max(1, o.delivery.days - 1)), 8);
  const t4 = new Date(Math.max(dispatch.getTime(), t3.getTime() + 3 * HOUR));
  const t5 = new Date(Math.max(handover.getTime(), t4.getTime() + HOUR));

  const defs: Omit<TrackStage, "status" | "n">[] = [
    {
      key: "auth",
      title: "Order authorized",
      body:
        o.payment.id === "card"
          ? "Payment received and the order registered."
          : "Reservation confirmed; transfer due within 5 business days.",
      at: t1,
    },
    {
      key: "qa",
      title: "Checked & tested",
      body: "Each item is checked against its specification and test-printed or test-run before it is packed.",
      at: t2,
    },
    {
      key: "pack",
      title: "Packed",
      body: "Wrapped and boxed securely, with the machine, power cable and starter supplies.",
      at: t3,
    },
    pickup
      ? {
        key: "ready",
        title: "Ready for pickup",
        body: "Waiting at our Cairo showroom. Bring photo ID and your order number.",
        at: t4,
      }
      : {
        key: "transit",
        title: "In transit",
        body: `${o.delivery.label}: handed to the courier.`,
        at: t4,
      },
    pickup
      ? {
        key: "done",
        title: "Collected",
        body: "Handed over to you.",
        at: t5,
      }
      : {
        key: "done",
        title: "Delivered",
        body: "Handed over to you, signature on delivery.",
        at: t5,
      },
  ];

  let currentFound = false;
  return defs.map((d, i) => {
    const complete = now.getTime() >= d.at.getTime();
    let status: StepStatus = "done";
    if (!complete) {
      status = currentFound ? "queued" : "current";
      currentFound = true;
    }
    return { ...d, n: i + 1, status };
  });
};

export const trackingState = (
  o: Order,
  stages: TrackStage[],
): { state: TrackState; label: string; icon: string } => {
  const current = stages.find((s) => s.status === "current");
  if (!current)
    return {
      state: "delivered",
      label: o.delivery.id === "pickup" ? "Collected" : "Delivered",
      icon: "lucide:package-check",
    };
  if (current.key === "transit")
    return { state: "in-transit", label: "In transit", icon: "lucide:truck" };
  if (current.key === "ready")
    return { state: "ready", label: "Ready for pickup", icon: "lucide:store" };
  return {
    state: "processing",
    label: "Being prepared",
    icon: "lucide:loader-circle",
  };
};

/** Completed stages, newest first. */
export const trackingEvents = (stages: TrackStage[]): TrackEvent[] =>
  stages
    .filter((s) => s.status === "done")
    .map((s) => ({ at: s.at, title: s.title, body: s.body }))
    .reverse();

/** Made-up delivery details, steady for a given order, so the demo looks consistent between visits. */
export const demoTelemetry = (o: Order) => {
  let h = 0;
  for (const c of o.id) h = (h * 31 + c.charCodeAt(0)) % 997;
  return {
    parcels: 1 + (h % 4),
    weightKg: 4 + (h % 40),
    signature: h % 2 === 0,
    insuredPct: 100,
  };
};

export const matchesVerification = (o: Order, value: string) => {
  const v = value.trim().toLowerCase();
  if (!v) return false;
  const norm = (s: string) => s.replace(/\s+/g, "").toLowerCase();
  return (
    norm(o.address.postal) === norm(v) || o.email.trim().toLowerCase() === v
  );
};
