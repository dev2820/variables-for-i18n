import React, { ComponentProps } from 'react';
import style from './Button.css';

export type ButtonProps = ComponentProps<'button'>;
export function Button(props: ButtonProps) {
  const { className, type = 'button', ...rest } = props;
  return <button className={`${style} ${className}`} type={type} {...rest} />;
}
