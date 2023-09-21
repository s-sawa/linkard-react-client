import { useState } from "react";
import Modal from "react-modal";
import BarcodeScanner from "../QR/BarcodeScanner";

Modal.setAppElement("#root"); // #rootはアプリのルート要素のIDです。

const CameraModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={openModal}>カメラを開始</button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="カメラモーダル"
        style={{
          content: {
            backgroundColor: "white", // 背景色を白に設定
            border: "1px solid black", // 枠線を追加
          },
        }}
      >
        <BarcodeScanner
          onScan={(data) => {
            console.log("Scanned QR Code:", data);
            closeModal(); // QRコードをスキャンした後にモーダルを閉じます
          }}
        />
        <button onClick={closeModal}>閉じる</button>
      </Modal>
    </div>
  );
};

export default CameraModal;
