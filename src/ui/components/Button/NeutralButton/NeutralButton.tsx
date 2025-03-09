import React from 'react';
import style from './NeutralButton.css';
import { ButtonProps } from '..';

export function NeutralButton(props: ButtonProps) {
  const { className, size = 'md', type = 'button', ...rest } = props;
  return (
    <button className={`${style[size]} ${className}`} type={type} {...rest} />
  );
}
