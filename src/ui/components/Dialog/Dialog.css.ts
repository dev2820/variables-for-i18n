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
      selectors: {
        '&[open]': {
          display: 'flex',
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
};
