import { style } from '@vanilla-extract/css';
import { theme } from '@/ui/theme.css';
import { FlexRow } from './pattern.css';

const styles = {
  Root: style([
    {
      padding: '1rem',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'scroll',
    },
    {
      fontFamily:
        'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    },
  ]),
  CodeBlock: style({
    margin: 0,
    overflow: 'auto',
    background: '#cccccc',
    color: '#333333',
    position: 'relative',
  }),
  VariablesContainer: style({
    width: '100%',
    flex: '1',
    overflow: 'hidden',
  }),
  VariablesTable: style({
    width: '100%',
    height: '100%',
    tableLayout: 'fixed',
    borderRadius: theme.radii.md,
    overflow: 'auto',
  }),
  VariablesTableHead: style({
    position: 'sticky',
    top: 0,
  }),
  VariablesTableFooter: style({
    position: 'sticky',
    bottom: 0,
  }),
  VariablesModeColumn: style({
    flex: 1,
  }),
  VariablesKeyColumn: style({
    width: '240px',
    maxWidth: '240px',
    minWidth: '240px',
    textAlign: 'left',
  }),
  VariablesDelColumn: style({
    width: '80px',
    maxWidth: '80px',
    minWidth: '80px',
    flex: 'none',
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
  CellKey: style({
    width: '100%',
    maxWidth: '300px',
  }),
  ExtractMenu: style({
    margin: 0,
    paddingLeft: 0,
    listStyleType: 'none',
    display: 'flex',
    flexDirection: 'row',
    gap: 2,
  }),
  SearchInput: style({
    marginBottom: '0.5rem',
  }),
  AddDefaultI18nBtn: style({
    width: '100%',
    height: '40px',
    textAlign: 'center',
    border: 'none',
    background: 'transparent',
    transitionProperty: 'color',
    transitionDuration: '300ms',
    cursor: 'pointer',
    ':hover': {
      background: theme.color.blackAlpha.hover,
    },
    ':active': {
      background: theme.color.blackAlpha.active,
    },
  }),
  CopyJsonButton: style({
    position: 'absolute',
    right: 4,
    top: 4,
  }),
  LanguageOptionsContainer: style([FlexRow]),
  LanguageOptionsInput: style({
    margin: 0,
    marginRight: 4,
  }),
};

export default styles;
