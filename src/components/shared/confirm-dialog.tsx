"use client";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Potvrdiť",
  onConfirm,
  onCancel,
  destructive = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md rounded-lg bg-[var(--card)] p-6 shadow-lg">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm hover:bg-[var(--accent)]"
          >
            Zrušiť
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm text-white ${
              destructive
                ? "bg-[var(--destructive)] hover:opacity-90"
                : "bg-[var(--primary)] hover:opacity-90"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
