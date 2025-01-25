import { cn } from '@/ui/utils/cn';
import React, { type ComponentProps, type MouseEvent } from 'react';
import styles from './SearchInput.css';
import { SearchIcon } from 'lucide-react';

export type SearchInputProps = Omit<ComponentProps<'input'>, 'type'>;

export function SearchInput(props: SearchInputProps) {
  const { className, ...rest } = props;

  return (
    <div className={styles.root}>
      <input type="search" className={cn(styles.input, className)} {...rest} />
      <SearchIcon className={styles.icon} size={20} />
    </div>
  );
}
