import Modal from "react-modal";
import QRCode from "qrcode.react";

const customStyles = {
  content: {
    width: "350px",
    height: "30%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

const QRCodeModal = ({ isOpen, onRequestClose, url }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="QR Code Modal"
    >
      <div>
        <QRCode value={url} size={220} />
      </div>
    </Modal>
  );
};

export default QRCodeModal;
