import React, { useState, useCallback } from "react";
import { Modal } from "antd"; // antdからModalをインポート

const useModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [likers, setLikers] = useState([]);

  const showModal = useCallback((likersList) => {
    // likersListが配列でない場合は、コンソールにエラーメッセージを出力
    if (!Array.isArray(likersList)) {
      console.error("likersList is not an array:", likersList);
      return;
    }
    setLikers(likersList);
    setIsVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsVisible(false);
    setLikers([]);
  }, []);

  // ここでModalコンポーネントを返す
  const renderModal = () => {
    // likersが配列でない場合は、コンソールにエラーメッセージを出力してnullを返す
    if (!Array.isArray(likers)) {
      return null;
    }

    return (
      <Modal open={isVisible} onCancel={hideModal} footer={null}>
        <ul>
          {likers.map((liker, index) => (
            <li key={index}>{liker.name}</li>
          ))}
        </ul>
      </Modal>
    );
  };

  return {
    isVisible,
    likers,
    showModal,
    hideModal,
    renderModal, // renderModalも返す
  };
};

export default useModal;
