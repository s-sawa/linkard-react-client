import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa6";
import styles from "./ProfileCard.module.scss";
import { useEffect, useState } from "react";
import QRCodeModal from "../QR/QRCodeModal";
import useHandleLike from "../../hooks/useHandleLike";
import useModal from "../../hooks/useModal";
import useFetchLikers from "../../hooks/useFetchLikers";
import useHandleOtherLike from "../../hooks/useHandleOtherLike";
import useFetchOtherLikers from "../../hooks/useFetchOtherLikers";
import useHandleOther2Like from "../../hooks/useHandleOther2Like";
import useFetchOther2Likers from "../../hooks/useFetchOther2Likers";
import useFetchOther3Likers from "../../hooks/useFetchOther3Likers";
import useHandleOther3Like from "../../hooks/useHandleOther3Like";
import { AiOutlineHeart, AiTwotoneHeart } from "react-icons/ai";

const ProfileCard = ({ profileData, API_BASE_URL, isLikePage, toUserId }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  // テーマカラー
  const budgeColor = profileData.theme_colors.color1;
  const backGroundColor = profileData.theme_colors.color2;
  const budgeTextColor =
    profileData.theme_color_id === 1 ||
    profileData.theme_color_id === 2 ||
    profileData.theme_color_id === 3
      ? "#4d5156"
      : "#fff";
  // console.log(budgeTextColor);
  // const bubbleColor = profileData.theme_colors.color1;

  const { fetchLikeStatus, handleLike, likes } = useHandleLike();
  const { fetchOtherLikeStatus, handleOtherLike, otherLikes } =
    useHandleOtherLike();
  const { fetchOther2LikeStatus, handleOther2Like, other2Likes } =
    useHandleOther2Like();
  const { fetchOther3LikeStatus, handleOther3Like, other3Likes } =
    useHandleOther3Like();

  const { showModal, renderModal } = useModal();
  const { fetchLikers } = useFetchLikers();

  const { fetchOtherLikers } = useFetchOtherLikers();
  const { fetchOther2Likers } = useFetchOther2Likers();
  const { fetchOther3Likers } = useFetchOther3Likers();

  const showLikersModal = async (hobbyId) => {
    const likersList = await fetchLikers(hobbyId);
    showModal(likersList);
  };

  const showOtherLikersModal = async (otherId) => {
    const otherLikersList = await fetchOtherLikers(otherId);
    showModal(otherLikersList);
  };
  const showOther2LikersModal = async (other2Id) => {
    const other2LikersList = await fetchOther2Likers(other2Id);
    showModal(other2LikersList);
  };
  const showOther3LikersModal = async (other3Id) => {
    const other3LikersList = await fetchOther3Likers(other3Id);
    showModal(other3LikersList);
  };

  useEffect(() => {
    console.log("useEffect has run!"); // useEffectが実行された時にコンソールに表示される
    console.log("profileData", profileData);
    profileData?.hobbies?.forEach((hobby) => {
      fetchLikeStatus(hobby.id);
    });

    profileData?.others?.forEach((other) => {
      fetchOtherLikeStatus(other.id);
    });

    profileData?.others2?.forEach((other2) => {
      fetchOther2LikeStatus(other2.id);
    });

    profileData?.others3?.forEach((other3) => {
      fetchOther3LikeStatus(other3.id);
    });

    if (profileData?.hobbies) {
      profileData.hobbies.forEach((hobby) => {
        fetchLikers(hobby.id);
      });
    }
  }, [
    profileData,
    fetchLikeStatus,
    fetchOtherLikeStatus,
    fetchOther2LikeStatus,
    fetchOther3LikeStatus,
  ]);

  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const closeQRModal = () => {
    setIsQRModalOpen(false);
  };

  if (!profileData) return <div>Loading...</div>;

  const imagePath = profileData.profile_image_path
    ? `${API_BASE_URL}/${profileData.profile_image_path}`
    : "";
  const freeImagePath = profileData.free_posts[0].image_path
    ? `${API_BASE_URL}/${profileData.free_posts[0].image_path}`
    : "";

  return (
    <div
      className={styles["profile__container"]}
      style={{ backgroundColor: backGroundColor }}
    >
      <div className={styles["profile__sub-container"]}>
        {imagePath && (
          <img
            src={imagePath}
            alt={`${profileData.name}'s profile`}
            // width="100"
            // height="100"
            className={styles["profile__image--my-image"]}
          />
        )}
        <div className={styles["profile__name-icon-container"]}>
          <div className={styles["profile__name-container"]}>
            <div className={styles["profile__name"]}>{profileData.name}</div>
          </div>
          <QRCodeModal
            isOpen={isQRModalOpen}
            onRequestClose={closeQRModal}
            url={`${BASE_URL}/profile/${profileData.id}/preview`}
          />
        </div>

        <div
          className={`${styles["profile__comment"]} ${styles["comment-bubble"]}`}
          style={{ "--bubble-color": budgeColor, color: budgeTextColor }}
        >
          {profileData.comment}
        </div>
        <div className={styles["profile__social-links"]}>
          {profileData.social_links &&
            profileData.social_links.map((link, index) => {
              switch (link.platform) {
                case "facebook":
                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles["profile__link--facebook"]}
                    >
                      <FaFacebook size={30} />
                    </a>
                  );
                case "twitter":
                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles["profile__link--twitter"]}
                    >
                      <FaTwitter size={30} />
                    </a>
                  );
                case "instagram":
                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles["profile__link--instagram"]}
                    >
                      <FaInstagram size={30} />
                    </a>
                  );
                default:
                  return null;
              }
            })}
        </div>
      </div>

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
                    <div onClick={() => handleLike(hobby.id)}>
                      <dd
                        className={styles["profile__section-item"]}
                        style={{
                          backgroundColor: budgeColor,
                          color: budgeTextColor,
                        }}
                      >
                        <span className={styles["profile__section-item__text"]}>
                          {hobby.hobby}
                        </span>
                        {likes[hobby.id] ? (
                          <AiTwotoneHeart style={{ color: "#d862ab" }} />
                        ) : (
                          <AiOutlineHeart />
                        )}
                      </dd>
                    </div>
                  ) : (
                    <dd
                      className={styles["profile__section-item"]}
                      style={{
                        backgroundColor: budgeColor,
                        color: budgeTextColor,
                      }}
                      onClick={() => showLikersModal(hobby.id)}
                    >
                      <span className={styles["profile__section-item__text"]}>
                        {hobby.hobby}
                      </span>
                      {hobby.isLiked ? (
                        <AiTwotoneHeart style={{ color: "#d862ab" }} />
                      ) : (
                        <AiOutlineHeart />
                      )}
                    </dd>
                  )}
                </div>
              ))}
            {renderModal()}
          </div>
        </dl>

        <dl className={styles["profile__section"]}>
          <dt className={styles["profile__section-title"]}>
            {profileData.others[0]?.newOtherName}
          </dt>
          <div className={styles["profile__section-item-wrapper"]}>
            {profileData.others &&
              profileData.others.map((other, index) => (
                <div
                  key={index}
                  className={styles["profile__section-item-wrapper"]}
                >
                  {toUserId || isLikePage ? (
                    <div onClick={() => handleOtherLike(other.id)}>
                      <dd
                        className={styles["profile__section-item"]}
                        style={{
                          backgroundColor: budgeColor,
                          color: budgeTextColor,
                        }}
                      >
                        <span className={styles["profile__section-item__text"]}>
                          {other.name}
                        </span>
                        {otherLikes[other.id] ? (
                          <AiTwotoneHeart style={{ color: "#d862ab" }} />
                        ) : (
                          <AiOutlineHeart />
                        )}
                      </dd>
                    </div>
                  ) : (
                    <dd
                      className={styles["profile__section-item"]}
                      onClick={() => showOtherLikersModal(other.id)}
                      style={{
                        backgroundColor: budgeColor,
                        color: budgeTextColor,
                      }}
                    >
                      <span className={styles["profile__section-item__text"]}>
                        {other.name}
                      </span>
                      {other.isLiked ? (
                        <AiTwotoneHeart style={{ color: "#d862ab" }} />
                      ) : (
                        <AiOutlineHeart />
                      )}
                    </dd>
                  )}
                </div>
              ))}
          </div>
        </dl>

        <dl className={styles["profile__section"]}>
          <dt className={styles["profile__section-title"]}>
            {profileData.others2[0]?.newOtherName2}
          </dt>
          <div className={styles["profile__section-item-wrapper"]}>
            {profileData.others2 &&
              profileData.others2.map((other, index) => (
                <div
                  key={index}
                  className={styles["profile__section-item-wrapper"]}
                >
                  {toUserId || isLikePage ? (
                    <div onClick={() => handleOther2Like(other.id)}>
                      <dd
                        className={styles["profile__section-item"]}
                        style={{
                          backgroundColor: budgeColor,
                          color: budgeTextColor,
                        }}
                      >
                        <span className={styles["profile__section-item__text"]}>
                          {other.name}
                        </span>
                        {other2Likes[other.id] ? (
                          <AiTwotoneHeart style={{ color: "#d862ab" }} />
                        ) : (
                          <AiOutlineHeart />
                        )}
                      </dd>
                    </div>
                  ) : (
                    <dd
                      className={styles["profile__section-item"]}
                      style={{
                        backgroundColor: budgeColor,
                        color: budgeTextColor,
                      }}
                      onClick={() => showOther2LikersModal(other.id)}
                    >
                      <span className={styles["profile__section-item__text"]}>
                        {other.name}
                      </span>
                      {other.isLiked ? (
                        <AiTwotoneHeart style={{ color: "#d862ab" }} />
                      ) : (
                        <AiOutlineHeart />
                      )}
                    </dd>
                  )}
                </div>
              ))}
          </div>
        </dl>

        <dl className={styles["profile__section"]}>
          <dt className={styles["profile__section-title"]}>
            {profileData.others3[0]?.newOtherName3}
          </dt>

          <div className={styles["profile__section-item-wrapper"]}>
            {profileData.others3 &&
              profileData.others3.map((other, index) => (
                <div
                  key={index}
                  className={styles["profile__section-item-wrapper"]}
                >
                  {toUserId || isLikePage ? (
                    <div onClick={() => handleOther3Like(other.id)}>
                      <dd
                        className={styles["profile__section-item"]}
                        style={{
                          backgroundColor: budgeColor,
                          color: budgeTextColor,
                        }}
                      >
                        <span className={styles["profile__section-item__text"]}>
                          {other.name}
                        </span>
                        {other3Likes[other.id] ? (
                          <AiTwotoneHeart style={{ color: "#d862ab" }} />
                        ) : (
                          <AiOutlineHeart />
                        )}
                      </dd>
                    </div>
                  ) : (
                    <dd
                      className={styles["profile__section-item"]}
                      style={{
                        backgroundColor: budgeColor,
                        color: budgeTextColor,
                      }}
                      onClick={() => showOther3LikersModal(other.id)}
                    >
                      <span className={styles["profile__section-item__text"]}>
                        {other.name}
                      </span>
                      {other.isLiked ? (
                        <AiTwotoneHeart style={{ color: "#d862ab" }} />
                      ) : (
                        <AiOutlineHeart />
                      )}
                    </dd>
                  )}
                </div>
              ))}
          </div>
        </dl>

        <dl className={styles["profile__section"]}>
          <dt className={styles["profile__section-subtitle"]}>
            {profileData.free_posts[0].title}
          </dt>
          {freeImagePath && (
            <img
              src={freeImagePath}
              alt={`${profileData.name}'s freeImage`}
              // width="100"
              // height="100"
              className={styles["profile__section--free-post-image"]}
              loading="lazy"
            />
          )}
          <p
            className={styles["profile__section--free-post-image-description"]}
            style={{
              backgroundColor: budgeColor,
              color: budgeTextColor,
            }}
          >
            {profileData.free_posts[0].description}
          </p>
        </dl>
      </div>
    </div>
  );
};

export default ProfileCard;
