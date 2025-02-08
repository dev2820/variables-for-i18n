import { cn } from '@/ui/utils/cn';
import React from 'react';
import { ComponentProps } from 'react';
import styles from './Dialog.css';

type DialogRootProps = ComponentProps<'dialog'>;
function DialogRoot(props: DialogRootProps) {
  const { className, children, ...rest } = props;
  return (
    <dialog className={cn(styles.DialogRoot, className)} {...rest}>
      <div className={styles.DialogContainer}>{children}</div>
    </dialog>
  );
}

type DialogHeaderProps = ComponentProps<'div'>;
function DialogHeader(props: DialogHeaderProps) {
  const { className, ...rest } = props;

  return <div className={cn(styles.DialogHeader, className)} {...rest} />;
}
type DialogBodyProps = ComponentProps<'div'>;
function DialogBody(props: DialogBodyProps) {
  const { className, ...rest } = props;

  return <div className={cn(styles.DialogBody, className)} {...rest} />;
}
type DialogFooterProps = ComponentProps<'div'>;
function DialogFooter(props: DialogFooterProps) {
  const { className, ...rest } = props;

  return <div className={cn(styles.DialogFooter, className)} {...rest} />;
}

type DialogTitleProps = ComponentProps<'h2'>;
function DialogTitle(props: DialogTitleProps) {
  const { className, ...rest } = props;

  return <h2 className={cn(styles.DialogTitle, className)} {...rest} />;
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
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
  Title: DialogTitle,
};
