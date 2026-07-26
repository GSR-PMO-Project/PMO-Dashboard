import "../../styles/ConfirmDialog.css";

function ConfirmDialog({
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <h3>{title}</h3>

        <p>{message}</p>

        <div className="confirm-actions">
          <button
            type="button"
            className="confirm-cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className="confirm-danger"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;