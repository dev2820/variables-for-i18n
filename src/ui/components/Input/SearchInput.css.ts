import { theme } from '@/ui/theme.css';
import { style } from '@vanilla-extract/css';

export default {
  root: style({
    position: 'relative',
    color: theme.color.neutral[800],
  }),
  input: style({
    width: '100%',
    height: '40px',
    borderColor: theme.color.neutral[300],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: theme.radii.md,
    paddingLeft: '8px',
    paddingRight: '32px',
    fontSize: theme.fontSize.md,
  }),
  icon: style({
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-14px)',
    color: theme.color.neutral[400],
    pointerEvents: 'none',
  }),
};
