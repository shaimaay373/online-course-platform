import "./ConfirmModal.css";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  danger,
  onConfirm,
  onClose,
  busy,
}) {
  if (!open) return null;
  return (
    <div className="inst-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="inst-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="inst-modal-title">{title}</h3>
        {message && <p className="inst-modal-msg">{message}</p>}
        <div className="inst-modal-actions">
          <button type="button" className="inst-btn inst-btn--ghost" onClick={onClose} disabled={busy}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`inst-btn ${danger ? "inst-btn--danger" : "inst-btn--primary"}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
