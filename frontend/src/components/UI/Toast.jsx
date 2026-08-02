import { CheckCircle, XCircle, X } from "lucide-react";
import "../../styles/Toast.css";

function Toast({
  message,
  type = "success",
  onClose,
}) {
  if (!message) {
    return null;
  }

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {type === "success" ? (
          <CheckCircle size={18} />
        ) : (
          <XCircle size={18} />
        )}
      </div>

      <span className="toast-message">
        {message}
      </span>

      <button
        type="button"
        className="toast-close"
        onClick={onClose}
      >
        <X size={15} />
      </button>
    </div>
  );
}

export default Toast;