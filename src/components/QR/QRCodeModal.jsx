import Modal from "react-modal";
import QRCode from "qrcode.react";
import styles from "./QRCodeModal.module.scss";


const customStyles = {
  content: {
    width: "80vw",
    height: "50%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
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
        {/* <h2>Your Profile QR Code</h2> */}
        <QRCode value={url} size={240} />
      </div>
    </Modal>
  );
};

export default QRCodeModal;
