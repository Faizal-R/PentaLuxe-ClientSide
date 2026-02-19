/**
 * PENTALUXE MIDNIGHT EMERALD THEME
 * A ultra-luxury, deep forest & obsidian palette for elite fragrances
 */

export const pentaluxeTheme = {
  // Primary Colors - Obsidian & Emerald
  background: '#05070a', // Deep obsidian black
  foreground: '#f8fafc', // Crisp white for legibility

  // Card & Container Colors
  card: '#0c1110', // Black with a faint emerald tint
  cardForeground: '#f8fafc',

  // Primary Action Color - Radiant Emerald
  primary: '#10b981', // Vibrant emerald green
  primaryForeground: '#05070a',

  // Secondary Color - Deep Forest
  secondary: '#064e3b', // Rich forest green
  secondaryForeground: '#f8fafc',

  // Muted/Supporting Colors
  muted: '#1e293b', // Slate gray-blue
  mutedForeground: '#94a3b8',

  // Accent Color - Champagne Gold
  accent: '#fbbf24', // Warm gold accent for contrast
  accentForeground: '#05070a',

  // Borders & Dividers
  border: '#131c1b', // Subtle emerald-black border
  borderLight: '#10b981',

  // Input Fields
  input: '#0f171a', // Dark input background
  inputBorder: '#1e293b',

  // Additional Colors
  destructive: '#ef4444', 
  destructiveLight: '#fee2e2',

  // Ring/Focus Color
  ring: '#10b981',

  // Grays for text hierarchy (Tailwind-like)
  gray900: '#05070a',
  gray800: '#111827',
  gray700: '#1f2937',
  gray600: '#374151',
  gray500: '#6b7280',
  gray400: '#9ca3af',
  gray300: '#d1d5db',
  gray200: '#e5e7eb',
  gray100: '#f3f4f6',
  gray50: '#f9fafb',

  // Gradients - The Soul of the Theme
  gradients: {
    heroGradient: 'linear-gradient(135deg, #05070a 30%, #064e3b 100%)',
    emeraldGlow: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
    cardGradient: 'linear-gradient(180deg, rgba(6, 78, 59, 0.2) 0%, rgba(5, 7, 10, 0) 100%)',
    goldGlow: 'linear-gradient(90deg, #fbbf24 0%, #d97706 100%)',
  },

  // Spacing scale
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
    '4xl': '80px',
  },

  // Border radius
  radius: {
    none: '0',
    sm: '2px',
    md: '4px',
    lg: '8px',
    xl: '12px',
    '2xl': '24px',
    full: '9999px',
  },

  // Typography
  fonts: {
    primary: "'Inter', system-ui, -apple-system, sans-serif",
    serif: "'Ovo', 'Playfair Display', serif", // High-end serif for titles
    mono: "'JetBrains Mono', monospace",
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
    emeraldGlow: '0 0 20px rgba(16, 185, 129, 0.2)',
  },

  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Button Reusable Styles
  button: {
    radius: '8px', // Standardized radius for all themed buttons
    padding: '12px 24px',
    transition: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export type PentaluxeTheme = typeof pentaluxeTheme;
