import Modal from "./Modal";

function ConfirmDialog({
  isOpen,
  title = "Confirm action",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger", // "danger" | "default"
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <Modal onClose={onCancel} title={title}>
      <p className="confirm-message">{message}</p>
      <div className="confirm-actions">
        <button className="btn-draft" onClick={onCancel}>
          {cancelLabel}
        </button>
        <button
          className={variant === "danger" ? "btn-delete" : "btn-publish"}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;