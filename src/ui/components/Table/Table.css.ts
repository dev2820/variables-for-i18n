import { style } from '@vanilla-extract/css';
import { theme } from '@/ui/theme.css';

const common = style({
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: theme.color.neutral['200'],
});
export default {
  TableRoot: style([
    common,
    {
      textAlign: 'center',
      display: 'table',
      borderCollapse: 'collapse',
    },
  ]),
  TableHead: style([common, { background: theme.color.neutral['100'] }]),
  TableRow: style([common]),
  TableHeader: style([common]),
  TableCell: style([common]),
  TableBody: style([common]),
};
