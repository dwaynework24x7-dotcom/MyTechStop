"use client";

import { useEffect, useId, useRef } from "react";

type Props = {
  open: boolean;
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ open, title, closeLabel, onClose, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className="text-metal"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className="max-h-[88vh] overflow-y-auto p-5 sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-2xl font-medium tracking-tight text-white">
            {title}
          </h2>
          <CloseButton onClose={onClose} label={closeLabel} />
        </div>
        {children}
      </div>
    </dialog>
  );
}

function CloseButton({ onClose, label }: { onClose: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="grid size-11 shrink-0 place-items-center rounded-full border border-white/15 text-sm"
    >
      <span className="sr-only">{label}</span>
      <span aria-hidden="true">✕</span>
    </button>
  );
}
