import styles from "./ProfileCard.module.scss";
import { useEffect, useState } from "react";
import useHandleLike from "../../hooks/useHandleLike";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import useModal from "../../hooks/useModal";
import useFetchLikers from "../../hooks/useFetchLikers";


const ProfileCard = ({ profileData, API_BASE_URL, isLikePage, toUserId }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const { fetchLikeStatus, handleLike, likes } = useHandleLike();

  const { showModal, renderModal } = useModal();
  const { likers, error, fetchLikers } = useFetchLikers();

  const showLikersModal = async (hobbyId) => {
    const likersList = await fetchLikers(hobbyId);
    showModal(likersList);
  };

  useEffect(() => {
    profileData?.hobbies?.forEach((hobby) => {
      fetchLikeStatus(hobby.id);
    });

    if (profileData?.hobbies) {
      profileData.hobbies.forEach((hobby) => {
        fetchLikers(hobby.id);
      });
    }
  }, [profileData, fetchLikeStatus]);

  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const closeQRModal = () => {
    setIsQRModalOpen(false);
  };

  return (
    <div className={styles["profile__container"]}>
      <div className={styles["profile__sections"]}>
        <dl className={styles["profile__section"]}>
          <dt className={styles["profile__section-title"]}>趣味</dt>
          <div className={styles["profile__section-item-wrapper"]}>
            {profileData.hobbies &&
              profileData.hobbies.map((hobby, index) => (
                <div
                  key={index}
                  className={styles["profile__section-item-wrapper"]}
                >
                  {toUserId || isLikePage ? (
                    // isLikePageがtrueのときの処理
                    <div onClick={() => handleLike(hobby.id)}>
                      <dd className={styles["profile__section-item"]}>
                        {hobby.hobby}
                        {likes[hobby.id] ? <FcLike /> : <FcLikePlaceholder />}
                      </dd>
                    </div>
                  ) : (
                    // isLikePageがfalseのときの処理
                    <dd
                      className={styles["profile__section-item"]}
                      onClick={() => showLikersModal(hobby.id)}
                    >
                      {hobby.hobby}
                      <FcLike />
                    </dd>
                  )}
                </div>
              ))}
            {renderModal()}
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ProfileCard;
