import { ComponentProps } from 'react';
import { PrimaryButton } from './PrimaryButton/PrimaryButton';
import { NeutralButton } from './NeutralButton/NeutralButton';

export const Button = {
  Primary: PrimaryButton,
  Neutral: NeutralButton,
};
export type ButtonProps = ComponentProps<'button'> & {
  size?: 'sm' | 'md' | 'lg';
};
