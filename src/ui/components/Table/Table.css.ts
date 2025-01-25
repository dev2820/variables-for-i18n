import { style } from '@vanilla-extract/css';
import { theme } from '@/ui/theme.css';

const ellipsis = style({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});
const common = style({
  // borderWidth: '1px',
  // borderStyle: 'solid',
  // borderColor: theme.color.neutral[200],
});

const cell = style({
  borderRightWidth: '0 1px 0 0',
  borderRightStyle: 'solid',
  borderRightColor: theme.color.neutral[200],
  ':last-child': {
    borderRightWidth: '0px',
  },
});
export default {
  TableRoot: style([
    common,
    {
      position: 'relative',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: theme.color.neutral[300],
    },
  ]),
  TableHead: style([
    common,
    { background: theme.color.neutral[100], display: 'flex' },
    {
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: theme.color.neutral[200],
    },
  ]),
  TableRow: style([
    common,
    { width: '100%', display: 'flex' },
    {
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: theme.color.neutral[200],
      ':last-child': {
        borderBottomWidth: '0px',
      },
    },
  ]),
  TableHeader: style([common, ellipsis, cell, { display: 'block' }]),
  TableCell: style([common, ellipsis, cell, { display: 'block' }]),
  TableBody: style([common, { maxHeight: '200px', overflow: 'auto' }]),
  TableFoot: style([
    common,
    {
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: theme.color.neutral[200],
    },
    { background: theme.color.neutral[100], display: 'flex' },
  ]),
};
