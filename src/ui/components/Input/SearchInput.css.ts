import { theme } from '@/ui/theme.css';
import { style } from '@vanilla-extract/css';

export default style({
  width: '100%',
  height: '40px',
  borderColor: theme.color.neutral[300],
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: theme.radii.md,
  paddingLeft: '8px',
  fontSize: theme.fontSize.md,
});
