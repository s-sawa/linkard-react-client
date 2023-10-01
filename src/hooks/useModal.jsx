import { useState, useCallback } from "react";
import { Modal } from "antd";
import { Link } from "react-router-dom";
import styles from "./useModal.module.scss";

const useModal = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [isVisible, setIsVisible] = useState(false);
  const [likers, setLikers] = useState([]);

  const showModal = useCallback((likersList) => {
    // likersListが配列でない場合は、コンソールにエラーメッセージを出力
    if (!Array.isArray(likersList)) {
      return;
    }
    setLikers(likersList);
    console.log(likers);
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
        <ul className={styles["modal__list"]}>
          <p>「いいね！」した人</p>
          {likers.map((liker, index) => (
            <li key={index} className={styles["modal__item"]}>
              <Link
                to={`/profile/${liker.id}/preview`}
                onClick={hideModal}
                className={styles["modal__link"]}
              >
                <img
                  src={`${API_BASE_URL}/${liker.profile_image_path}`}
                  alt="Profile"
                  className={styles["modal__image"]}
                />
                <span className={styles["modal__name"]}>{liker.name}</span>
              </Link>
            </li>
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
