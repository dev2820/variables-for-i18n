import React, { ComponentProps } from 'react';
import style from './PrimaryBtn.css';

export type ButtonProps = ComponentProps<'button'> & {
  size?: 'sm' | 'md' | 'lg';
};
export function PrimaryBtn(props: ButtonProps) {
  const { className, size = 'md', type = 'button', ...rest } = props;
  return (
    <button className={`${style[size]} ${className}`} type={type} {...rest} />
  );
}
