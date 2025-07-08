import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de cores do Infernus
        'infernus-black': '#1A1A1A',
        'infernus-charcoal': '#2C2C2C',
        'infernus-blood': '#8B0000',
        'infernus-gold': '#FFD700',
        'infernus-silver': '#A9A9A9',
        'infernus-indigo': '#4B0082',
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        // Fontes góticas para títulos
        gothic: ['serif'],
        // Fonte padrão para corpo de texto
        body: ['system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-infernal': 'linear-gradient(135deg, #1A1A1A 0%, #2C2C2C 50%, #8B0000 100%)',
        'gradient-fire': 'linear-gradient(45deg, #8B0000 0%, #FF4500 50%, #FFD700 100%)',
      },
      boxShadow: {
        'infernal': '0 4px 20px rgba(139, 0, 0, 0.3)',
        'gold': '0 2px 10px rgba(255, 215, 0, 0.2)',
      },
      animation: {
        'flicker': 'flicker 2s infinite alternate',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 215, 0, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.8)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

