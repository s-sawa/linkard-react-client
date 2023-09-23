import { Modal } from "antd";

const ConfirmModal = ({ title, content, onOk }) => {
  return Modal.confirm({
    title,
    content,
    onOk,
  });
};

export default ConfirmModal;
