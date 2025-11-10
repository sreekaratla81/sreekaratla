import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        accent: "hsl(var(--accent))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        brand: {
          bg: "hsl(var(--brand-bg))",
          fg: "hsl(var(--brand-fg))",
          ring: "hsl(var(--brand-ring))"
        },
        tech: { DEFAULT: "hsl(var(--tech))" },
        hospitality: { DEFAULT: "hsl(var(--hospitality))" },
        leadership: { DEFAULT: "hsl(var(--leadership))" },
        spirituality: { DEFAULT: "hsl(var(--spirituality))" }
      },
      fontFamily: {
        sans: ["Inter", "var(--font-sans)", "system-ui"],
        serif: ["EB Garamond", "var(--font-serif)", "serif"]
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "65ch",
            color: "hsl(var(--foreground))",
            a: {
              color: "hsl(var(--accent))",
              "&:hover": {
                color: "hsl(var(--accent))"
              }
            }
          }
        }
      }
    }
  },
  plugins: [
    require("@tailwindcss/typography"),
    plugin(({ addVariant }) => {
      addVariant("hocus", ["&:hover", "&:focus-visible"]);
    })
  ]
} satisfies Config;
