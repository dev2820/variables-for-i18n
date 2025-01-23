import { style } from '@vanilla-extract/css';
import { theme } from '@/ui/theme.css';

const styles = {
  CodeBlock: style({
    padding: 10,
    background: '#cccccc',
    color: '#333333',
  }),
  VariablesTable: style({
    width: '100%',
  }),
  CellEditor: style({
    position: 'absolute',
    left: '-100%',
    top: '-100%',
  }),
  CellDeleteBtn: style({
    border: 'none',
    textDecoration: 'underline',
    width: '100%',
    height: '100%',
    background: 'transparent',
    ':hover': {
      background: theme.color.danger[200],
    },
  }),
};

export default styles;
