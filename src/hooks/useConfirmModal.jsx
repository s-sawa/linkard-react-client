import { Modal } from "antd";

const useConfirmModal = () => {
  const confirmModal = (title, content, onOk) => {
    Modal.confirm({
      title,
      content,
      onOk,
    });
  };

  return confirmModal;
};

export default useConfirmModal;
