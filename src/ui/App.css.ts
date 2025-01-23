import { style } from '@vanilla-extract/css';

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
};

export default styles;
