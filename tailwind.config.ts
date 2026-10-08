import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

// Colors resolve from CSS variables (app/assets/css/tailwind.css) so the same
// tokens power the dark (default) and light themes.
const token = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/app.vue",
    "./app/error.vue",
  ],
  theme: {
    extend: {
      colors: {
        ink: token("ink"),
        surface: token("surface"),
        raised: token("raised"),
        line: token("line"),
        paper: token("paper"),
        mute: token("mute"),
        sheet: token("sheet"),
        "sheet-ink": token("sheet-ink"),
        onprimary: token("onprimary"),
        accent: {
          DEFAULT: token("accent"),
          soft: "rgb(var(--c-accent) / 0.12)",
        },
        onaccent: token("onaccent"),
        success: {
          DEFAULT: token("success"),
          soft: "rgb(var(--c-success) / 0.12)",
        },
        cyan: { DEFAULT: token("cyan"), soft: "rgb(var(--c-cyan) / 0.1)" },
        magenta: {
          DEFAULT: token("magenta"),
          soft: "rgb(var(--c-magenta) / 0.12)",
        },
        yellow: {
          DEFAULT: token("yellow"),
          soft: "rgb(var(--c-yellow) / 0.12)",
        },
      },
      fontFamily: {
        display: [
          '"Reem Kufi"',
          '"IBM Plex Sans Arabic"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        sans: [
          '"IBM Plex Sans Arabic"',
          '"IBM Plex Sans"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        xs: ["12px", "1.6"],
        sm: ["14px", "1.7"],
        base: ["16px", "1.7"],
        xl: ["20px", "1.5"],
        "2xl": ["24px", "1.25"],
        "3xl": ["30px", "1.25"],
        "5xl": ["48px", "1.15"],
        "6xl": ["60px", "1.1"],
      },
      borderRadius: { control: "6px", card: "8px", panel: "12px" },
      keyframes: {
        feed: {
          "0%": { transform: "translateY(-78%)" },
          "100%": { transform: "translateY(0)" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Icon motion uses the individual translate/rotate/scale properties so it
        // never fights Tailwind's `transform` utilities (e.g. rtl:-scale-x-100).
        "icon-wiggle": {
          "0%, 100%": { rotate: "0deg" },
          "20%": { rotate: "-14deg" },
          "40%": { rotate: "12deg" },
          "60%": { rotate: "-8deg" },
          "80%": { rotate: "4deg" },
        },
        "icon-bob": {
          "0%, 100%": { translate: "0 0" },
          "40%": { translate: "0 -4px" },
          "70%": { translate: "0 1px" },
        },
        "icon-spin": { from: { rotate: "0deg" }, to: { rotate: "360deg" } },
        "icon-pop": {
          "0%": { scale: "0.4", opacity: "0" },
          "60%": { scale: "1.25", opacity: "1" },
          "100%": { scale: "1" },
        },
      },
      animation: {
        feed: "feed 1.4s cubic-bezier(.22,.8,.3,1) both",
        rise: "rise .25s ease-out both",
        "icon-wiggle": "icon-wiggle .5s ease-in-out",
        "icon-bob": "icon-bob .45s ease-out",
        "icon-spin": "icon-spin .7s cubic-bezier(.22,.8,.3,1)",
        "icon-pop": "icon-pop .3s cubic-bezier(.22,.8,.3,1) both",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
    require("tailwindcss-rtl"),
    // Icon motion system. Icons react when their nearest interactive host
    // (link, button, .group or [data-icon-host]) is hovered or keyboard-focused.
    //   (no class)      gentle scale-up on links/buttons
    //   .icon-nudge     slides toward the reading direction (arrows, chevrons) — RTL aware
    //   .icon-lift      rises slightly
    //   .icon-wiggle    rings/shakes once (user, phone, mail)
    //   .icon-bob       hops once (cart, bag)
    //   .icon-spin      turns once (globe, settings)
    // State changes use the `animate-icon-pop` utility (give the icon a :key).
    // Reduced motion is handled globally in tailwind.css.
    plugin(({ addBase, addComponents, theme }) => {
      const host =
        ":is(a, button, .group, [data-icon-host]):is(:hover, :focus-visible)";
      addBase({
        ":root": { "--icon-dir": "1" },
        '[dir="rtl"]': { "--icon-dir": "-1" },
      });
      addComponents({
        ".icon": {
          transition:
            "translate .2s ease-out, scale .2s ease-out, rotate .2s ease-out",
        },
        [`:is(a, button):is(:hover, :focus-visible):not(:disabled) .icon`]: {
          scale: "1.1",
        },
        [`${host} .icon-nudge`]: { translate: "calc(var(--icon-dir) * 3px) 0" },
        [`${host} .icon-lift`]: { translate: "0 -2px" },
        [`${host} .icon-wiggle`]: { animation: theme("animation.icon-wiggle") },
        [`${host} .icon-bob`]: { animation: theme("animation.icon-bob") },
        [`${host} .icon-spin`]: { animation: theme("animation.icon-spin") },
      });
    }),
  ],
} satisfies Config;
