import { TokenTree } from "../@types";

export const defaultTokens: TokenTree = {
  primitive: {
    fontFamily: {
      body: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      // optional:
      heading:
        'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Sans"',
    },
    spacing: {
      px: "1px",
      0: "0px",
      0.5: "0.125rem",
      1: "0.25rem",
      1.5: "0.375rem",
      2: "0.5rem",
      2.5: "0.625rem",
      3: "0.75rem",
      3.5: "0.875rem",
      4: "1rem",
      5: "1.25rem",
      6: "1.5rem",
      7: "1.75rem",
      8: "2rem",
      9: "2.25rem",
      10: "2.5rem",
      11: "2.75rem",
      12: "3rem",
      14: "3.5rem",
      16: "4rem",
      20: "5rem",
      24: "6rem",
      28: "7rem",
      32: "8rem",
      36: "9rem",
      40: "10rem",
      44: "11rem",
      48: "12rem",
      56: "14rem",
      64: "16rem",
      72: "18rem",
      80: "20rem",
      96: "24rem",
    },

    size: {
      auto: "auto",
      full: "100%",
      screen: "100vh",
      min: "min-content",
      max: "max-content",
      fit: "fit-content",
    },

    color: {
      transparent: "transparent",
      black: "#000000",
      white: "#ffffff",

      blue: {
        // Radix
        1: "#fbfdff",
        2: "#f4faff",
        3: "#e6f4fe",
        4: "#d5efff",
        5: "#c2e5ff",
        6: "#acd8fc",
        7: "#8ec8f6",
        8: "#5eb1ef",
        9: "#0090ff",
        10: "#0588f0",
        11: "#0d74ce",
        12: "#113264",

        // Tailwind
        50: "#eff6ff",
        100: "#dbeafe",
        200: "#bfdbfe",
        300: "#93c5fd",
        400: "#60a5fa",
        500: "#3b82f6",
        600: "#2563eb",
        700: "#1d4ed8",
        800: "#1e40af",
        900: "#1e3a8a",
        950: "#172554",
      },

      cyan: {
        // Radix
        1: "#fafdfe",
        2: "#f2fcfd",
        3: "#e7f9fb",
        4: "#d8f3f6",
        5: "#c4eaef",
        6: "#aadee6",
        7: "#84cdda",
        8: "#3db9cf",
        9: "#05a2c2",
        10: "#0894b3",
        11: "#0c7792",
        12: "#04313c",

        // Tailwind
        50: "#ecfeff",
        100: "#cffafe",
        200: "#a5f3fc",
        300: "#67e8f9",
        400: "#22d3ee",
        500: "#06b6d4",
        600: "#0891b2",
        700: "#0e7490",
        800: "#155e75",
        900: "#164e63",
        950: "#083344",
      },

      gray: {
        // Radix
        1: "#fcfcfc",
        2: "#f9f9f9",
        3: "#f0f0f0",
        4: "#e8e8e8",
        5: "#e0e0e0",
        6: "#d9d9d9",
        7: "#cecece",
        8: "#bbbbbb",
        9: "#8d8d8d",
        10: "#838383",
        11: "#646464",
        12: "#202020",

        // Tailwind
        50: "#f9fafb",
        100: "#f3f4f6",
        200: "#e5e7eb",
        300: "#d1d5db",
        400: "#9ca3af",
        500: "#6b7280",
        600: "#4b5563",
        700: "#374151",
        800: "#1f2937",
        900: "#111827",
        950: "#030712",
      },

      green: {
        // Radix
        1: "#fbfefc",
        2: "#f4fbf6",
        3: "#e6f6eb",
        4: "#d6f1df",
        5: "#c4e8d1",
        6: "#adddc0",
        7: "#8eceaa",
        8: "#5bb98c",
        9: "#30a46c",
        10: "#299764",
        11: "#18794e",
        12: "#153226",

        // Tailwind
        50: "#f0fdf4",
        100: "#dcfce7",
        200: "#bbf7d0",
        300: "#86efac",
        400: "#4ade80",
        500: "#22c55e",
        600: "#16a34a",
        700: "#15803d",
        800: "#166534",
        900: "#14532d",
        950: "#052e16",
      },

      indigo: {
        // Radix
        1: "#fdfdfe",
        2: "#f8f9ff",
        3: "#eef0ff",
        4: "#e1e6ff",
        5: "#d2d9ff",
        6: "#c1c8ff",
        7: "#abb4ff",
        8: "#8da4ef",
        9: "#3e63dd",
        10: "#3358d4",
        11: "#3a5bc7",
        12: "#1f2d5c",

        // Tailwind
        50: "#eef2ff",
        100: "#e0e7ff",
        200: "#c7d2fe",
        300: "#a5b4fc",
        400: "#818cf8",
        500: "#6366f1",
        600: "#4f46e5",
        700: "#4338ca",
        800: "#3730a3",
        900: "#312e81",
        950: "#1e1b4b",
      },

      orange: {
        // Radix
        1: "#fefcfb",
        2: "#fff7ed",
        3: "#ffefd6",
        4: "#ffdfb5",
        5: "#ffd19a",
        6: "#ffc182",
        7: "#f5ae73",
        8: "#ec9455",
        9: "#f76808",
        10: "#ed5f00",
        11: "#bd4b00",
        12: "#451e11",

        // Tailwind
        50: "#fff7ed",
        100: "#ffedd5",
        200: "#fed7aa",
        300: "#fdba74",
        400: "#fb923c",
        500: "#f97316",
        600: "#ea580c",
        700: "#c2410c",
        800: "#9a3412",
        900: "#7c2d12",
        950: "#431407",
      },

      pink: {
        // Radix
        1: "#fefcff",
        2: "#fdf7fd",
        3: "#fbebfb",
        4: "#f7def8",
        5: "#f2d1f3",
        6: "#e9c2ec",
        7: "#deade3",
        8: "#d08ccb",
        9: "#d6409f",
        10: "#c2298a",
        11: "#c2298a",
        12: "#651249",

        // Tailwind
        50: "#fdf2f8",
        100: "#fce7f3",
        200: "#fbcfe8",
        300: "#f9a8d4",
        400: "#f472b6",
        500: "#ec4899",
        600: "#db2777",
        700: "#be185d",
        800: "#9d174d",
        900: "#831843",
        950: "#500724",
      },

      purple: {
        // Radix
        1: "#fefcfe",
        2: "#fbf7fe",
        3: "#f7edfe",
        4: "#f2e2fc",
        5: "#ead5f9",
        6: "#e0c4f4",
        7: "#d1afec",
        8: "#be93e4",
        9: "#8e4ec6",
        10: "#8445bc",
        11: "#793aaf",
        12: "#2b0e44",

        // Tailwind
        50: "#faf5ff",
        100: "#f3e8ff",
        200: "#e9d5ff",
        300: "#d8b4fe",
        400: "#c084fc",
        500: "#a855f7",
        600: "#9333ea",
        700: "#7e22ce",
        800: "#6b21a8",
        900: "#581c87",
        950: "#3b0764",
      },

      red: {
        // Radix
        1: "#fffcfc",
        2: "#fff7f7",
        3: "#feebec",
        4: "#ffdbdc",
        5: "#ffcdce",
        6: "#fdbdbe",
        7: "#f4a9aa",
        8: "#eb8e90",
        9: "#e5484d",
        10: "#dc3e42",
        11: "#ce2c31",
        12: "#641723",

        // Tailwind
        50: "#fef2f2",
        100: "#fee2e2",
        200: "#fecaca",
        300: "#fca5a5",
        400: "#f87171",
        500: "#ef4444",
        600: "#dc2626",
        700: "#b91c1c",
        800: "#991b1b",
        900: "#7f1d1d",
        950: "#450a0a",
      },

      magenta: {
        // Radix
        1: "#fefcff",
        2: "#fdf7fd",
        3: "#fbeafb",
        4: "#f7dcf6",
        5: "#f2ccee",
        6: "#e9bae5",
        7: "#dc9ed9",
        8: "#c56ec3",
        9: "#a4009f",
        10: "#9a0095",
        11: "#7f007a",
        12: "#3b003b",
      },

      slate: {
        // Radix (1–12)
        1: "#fcfcfd",
        2: "#f9f9fb",
        3: "#f0f0f3",
        4: "#e8e8ec",
        5: "#e0e1e6",
        6: "#d9d9e0",
        7: "#cdced6",
        8: "#b9bbc6",
        9: "#8b8d98",
        10: "#80838d",
        11: "#60646c",
        12: "#1c2024",

        // Tailwind (50–950)
        50: "#f8fafc",
        100: "#f1f5f9",
        200: "#e2e8f0",
        300: "#cbd5e1",
        400: "#94a3b8",
        500: "#64748b",
        600: "#475569",
        700: "#334155",
        800: "#1e293b",
        900: "#0f172a",
        950: "#020617",
      },

      violet: {
        // Radix
        1: "#fdfcfe",
        2: "#faf8ff",
        3: "#f4f0fe",
        4: "#ebe4ff",
        5: "#e1d9ff",
        6: "#d4caff",
        7: "#c2b5f5",
        8: "#aa99ec",
        9: "#6e56cf",
        10: "#644fc1",
        11: "#5746af",
        12: "#20134b",

        // Tailwind
        50: "#f5f3ff",
        100: "#ede9fe",
        200: "#ddd6fe",
        300: "#c4b5fd",
        400: "#a78bfa",
        500: "#8b5cf6",
        600: "#7c3aed",
        700: "#6d28d9",
        800: "#5b21b6",
        900: "#4c1d95",
        950: "#2e1065",
      },

      yellow: {
        // Radix
        1: "#fdfdf9",
        2: "#fffce8",
        3: "#fffbd1",
        4: "#fff8bb",
        5: "#fef2a4",
        6: "#f9e68c",
        7: "#efd36c",
        8: "#ebbc00",
        9: "#f5d90a",
        10: "#f7ce00",
        11: "#946800",
        12: "#35290f",

        // Tailwind
        50: "#fefce8",
        100: "#fef9c3",
        200: "#fef08a",
        300: "#fde047",
        400: "#facc15",
        500: "#eab308",
        600: "#ca8a04",
        700: "#a16207",
        800: "#854d0e",
        900: "#713f12",
        950: "#422006",
      },
    },

    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
    },

    fontWeight: {
      thin: "100",
      extralight: "200",
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      black: "900",
    },

    lineHeight: {
      none: "1",
      tight: "1.25",
      snug: "1.375",
      normal: "1.5",
      relaxed: "1.625",
      loose: "2",
    },

    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    },

    radius: {
      none: "0px",
      sm: "0.125rem",
      DEFAULT: "0.25rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
      "2xl": "1rem",
      "3xl": "1.5rem",
      full: "9999px",
    },

    borderWidth: { DEFAULT: "1px", 0: "0px", 2: "2px", 4: "4px", 8: "8px" },

    opacity: {
      0: "0",
      5: "0.05",
      10: "0.1",
      20: "0.2",
      25: "0.25",
      30: "0.3",
      40: "0.4",
      50: "0.5",
      60: "0.6",
      70: "0.7",
      75: "0.75",
      80: "0.8",
      90: "0.9",
      95: "0.95",
      100: "1",
    },

    zIndex: {
      auto: "auto",
      0: "0",
      10: "10",
      20: "20",
      30: "30",
      40: "40",
      50: "50",
    },

    shadow: {
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.1)",
      none: "none",
    },

    ringWidth: {
      0: "0px",
      1: "1px",
      2: "2px",
      4: "4px",
    },
    ringOffsetWidth: {
      0: "0px",
      1: "1px",
      2: "2px",
      4: "4px",
    },
    ringColor: {
      DEFAULT: "{semantic.color.focusRing}", // or a primitive fallback
    },
    ringOffsetColor: {
      DEFAULT: "{semantic.color.bg}",
    },
  },

  // ✅ Public/Semantic tokens: these match what plugins will call: theme.token("spacing.md"), etc.
  semantic: {
    fonts: {
      body: 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },

    spacing: {
      xs: "{primitive.spacing.2}",
      sm: "{primitive.spacing.3}",
      md: "{primitive.spacing.4}",
      lg: "{primitive.spacing.6}",
      xl: "{primitive.spacing.8}",
      "2xl": "{primitive.spacing.12}",
    },

    fontSize: {
      xs: "{primitive.fontSize.xs}",
      sm: "{primitive.fontSize.sm}",
      md: "{primitive.fontSize.base}",
      lg: "{primitive.fontSize.lg}",
      xl: "{primitive.fontSize.xl}",
      "2xl": "{primitive.fontSize.2xl}",
      "3xl": "{primitive.fontSize.3xl}",
      "4xl": "{primitive.fontSize.4xl}",
      "5xl": "{primitive.fontSize.5xl}",
    },

    fontWeight: {
      regular: "{primitive.fontWeight.normal}",
      medium: "{primitive.fontWeight.medium}",
      bold: "{primitive.fontWeight.bold}",
    },

    lineHeight: {
      base: "{primitive.lineHeight.normal}",
      tight: "{primitive.lineHeight.tight}",
      relaxed: "{primitive.lineHeight.relaxed}",
    },

    radius: {
      sm: "{primitive.radius.md}",
      md: "{primitive.radius.lg}",
      lg: "{primitive.radius.xl}",
      full: "{primitive.radius.full}",
    },

    border: {
      width: {
        sm: "{primitive.borderWidth.DEFAULT}",
        md: "{primitive.borderWidth.2}",
        lg: "{primitive.borderWidth.4}",
      },
      color: {
        default: "{primitive.color.gray.300}",
        subtle: "{primitive.color.gray.200}",
      },
    },

    color: {
      // these should be overridden per theme (light/dark), but defaults must exist
      text: "{primitive.color.slate.900}",
      textMuted: "{primitive.color.slate.600}",
      background: "{primitive.color.white}",
      surface: "{primitive.color.white}",
      link: "{primitive.color.blue.500}",
      focusRing: "{primitive.color.blue.500}",

      // ✅ add these (used by components + remaining tailwind-compat)
      bgMuted: "{primitive.color.slate.50}",

      primary: "{primitive.color.blue.500}",
      primarySoft: "{primitive.color.blue.100}",
      onPrimary: "{primitive.color.white}",

      // keep focus consistent with focusRing
      focus: "{semantic.color.focusRing}",

      success: "{primitive.color.green.500}",
      successSoft: "{primitive.color.green.100}",

      warning: "{primitive.color.orange.500}",
      warningSoft: "{primitive.color.orange.100}",

      danger: "{primitive.color.red.500}",
      dangerSoft: "{primitive.color.red.100}",

      info: "{primitive.color.cyan.600}",
      infoSoft: "{primitive.color.cyan.100}",
    },
  },
};
