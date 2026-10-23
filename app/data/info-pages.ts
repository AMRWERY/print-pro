import type { InfoPage } from "~/types/info";

export const infoPages: InfoPage[] = [
  // Services
  {
    slug: "maintenance-contracts",
    group: "services",
    eyebrow: "Service",
    title: "Maintenance contracts",
    summary:
      "Keep your printers and photocopiers running with scheduled servicing, genuine parts and on-site repairs, for a fixed yearly price.",
    icon: "lucide:wrench",
    facts: [
      { label: "Response", value: "Next working day" },
      { label: "Visits", value: "Scheduled servicing" },
      { label: "Parts", value: "Genuine, included" },
    ],
    sections: [
      {
        heading: "What is covered",
        list: [
          "Scheduled cleaning, checks and wear-part replacement",
          "On-site repairs when something breaks",
          "Genuine replacement parts",
          "Software and driver updates",
        ],
      },
      {
        heading: "How it works",
        body: [
          "Choose a contract when you buy a machine, or add one to a machine you already own. A technician visits on the schedule you agree, and calls out whenever you report a fault.",
          "Report a problem by phone or email and we confirm a visit time. If we cannot fix a machine on site, we provide a loan machine where one is available.",
        ],
      },
      {
        heading: "What is not covered",
        body: [
          "Ink, toner and paper are not part of a maintenance contract. Damage from misuse, spills or unauthorised repair is quoted separately.",
        ],
      },
    ],
    cta: {
      label: "Browse photocopiers",
      to: "/products/photocopiers",
      text: "Photocopiers can be bought with a three-year maintenance contract in one step.",
    },
  },
  {
    slug: "trade-in",
    group: "services",
    eyebrow: "Service",
    title: "Trade-in",
    summary:
      "Put the value of your old printer or photocopier toward a new machine. We assess it, collect it and take care of the swap.",
    icon: "lucide:repeat",
    facts: [
      { label: "Offer", value: "After assessment" },
      { label: "Payout", value: "Credit toward your order" },
      { label: "Collection", value: "Arranged by us" },
    ],
    sections: [
      {
        heading: "What we accept",
        list: [
          "Inkjet and laser printers in working order",
          "A3 and A4 photocopiers and multifunction machines",
          "Large-format printers and plotters",
        ],
      },
      {
        heading: "How the offer is set",
        body: [
          "We grade each machine on its condition, age, page count and included accessories. The offer reflects that grade and current demand, and it stays valid for the period stated in your offer email.",
        ],
      },
      {
        heading: "Steps",
        list: [
          "Tell us the make, model, age and condition of your machine.",
          "We send a provisional range and arrange collection.",
          "We assess the machine and confirm the final offer.",
          "Accept the offer and the credit is applied to your new machine.",
        ],
      },
    ],
    cta: {
      label: "Shop printers",
      to: "/products/printers",
      text: "Already know what you want to upgrade to? Browse the range.",
    },
  },
  {
    slug: "financing",
    group: "services",
    eyebrow: "Service",
    title: "Financing",
    summary:
      "Spread the cost of a photocopier or large printer with a lease or monthly instalments, so you can equip your office without a large upfront payment.",
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
          "Eligible products show a monthly lease price beside the purchase price. A lease keeps your cash free and the machine in use from day one.",
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
      label: "Find machines you can lease",
      to: "/products/photocopiers",
      text: "Look for the lease price on product pages to see what you can finance.",
    },
  },
  {
    slug: "shipping-delivery",
    group: "services",
    eyebrow: "Service",
    title: "Shipping & delivery",
    summary:
      "Ink and toner ship by insured courier. Photocopiers and large printers are delivered, installed and tested by our technicians.",
    icon: "lucide:truck",
    facts: [
      { label: "Supplies", value: "Courier, same-day dispatch" },
      { label: "Machines", value: "Delivery and installation" },
      { label: "Tracking", value: "Every order" },
    ],
    sections: [
      {
        heading: "Ink, toner and small printers",
        body: [
          "Items in stock leave our warehouse the same day when you order before the cut-off time shown at checkout. You receive tracking details as soon as the courier collects your order.",
        ],
      },
      {
        heading: "Photocopiers and large printers",
        body: [
          "Heavy machines are delivered on a pallet and installed by a technician. We contact you to book a delivery window. Please check access, door width and floor space beforehand.",
        ],
      },
      {
        heading: "On delivery",
        list: [
          "Inspect the packaging before signing and note any damage on the delivery receipt.",
          "Report damage or missing items within 48 hours so we can resolve it quickly.",
          "Keep the original packaging for any return.",
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
    slug: "choosing-a-printer",
    group: "guides",
    eyebrow: "Guide",
    title: "Choosing a printer",
    summary:
      "Inkjet, ink tank or laser? A short guide to matching a printer to what you print and how much you print.",
    icon: "lucide:printer",
    sections: [
      {
        heading: "Inkjet or laser",
        body: [
          "Inkjet printers suit colour documents and occasional photos at a low purchase price. Laser printers print text faster and more cheaply per page, which suits offices that print every day.",
        ],
      },
      {
        heading: "Ink tank printers",
        body: [
          "Ink tank models use refillable bottles instead of cartridges. They cost more to buy but much less to run, which makes them a good fit for homes and small offices with steady use.",
        ],
      },
      {
        heading: "What to check before you buy",
        list: [
          "How many pages you print each month",
          "Whether you need colour, and the largest paper size you print on",
          "Automatic two-sided printing, to save paper",
          "Wi-Fi or Ethernet, depending on how people connect",
          "The cost per page of the ink or toner it uses",
        ],
      },
    ],
    cta: {
      label: "Browse printers",
      to: "/products/printers",
      text: "Filter by technology, colour, paper size and connectivity.",
    },
  },
  {
    slug: "choosing-a-photocopier",
    group: "guides",
    eyebrow: "Guide",
    title: "Choosing a photocopier",
    summary:
      "Speed, paper size and finishing: how to pick a photocopier that fits your office without paying for features you will not use.",
    icon: "lucide:copy",
    sections: [
      {
        heading: "Work out your volume",
        body: [
          "Add up the pages your office copies and prints in a month. Choose a machine whose rated monthly duty cycle is comfortably above that number, and a speed that keeps queues short.",
        ],
      },
      {
        heading: "A4 or A3",
        body: [
          "A4 machines are smaller and cheaper. Choose A3 if you copy drawings, spreadsheets or posters, or want to print booklets.",
        ],
      },
      {
        heading: "Features to compare",
        list: [
          "Print and copy speed in pages per minute",
          "Colour or black and white",
          "Scan to email, folder or cloud",
          "Finishing, such as stapling and booklet making",
          "A maintenance contract, which keeps running costs predictable",
        ],
      },
    ],
    cta: {
      label: "Browse photocopiers",
      to: "/products/photocopiers",
      text: "Filter by speed, paper size, colour and functions.",
    },
  },
  {
    slug: "ink-toner-compatibility",
    group: "guides",
    eyebrow: "Guide",
    title: "Ink and toner compatibility",
    summary:
      "Ordering the wrong cartridge is the most common supplies mistake. Here is how to find the right ink or toner for your machine.",
    icon: "lucide:droplets",
    sections: [
      {
        heading: "Find your model name",
        body: [
          "The model name is printed on the front or top of your printer or photocopier. Use the full name, for example Corex Laser 210, not only the brand.",
        ],
      },
      {
        heading: "Check the compatibility list",
        body: [
          "Every ink, toner and drum unit page has a Compatible with list. Your exact model must be on it. If it is not, contact us before you order.",
        ],
      },
      {
        heading: "Standard or high-yield",
        list: [
          "Standard cartridges cost less up front.",
          "High-yield cartridges print more pages and lower the cost of each page.",
          "Colour sets bundle cyan, magenta and yellow in one purchase.",
          "Drum units wear out more slowly than toner and are replaced less often.",
        ],
      },
    ],
    cta: {
      label: "Shop ink and toner",
      to: "/products/inks-toner",
      text: "Filter by type, colour and the brand your machine is made by.",
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
          "You may return unused equipment and supplies in their original, sealed packaging within the return period stated at checkout. Installed machines and special-order items may not be returnable.",
        ],
      },
      {
        heading: "Warranty",
        body: [
          "Equipment carries the manufacturer's warranty. Warranty does not cover damage from misuse, unauthorised repair, non-genuine supplies or normal wear.",
        ],
      },
      {
        heading: "Leasing and services",
        body: [
          "Lease and financing terms are provided when you apply. Maintenance contracts and repairs are quoted before they start.",
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
          "Account details such as your name, company and email",
          "Order, delivery and payment information",
          "Messages you send us and your newsletter preferences",
          "Basic technical data about how the site is used",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "We use your data to process orders, deliver goods, provide support and, if you opted in, send newsletters. We do not sell your personal data.",
        ],
      },
      {
        heading: "Your choices",
        list: [
          "Update your details in your account at any time.",
          "Unsubscribe from newsletters using the link in any email.",
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
        body: ["Questions about your data can be sent to support@printpro.com."],
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
