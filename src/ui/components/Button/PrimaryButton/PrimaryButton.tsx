import React from 'react';
import style from './PrimaryButton.css';
import { ButtonProps } from '..';

export function PrimaryButton(props: ButtonProps) {
  const { className, size = 'md', type = 'button', ...rest } = props;
  return (
    <button className={`${style[size]} ${className}`} type={type} {...rest} />
  );
}
