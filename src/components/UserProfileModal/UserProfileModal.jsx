import Modal from "react-modal";
import UserProfilePage from "../path-to-your-UserProfilePage-file"; // 適切なパスに変更してください

const UserProfileModal = ({ userId, isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="ユーザープロフィールモーダル"
      style={{
        content: {
          backgroundColor: "white", // 背景色を白に設定
          border: "1px solid black", // 枠線を追加
        },
      }}
    >
      <UserProfilePage userId={userId} />
      <button onClick={onRequestClose}>閉じる</button>
    </Modal>
  );
};

export default UserProfileModal;
