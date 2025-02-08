import { cn } from '@/ui/utils/cn';
import React from 'react';
import { ComponentProps } from 'react';
import styles from './Dialog.css';

type DialogRootProps = ComponentProps<'dialog'>;
function DialogRoot(props: DialogRootProps) {
  const { className, ...rest } = props;
  return <dialog className={cn(styles.DialogRoot, className)} {...rest} />;
}

type DialogCloseButtonProps = ComponentProps<'button'>;
function DialogCloseButton(props: DialogCloseButtonProps) {
  const { className, ...rest } = props;

  return (
    <button className={cn(styles.DialogCloseButton, className)} {...rest} />
  );
}

export const Dialog = {
  Root: DialogRoot,
  CloseButton: DialogCloseButton,
};
