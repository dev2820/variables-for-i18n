import React, { type ComponentProps } from 'react';
import { cn } from '@/ui/utils/cn';
import styles from './Table.css';

export type TableRootProps = ComponentProps<'table'>;
const TableRoot = (props: TableRootProps) => {
  const { className, ...rest } = props;
  return <table className={cn(styles.TableRoot, className)} {...rest} />;
};

type TableHeadProps = ComponentProps<'thead'>;
export const TableHead = (props: TableHeadProps) => {
  const { className, ...rest } = props;
  return <thead className={cn(styles.TableHead, className)} {...rest} />;
};

type TableRowProps = ComponentProps<'tr'>;
export const TableRow = (props: TableRowProps) => {
  const { className, ...rest } = props;
  return <tr className={cn(styles.TableRow, className)} {...rest} />;
};

type TableCellProps = ComponentProps<'td'>;
export const TableCell = (props: TableCellProps) => {
  const { className, ...rest } = props;
  return <td className={cn(styles.TableRow, className)} {...rest} />;
};

type TableHeaderProps = ComponentProps<'th'>;
export const TableHeader = (props: TableHeaderProps) => {
  const { className, ...rest } = props;
  return <td className={cn(styles.TableHeader, className)} {...rest} />;
};

type TableBodyProps = ComponentProps<'tbody'>;
export const TableBody = (props: TableBodyProps) => {
  const { className, ...rest } = props;
  return <tbody className={cn(styles.TableBody, className)} {...rest} />;
};

type TableFootProps = ComponentProps<'tfoot'>;
export const TableFoot = (props: TableFootProps) => {
  const { className, ...rest } = props;
  return <tfoot className={cn(styles.TableFoot, className)} {...rest} />;
};

export const Table = {
  Root: TableRoot,
  Head: TableHead,
  Header: TableHeader,
  Row: TableRow,
  Cell: TableCell,
  Body: TableBody,
  Foot: TableFoot,
};
