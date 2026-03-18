import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#02C76A",
        primary: "#050020",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sora: ["Sora", "serif"],
        poppins: ["Poppins", "serif"],
      },
      boxShadow: {
        joinWaitlistBtnShadow:
          "0px -4px 4px 0px rgba(0, 0, 0, 0.2) inset, 0px 4px 4px 0px rgba(225, 225, 225, 0.25) inset, 0px 0px 0px 1px rgba(2, 199, 106, 0.25)",
        ctaShadow:
          "0px -4px 4px 0px #00000033 inset, 0px 4px 4px 0px #E1E1E140 inset",
        subCardShadow: "0px 1px 2px -1px #0000001A, 0px 1px 3px 0px #0000001A",
        verifyMShadow:
          "0px 2.8px 5.6px -2.8px #0000000D, 0px 5.6px 8.4px -1.4px #0000001A, 0px -2.8px 5.6px 0px #0000001A inset",
        authCardShadow:
          "0px 2px 4px -2px #0000000D, 0px 4px 6px -1px #0000001A",
        strimzLogoShadow:
          "0px 25px 40px 0px #02C76A99, 0px -9px 15px 0px #00000033 inset",
        sidebarLinkShadow:
          "0px 2px 4px -2px #0000000D, 0px 4px 6px -1px #0000001A",
        subIconShadow:
          "0px 2px 4px -2px #0000000D, 0px 4px 6px -1px #0000001A, 0px -2px 4px 0px #0000001A inset",
        navbarShadow:
          "0px 1px 2px -1px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1)",
        navCTA: "0px -2px 4px 0px #00000014 inset, 0px 0px 0px 1px #E5E7EB",
        stableShadow:
          "0px 2px 4px -2px #0000000D, 0px 4px 6px -1px #0000001A, 0px -2px 4px 0px #0000001A inset",
      },
      dropShadow: {
        brandShadow: "0px 4px 6px 0px #0000000D, 0px 10px 15px -3px #0000001A",
      },
      keyframes: {
        "custom-ping": {
          "75%, 100%": {
            transform: "scale(1.2)",
            opacity: "0",
          },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "custom-ping": "custom-ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindAnimate],
};
export default config;
