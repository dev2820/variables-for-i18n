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
    tableLayout: 'fixed',
  }),
  CellEditor: style({
    position: 'absolute',
    left: '-100%',
    top: '-100%',
  }),
  CellDeleteBtn: style({
    border: 'none',
    textDecoration: 'underline',
    height: '100%',
    background: 'transparent',
    cursor: 'pointer',
    transitionProperty: 'color',
    transitionDuration: '200ms',
    ':hover': {
      color: theme.color.danger[500],
    },
  }),
  CellDeleteHeader: style({
    width: '80px',
    maxWidth: '80px',
    minWidth: '80px',
  }),
  CellKeyHeader: style({
    width: '240px',
    maxWidth: '240px',
    minWidth: '240px',
  }),
  CellKey: style({
    width: '100%',
    maxWidth: '300px',
  }),
};

export default styles;
