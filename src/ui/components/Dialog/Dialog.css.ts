import { style } from '@vanilla-extract/css';
import { theme } from '@/ui/theme.css';
export default {
  DialogRoot: style([
    {
      position: 'relative',
      animationName: theme.animation.fadeOut,
      transition: 'display 300ms allow-discrete, overlay 300ms allow-discrete',
      animationDuration: '300ms',
      transitionTimingFunction: 'ease-in',
      animationFillMode: 'forwards',
      width: '100%',
      maxWidth: '544px',
      height: '80%',
      padding: 0,
      selectors: {
        '&[open]': {
          animationName: theme.animation.fadeIn,
        },
        '&::backdrop': {
          background: 'rgba(0,0,0,0.4)',
        },
      },
    },
  ]),
  DialogCloseButton: style({
    position: 'absolute',
    right: '10px',
    top: '10px',
  }),
  DialogContainer: style({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  }),
  DialogHeader: style({
    padding: '1rem 0.5rem',
  }),
  DialogTitle: style({
    margin: 0,
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
  }),
  DialogBody: style({
    padding: '1rem 0.5rem',
    flex: '1',
  }),
  DialogFooter: style({
    padding: '1rem 0.5rem',
    display: 'flex',
    flexDirection: 'row-reverse',
  }),
};
