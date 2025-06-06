import { useEffect, useRef } from 'react';

export const useDialog = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const onClickBackdrop = (event) => {
      const target = event.target as HTMLDialogElement;
      if (target.nodeName === 'DIALOG') {
        dialogRef.current.close();
      }
    };
    if (dialogRef.current) {
      dialogRef.current?.addEventListener('click', onClickBackdrop);
    }

    return () => {
      dialogRef.current?.removeEventListener('click', onClickBackdrop);
    };
  });
  const onClose = () => {
    dialogRef.current?.close();
  };
  return {
    ref: dialogRef,
    onClose,
  };
};
