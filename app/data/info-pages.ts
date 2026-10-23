import type { InfoPage } from "~/types/info";

export const infoPages: InfoPage[] = [
  // Services
  {
    slug: "bench-calibration",
    group: "services",
    eyebrow: "Service",
    title: "Bench calibration",
    summary:
      "Have a lens, camera body, printer or colorimeter checked and re-aligned on our certified bench, then returned with a written calibration report.",
    icon: "lucide:ruler",
    facts: [
      { label: "Typical turnaround", value: "3–5 working days" },
      { label: "Report", value: "PDF with measured values" },
      { label: "Pick-up", value: "Insured courier available" },
    ],
    sections: [
      {
        heading: "What we check",
        list: [
          "Lens back-focus, centring and aperture accuracy",
          "Sensor and shutter timing on camera bodies",
          "Printer head alignment, nozzle health and feed accuracy",
          "Colorimeter and spectrophotometer response against a reference tile",
        ],
      },
      {
        heading: "How it works",
        body: [
          "Book a slot, send the item in its case with the supplied label, and we confirm receipt by email. Every item is measured before and after adjustment so you can see exactly what changed.",
          "If an item is outside tolerance and cannot be corrected, we tell you before any further work is done and quote the repair separately.",
        ],
      },
      {
        heading: "What you get back",
        body: [
          "Your equipment, a calibration report listing the before and after readings, and a sticker with the next recommended check date.",
        ],
      },
    ],
    cta: {
      label: "Browse calibration tools",
      to: "/products/accessories",
      text: "Prefer to calibrate in your own studio? Colorimeters and spectrophotometers are in stock.",
    },
  },
  {
    slug: "trade-in",
    group: "services",
    eyebrow: "Service",
    title: "Trade-in",
    summary:
      "Put the value of your current cameras, lenses and printers toward new equipment. We assess every item on the bench and give you a clear offer.",
    icon: "lucide:repeat",
    facts: [
      { label: "Offer", value: "After bench assessment" },
      { label: "Payout", value: "Credit toward your order" },
      { label: "Shipping", value: "Prepaid label for approved items" },
    ],
    sections: [
      {
        heading: "Items we accept",
        list: [
          "Digital and film camera bodies",
          "Lenses with working focus and aperture",
          "Fine-art and desktop printers in working order",
          "Studio lighting and calibration tools",
        ],
      },
      {
        heading: "How the offer is set",
        body: [
          "We grade each item on cosmetic condition, working order and included accessories. The offer reflects that grade and current demand, and it stays valid for the period stated in your offer email.",
        ],
      },
      {
        heading: "Steps",
        list: [
          "Tell us what you have, with its condition and any accessories.",
          "We send a provisional range and a prepaid shipping label.",
          "We assess the item on the bench and confirm the final offer.",
          "Accept the offer and the credit is applied to your next order.",
        ],
      },
    ],
    cta: {
      label: "Shop equipment",
      to: "/products",
      text: "Already know what you want to upgrade to? Browse the full range.",
    },
  },
  {
    slug: "studio-financing",
    group: "services",
    eyebrow: "Service",
    title: "Studio financing",
    summary:
      "Spread the cost of professional equipment with a lease or instalment plan, so you can equip a studio without a large upfront payment.",
    icon: "lucide:wallet",
    facts: [
      { label: "Options", value: "Lease or instalments" },
      { label: "Shown on", value: "Products that offer a lease" },
      { label: "Approval", value: "Subject to a credit check" },
    ],
    sections: [
      {
        heading: "Lease",
        body: [
          "Eligible products show a monthly lease price beside the purchase price. A lease keeps your cash free and the equipment in use from day one.",
        ],
      },
      {
        heading: "Instalments",
        body: [
          "Split a purchase into fixed monthly payments. The full cost, including any fees, is shown before you confirm.",
        ],
      },
      {
        heading: "Before you apply",
        list: [
          "Have your business or personal details ready.",
          "Check the total you will repay, not only the monthly figure.",
          "Financing is subject to approval and is not available on every product.",
        ],
      },
    ],
    cta: {
      label: "Find financed equipment",
      to: "/products",
      text: "Look for the lease price on product pages to see what you can finance.",
    },
  },
  {
    slug: "shipping-freight",
    group: "services",
    eyebrow: "Service",
    title: "Shipping & freight",
    summary:
      "Small items travel by insured courier. Large-format printers and heavy equipment ship by freight with scheduled delivery.",
    icon: "lucide:truck",
    facts: [
      { label: "Parcels", value: "Insured courier" },
      { label: "Large equipment", value: "Scheduled freight" },
      { label: "Tracking", value: "Every order" },
    ],
    sections: [
      {
        heading: "Parcels",
        body: [
          "Cameras, lenses, inks, paper and accessories ship by insured courier. You receive tracking details as soon as your order leaves our warehouse.",
        ],
      },
      {
        heading: "Freight",
        body: [
          "Large-format printers and other heavy items ship on a pallet. We contact you to book a delivery window, and you should check access, door width and floor space beforehand.",
        ],
      },
      {
        heading: "On delivery",
        list: [
          "Inspect the packaging before signing and note any damage on the delivery receipt.",
          "Report damage or missing items within 48 hours so we can resolve it quickly.",
          "Keep the original packaging for any return or calibration visit.",
        ],
      },
    ],
    cta: {
      label: "Track an order",
      to: "/track",
      text: "Already ordered? Enter your order number to see where it is.",
    },
  },

  // Guides
  {
    slug: "icc-profiling",
    group: "guides",
    eyebrow: "Guide",
    title: "ICC profiling",
    summary:
      "An ICC profile describes how a device reproduces colour, so a print matches what you saw on screen. Here is how profiling works and when you need a custom one.",
    icon: "lucide:palette",
    sections: [
      {
        heading: "What a profile does",
        body: [
          "Every printer, paper and ink combination reproduces colour a little differently. A profile records that behaviour so your software can compensate and keep colours consistent.",
        ],
      },
      {
        heading: "Generic or custom",
        body: [
          "Paper makers publish generic profiles that are a good starting point. A custom profile is measured from your own printer and paper, so it also captures batch and wear differences.",
        ],
      },
      {
        heading: "Getting a good result",
        list: [
          "Print the test chart with colour management turned off.",
          "Let the print dry fully before measuring it.",
          "Measure with a spectrophotometer and a consistent light source.",
          "Re-profile when you change paper or ink, and after long periods of use.",
        ],
      },
    ],
    cta: {
      label: "Browse calibration tools",
      to: "/products/accessories",
      text: "Spectrophotometers and colorimeters for building your own profiles.",
    },
  },
  {
    slug: "medium-format-film",
    group: "guides",
    eyebrow: "Guide",
    title: "Medium format film",
    summary:
      "Larger negatives give finer detail and smoother tones. A short guide to formats and what to consider before you start shooting medium format.",
    icon: "lucide:film",
    sections: [
      {
        heading: "Why medium format",
        body: [
          "A larger negative records more detail and a gentler transition between tones. Many portrait, landscape and studio photographers choose it for that look.",
        ],
      },
      {
        heading: "Common formats",
        list: [
          "6×4.5 for the most frames per roll",
          "6×6 square, with no need to rotate the camera",
          "6×7 for large, detailed prints",
          "6×9 for wide, panoramic-style frames",
        ],
      },
      {
        heading: "Before you buy",
        list: [
          "Choose a camera system with lenses you can grow into.",
          "Plan how you will develop and scan your film.",
          "Store film cool and process it soon after exposure.",
        ],
      },
    ],
    cta: {
      label: "Browse cameras",
      to: "/products/cameras",
      text: "See the medium format cameras we stock.",
    },
  },
  {
    slug: "calibration",
    group: "guides",
    eyebrow: "Guide",
    title: "Calibration",
    summary:
      "Calibration keeps your screen, printer and lenses telling the truth. This guide covers what to calibrate, how often, and the tools you need.",
    icon: "lucide:sliders-horizontal",
    sections: [
      {
        heading: "What to calibrate",
        list: [
          "Your monitor, so what you edit is what you see",
          "Your printer, so prints match the screen",
          "Your lenses and bodies, so focus is accurate",
        ],
      },
      {
        heading: "How often",
        body: [
          "Monitors drift slowly, so check them about once a month. Re-calibrate printers when you change paper or ink, and after a long idle period. Have lenses and bodies checked once a year, or after a knock.",
        ],
      },
      {
        heading: "Tools you need",
        list: [
          "A colorimeter or spectrophotometer for screens and prints",
          "A neutral, controlled light for viewing prints",
          "A bench calibration visit for optical equipment",
        ],
      },
    ],
    cta: {
      label: "Book bench calibration",
      to: "/services/bench-calibration",
      text: "Let us check your optical equipment on the bench.",
    },
  },

  // Legal
  {
    slug: "equipment-terms",
    group: "legal",
    eyebrow: "Legal",
    title: "Equipment terms",
    summary:
      "The terms that apply when you buy, lease, return or have equipment serviced with PrintPro.",
    icon: "lucide:file-text",
    updated: "1 January 2026",
    sections: [
      {
        heading: "Orders and prices",
        body: [
          "An order is accepted when we confirm it by email. Prices are shown before you pay, and we correct clear pricing errors before shipping.",
        ],
      },
      {
        heading: "Delivery and risk",
        body: [
          "Risk passes to you on delivery. Inspect goods on arrival and report damage or missing items within 48 hours.",
        ],
      },
      {
        heading: "Returns",
        body: [
          "You may return unused equipment in its original packaging within the return period stated at checkout. Custom-profiled or made-to-order items may not be returnable.",
        ],
      },
      {
        heading: "Warranty",
        body: [
          "Equipment carries the manufacturer's warranty. Warranty does not cover damage from misuse, unauthorised repair or normal wear.",
        ],
      },
      {
        heading: "Leasing and services",
        body: [
          "Lease and financing terms are provided when you apply. Service and calibration work is quoted before it starts.",
        ],
      },
    ],
    cta: {
      label: "Read the privacy policy",
      to: "/legal/privacy",
      text: "See how we handle your personal data.",
    },
  },
  {
    slug: "privacy",
    group: "legal",
    eyebrow: "Legal",
    title: "Privacy",
    summary:
      "What personal data we collect, why we collect it, and the choices you have.",
    icon: "lucide:shield-check",
    updated: "1 January 2026",
    sections: [
      {
        heading: "What we collect",
        list: [
          "Account details such as your name, studio and email",
          "Order, delivery and payment information",
          "Messages you send us and your newsletter preferences",
          "Basic technical data about how the site is used",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "We use your data to process orders, deliver goods, provide support and, if you opted in, send bulletins. We do not sell your personal data.",
        ],
      },
      {
        heading: "Your choices",
        list: [
          "Update your details in your account at any time.",
          "Unsubscribe from bulletins using the link in any email.",
          "Ask us to export or delete your data.",
        ],
      },
      {
        heading: "Cookies and storage",
        body: [
          "We store a few preferences on your device, such as theme, language, cart and wishlist, so the site works as you left it.",
        ],
      },
      {
        heading: "Contact",
        body: ["Questions about your data can be sent to bench@printpro.com."],
      },
    ],
    cta: {
      label: "Read the equipment terms",
      to: "/legal/equipment-terms",
      text: "See the terms that apply to your orders.",
    },
  },
];

export const findInfoPage = (group: InfoPage["group"], slug: string) =>
  infoPages.find((p) => p.group === group && p.slug === slug);
