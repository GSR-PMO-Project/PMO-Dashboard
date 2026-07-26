import { Download, X } from "lucide-react";
import "../../styles/QRViewerModal.css";

function QRViewerModal({ attendee, onClose }) {
  if (!attendee) {
    return null;
  }

  function handleDownload() {
    console.log("Download QR:", attendee);

    const qrImage = document.querySelector(".qr-viewer-image");

    if (!qrImage) {
      return;
    }

    const downloadLink = document.createElement("a");

    downloadLink.href = qrImage.src;
    downloadLink.download = `${attendee.code}-qr-code.png`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  const qrValue = encodeURIComponent(attendee.code);

  const qrImageUrl =
    `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${qrValue}`;

  return (
    <div
      className="qr-viewer-overlay"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        className="qr-viewer-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-viewer-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="qr-viewer-header">
          <div>
            <h2 id="qr-viewer-title">Registration QR Code</h2>
            <p>Scan this code to verify the attendee registration.</p>
          </div>

          <button
            type="button"
            className="qr-viewer-close"
            onClick={onClose}
            aria-label="Close QR code"
          >
            <X size={18} />
          </button>
        </div>

        <div className="qr-viewer-content">
          <div className="qr-viewer-code-container">
            <img
              className="qr-viewer-image"
              src={qrImageUrl}
              alt={`QR code for ${attendee.name}`}
            />
          </div>

          <div className="qr-viewer-details">
            <div className="qr-viewer-detail">
              <span>Attendee</span>
              <strong>{attendee.name}</strong>
            </div>

            <div className="qr-viewer-detail">
              <span>Email</span>
              <strong>{attendee.email}</strong>
            </div>

            <div className="qr-viewer-detail">
              <span>Registration Code</span>
              <strong>{attendee.code}</strong>
            </div>

            <div className="qr-viewer-detail">
              <span>Check-in Status</span>

              <strong
                className={`qr-viewer-status ${
                  attendee.checkedIn
                    ? "qr-viewer-checked-in"
                    : "qr-viewer-not-checked-in"
                }`}
              >
                {attendee.checkedIn ? "Checked In" : "Not Yet"}
              </strong>
            </div>
          </div>
        </div>

        <div className="qr-viewer-actions">
          <button
            type="button"
            className="qr-viewer-cancel"
            onClick={onClose}
          >
            Close
          </button>

          <button
            type="button"
            className="primary-button qr-download-button"
            onClick={handleDownload}
          >
            <Download size={15} />
            Download QR
          </button>
        </div>
      </div>
    </div>
  );
}

export default QRViewerModal;