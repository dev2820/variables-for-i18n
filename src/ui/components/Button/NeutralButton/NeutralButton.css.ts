import { theme } from '@/ui/theme.css';
import { style, styleVariants } from '@vanilla-extract/css';

const base = style({
  border: 'none',
  cursor: 'pointer',
  background: theme.color.neutral[200],
  ':hover': {
    background: theme.color.neutral[300],
  },
  ':active': {
    background: theme.color.neutral[400],
  },
  transitionProperty: theme.transitionProperty.colors,
  transitionDuration: theme.duration.normal,
});
const variant = styleVariants({
  sm: [
    base,
    {
      height: 32,
      padding: '0 .75rem',
      borderRadius: theme.radii.sm,
    },
  ],
  md: [
    base,
    {
      height: 40,
      padding: '0 1rem',
      borderRadius: theme.radii.md,
    },
  ],
  lg: [
    base,
    {
      padding: '0 1.25rem',
      height: 48,
      borderRadius: theme.radii.lg,
    },
  ],
});

export default variant;
