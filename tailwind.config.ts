import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        'retro': ['Orbitron', 'monospace'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'neumorphism': '8px 8px 16px #c8c8c8, -8px -8px 16px #ffffff',
        'neumorphism-inset': 'inset 8px 8px 16px #c8c8c8, inset -8px -8px 16px #ffffff',
        'neumorphism-hover': '12px 12px 24px #c0c0c0, -12px -12px 24px #ffffff',
        'neumorphism-pressed': 'inset 4px 4px 8px #c8c8c8, inset -4px -4px 8px #ffffff',
        'neumorphism-small': '4px 4px 8px #c8c8c8, -4px -4px 8px #ffffff',
        'neon': '0 0 20px theme(colors.cyan.400), 0 0 40px theme(colors.cyan.400), 0 0 80px theme(colors.cyan.400)',
        'retro': '0 0 20px theme(colors.pink.500), 0 0 40px theme(colors.pink.500)',
        'zen': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'zen-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'luxury': '0 10px 40px rgba(245, 158, 11, 0.15)',
        'luxury-hover': '0 15px 50px rgba(245, 158, 11, 0.25)',
        'holographic': '0 0 50px rgba(139, 92, 246, 0.3), 0 0 100px rgba(139, 92, 246, 0.2)',
      },
      dropShadow: {
        'neon': '0 0 10px theme(colors.cyan.400)',
        '2xl': '0 25px 25px rgb(0 0 0 / 0.15)',
      },
      backdropBlur: {
        '2xl': '40px',
      },
      backdropSaturate: {
        '180': '1.8',
      },
      animation: {
        // Basic animations
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        
        // Advanced animations
        'float-in': 'floatIn 1s ease-out',
        'soft-bounce': 'softBounce 0.8s ease-out',
        'glitch': 'glitch 2s infinite',
        'holographic': 'holographic 3s ease-in-out infinite',
        'retro-glow': 'retroGlow 2s ease-in-out infinite alternate',
        'liquid-morph': 'liquidMorph 4s ease-in-out infinite',
        'zen-fade': 'zenFade 0.6s ease-out',
        'professional': 'professional 0.5s ease-out',
        'creator-bounce': 'creatorBounce 0.7s ease-out',
        'luxury-float': 'luxuryFloat 3s ease-in-out infinite',
        
        // Matrix and cyberpunk
        'matrix-rain': 'matrixRain 20s linear infinite',
        'scan-lines': 'scanLines 2s linear infinite',
        
        // Gradient animations
        'gradient-shift': 'gradientShift 3s ease-in-out infinite',
        'gradient-mesh': 'gradientMesh 8s ease-in-out infinite',
        
        // Interactive animations
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'rotate-glow': 'rotateGlow 3s linear infinite',
        'breathing': 'breathing 3s ease-in-out infinite',
      },
      keyframes: {
        // Basic keyframes
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        
        // Advanced keyframes
        floatIn: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(30px) rotateX(10deg)',
            filter: 'blur(4px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) rotateX(0deg)',
            filter: 'blur(0px)' 
          },
        },
        softBounce: {
          '0%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(-5px)' },
          '50%': { transform: 'translateY(0)' },
          '75%': { transform: 'translateY(-2px)' },
          '100%': { transform: 'translateY(0)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        holographic: {
          '0%, 100%': { 
            filter: 'hue-rotate(0deg) brightness(1)',
            transform: 'rotateY(0deg)' 
          },
          '25%': { 
            filter: 'hue-rotate(90deg) brightness(1.2)',
            transform: 'rotateY(5deg)' 
          },
          '50%': { 
            filter: 'hue-rotate(180deg) brightness(0.8)',
            transform: 'rotateY(0deg)' 
          },
          '75%': { 
            filter: 'hue-rotate(270deg) brightness(1.2)',
            transform: 'rotateY(-5deg)' 
          },
        },
        retroGlow: {
          '0%': { 
            boxShadow: '0 0 20px theme(colors.pink.500), 0 0 40px theme(colors.pink.500)',
            filter: 'brightness(1)' 
          },
          '100%': { 
            boxShadow: '0 0 30px theme(colors.cyan.400), 0 0 60px theme(colors.cyan.400)',
            filter: 'brightness(1.2)' 
          },
        },
        liquidMorph: {
          '0%, 100%': { borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' },
          '25%': { borderRadius: '58% 42% 75% 25% / 76% 46% 54% 24%' },
          '50%': { borderRadius: '50% 50% 33% 67% / 55% 27% 73% 45%' },
          '75%': { borderRadius: '33% 67% 58% 42% / 63% 68% 32% 37%' },
        },
        zenFade: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        professional: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        creatorBounce: {
          '0%': { transform: 'scale(0.8) rotate(-5deg)', opacity: '0' },
          '50%': { transform: 'scale(1.1) rotate(2deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        luxuryFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        
        // Matrix and cyberpunk
        matrixRain: {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        scanLines: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        
        // Gradient animations
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        gradientMesh: {
          '0%, 100%': { backgroundPosition: '0% 0%' },
          '25%': { backgroundPosition: '100% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '75%': { backgroundPosition: '0% 100%' },
        },
        
        // Interactive animations
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        rotateGlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        breathing: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
        'matrix-rain': 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)',
        'synthwave-grid': 'linear-gradient(rgba(255, 0, 150, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 150, 0.03) 1px, transparent 1px)',
        'scan-lines': 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.03) 2px, rgba(0, 255, 255, 0.03) 4px)',
        'grid-pattern': 'linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        'gradient-mesh': '400% 400%',
        'synthwave-grid': '50px 50px',
        'scan-lines': '100% 4px',
        'grid-pattern': '20px 20px',
      },
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      willChange: {
        'transform-opacity': 'transform, opacity',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Custom plugin for additional utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.transform-gpu': {
          transform: 'translateZ(0)',
        },
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.preserve-3d': {
          transformStyle: 'preserve-3d',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
        '.text-shadow-neon': {
          textShadow: '0 0 10px currentColor',
        },
        '.text-shadow-glow': {
          textShadow: '0 0 20px currentColor, 0 0 40px currentColor',
        },
        // Glassmorphism utilities
        '.glass': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        // Neumorphism utilities
        '.neu-flat': {
          background: '#e0e0e0',
          boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff',
        },
        '.neu-pressed': {
          background: '#e0e0e0',
          boxShadow: 'inset 8px 8px 16px #bebebe, inset -8px -8px 16px #ffffff',
        },
        // Cyberpunk utilities
        '.cyber-border': {
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            padding: '2px',
            background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
            borderRadius: 'inherit',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'subtract',
          },
        },
        // Holographic utilities
        '.holo': {
          background: 'linear-gradient(45deg, #ff0080, #0080ff, #80ff00, #ff8000)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 3s ease-in-out infinite',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
      }
      
      addUtilities(newUtilities)
    },
  ],
};

export default config;



