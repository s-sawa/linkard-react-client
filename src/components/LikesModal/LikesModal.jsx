import { Modal, List } from "antd";

const LikesModal = ({ likes, onClose }) => {
    console.log(likes)
  return (
    <Modal title="いいねした人" open={true} onCancel={onClose} footer={null}>
      <List
        dataSource={likes}
        renderItem={(like) => (
          <List.Item>
            {/* likeオブジェクトのプロパティに応じて適切に表示を調整してください */}
            <div>{like.name}</div>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default LikesModal;
