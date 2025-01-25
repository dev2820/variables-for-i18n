import { cn } from '@/ui/utils/cn';
import React, { type ComponentProps } from 'react';
import style from './SearchInput.css';

export type SearchInputProps = Omit<ComponentProps<'input'>, 'type'>;

export function SearchInput(props: SearchInputProps) {
  const { className, ...rest } = props;
  return <input type="search" className={cn(style, className)} {...rest} />;
}
