import { createTheme, keyframes } from '@vanilla-extract/css';

const [themeClass, theme] = createTheme({
  color: {
    brand: {
      default: 'oklch(0.723 0.219 149.579)',
      50: 'oklch(0.982 0.018 155.826)',
      100: 'oklch(0.962 0.044 156.743)',
      200: 'oklch(0.925 0.084 155.995)',
      300: 'oklch(0.871 0.15 154.449)',
      400: 'oklch(0.792 0.209 151.711)',
      500: 'oklch(0.723 0.219 149.579)',
      600: 'oklch(0.627 0.194 149.214)',
      700: 'oklch(0.527 0.154 150.069)',
      800: 'oklch(0.448 0.119 151.328)',
      900: 'oklch(0.393 0.095 152.535)',
    },
    neutral: {
      default: 'oklch(0.928 0.006 264.531)',
      50: 'oklch(0.985 0.002 247.839)',
      100: 'oklch(0.967 0.003 264.542)',
      200: 'oklch(0.928 0.006 264.531)',
      300: 'oklch(0.872 0.01 258.338)',
      400: 'oklch(0.707 0.022 261.325)',
      500: 'oklch(0.551 0.027 264.364)',
      600: 'oklch(0.446 0.03 256.802)',
      700: 'oklch(0.373 0.034 259.733)',
      800: 'oklch(0.278 0.033 256.848)',
      900: 'oklch(0.21 0.034 264.665)',
    },
    danger: {
      default: 'oklch(0.637 0.237 25.331)',
      50: 'oklch(0.971 0.013 17.38)',
      100: 'oklch(0.936 0.032 17.717)',
      200: 'oklch(0.885 0.062 18.334)',
      300: 'oklch(0.808 0.114 19.571)',
      400: 'oklch(0.704 0.191 22.216)',
      500: 'oklch(0.637 0.237 25.331)',
      600: 'oklch(0.577 0.245 27.325)',
      700: 'oklch(0.505 0.213 27.518)',
      800: 'oklch(0.444 0.177 26.899)',
      900: 'oklch(0.396 0.141 25.723)',
    },
    blackAlpha: {
      hover: 'rgba(0,0,0,0.08)',
      active: 'rgba(0,0,0,0.16)',
    },
  },
  transitionProperty: {
    colors:
      'color, background-color, border-color, text-decoration-color, fill, stroke',
  },
  duration: {
    fast: '100ms',
    normal: '200ms',
  },
  font: {
    body: 'Inter',
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  fontSize: {
    '6xl': '3.75rem',
    '5xl': '3rem',
    '4xl': '2.25rem',
    '3xl': '1.875rem',
    '2xl': '1.5rem',
    xl: '1.25rem',
    lg: '1.125rem',
    md: '1rem',
    sm: '0.875rem',
    xs: '0.75rem',
  },
  radii: {
    none: '0px',
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.35rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  animation: {
    fadeIn: keyframes({
      from: {
        opacity: 0,
        transform: 'scale(0.9)',
      },
      to: {
        opacity: 1,
        transform: 'scale(1)',
      },
    }),
    fadeOut: keyframes({
      from: {
        opacity: 1,
        transform: 'scale(1)',
      },
      to: {
        opacity: 0,
        transform: 'scale(0.9)',
      },
    }),
  },
});

export { themeClass, theme };
