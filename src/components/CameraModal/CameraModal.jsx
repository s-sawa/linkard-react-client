import { useState, useRef } from "react";
import Modal from "react-modal";
import BarcodeScanner from "../QR/BarcodeScanner";
import { BsFillCameraFill } from "react-icons/bs";

Modal.setAppElement("#root");

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
      {/* <button onClick={openModal}>カメラを開始</button> */}
      <BsFillCameraFill
        size={32}
        onClick={openModal}
        style={{ cursor: "pointer", color: color }}
      />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="カメラモーダル"
        style={{
          content: {
            backgroundColor: "white",
            border: "1px solid black",
          },
        }}
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
        <button onClick={closeModal}>閉じる</button>
      </Modal>
    </div>
  );
};

export default CameraModal;
