import { useState, useRef } from "react";
import Modal from "react-modal";
import BarcodeScanner from "../QR/BarcodeScanner";
import { BsFillCameraFill } from "react-icons/bs";


Modal.setAppElement("#root");

const customStyles = {
  content: {
    width: "350px",
    height: "350px",
    top: "30%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
};

const buttonStyle = {
  padding: "0.5rem",
  backgroundColor: "#a1a3a3",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  fontSize: "1.4rem",
  marginTop: "1rem",
};

const CameraModal = ({ onScan, color }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scannerRef = useRef();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (scannerRef.current) {
      scannerRef.current.stopScan();
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ minHeight: "32px", display: "flex", alignItems: "center" }}>
      <BsFillCameraFill
        size={32}
        onClick={openModal}
        style={{ cursor: "pointer", color: color }}
      />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="カメラモーダル"
        style={customStyles}
      >

        {isModalOpen && (
          <BarcodeScanner
            onScan={(data) => {
              closeModal();
              onScan(data);
            }}
            ref={scannerRef}
          />
        )}
        <button onClick={closeModal} style={buttonStyle}>
          カメラを停止
        </button>
      </Modal>
    </div>
  );
};

export default CameraModal;
