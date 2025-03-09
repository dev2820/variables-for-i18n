import { style, styleVariants } from '@vanilla-extract/css';

export const FlexRow = style({
  flexDirection: 'row',
});
export const FlexCol = style({
  flexDirection: 'column',
});
export const FlexRowReverse = style({
  flexDirection: 'row-reverse',
});
export const FlexCenter = style({
  justifyContent: 'center',
  placeContent: 'center',
});
export const Gap = styleVariants({
  3: {
    gap: 3,
  },
});
export const Display = styleVariants({
  block: {
    display: 'block',
  },
  inline: {
    display: 'inline',
  },
  inlineBlock: {
    display: 'inline-block',
  },
  flex: {
    display: 'flex',
  },
  inlineFlex: {
    display: 'inline-flex',
  },
});
export const Height = styleVariants({
  4: {
    height: 4 * 4,
  },
  6: {
    height: 6 * 4,
  },
  8: {
    height: 8 * 4,
  },
  12: {
    height: 12 * 4,
  },
});

export const Leading = styleVariants({
  4: {
    lineHeight: `${4 * 4}px`,
  },
  6: {
    lineHeight: `${6 * 4}px`,
  },
  8: {
    lineHeight: `${8 * 4}px`,
  },
  12: {
    lineHeight: `${12 * 4}px`,
  },
});
