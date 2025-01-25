import { style } from '@vanilla-extract/css';
import { theme } from '@/ui/theme.css';

const common = style({
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: theme.color.neutral[200],
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});
export default {
  TableRoot: style([
    common,
    {
      textAlign: 'center',
      display: 'table',
      borderCollapse: 'collapse',
      outlineWidth: '1px',
      outlineStyle: 'solid',
      outlineColor: theme.color.neutral[300],
      outlineOffset: '-1px',
    },
  ]),
  TableHead: style([common, { background: theme.color.neutral[100] }]),
  TableRow: style([common]),
  TableHeader: style([common]),
  TableCell: style([common]),
  TableBody: style([common]),
  TableFoot: style([common, { background: theme.color.neutral[100] }]),
};
