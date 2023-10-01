import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa6";
import styles from "./ProfileCard.module.scss";
import { Divider } from "antd";
import { useNavigate, useParams } from "react-router-dom";
// import { BsQrCode } from "react-icons/bs";
import { useEffect, useState } from "react";
import QRCodeModal from "../QR/QRCodeModal";
import useHandleLike from "../../hooks/useHandleLike";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import useModal from "../../hooks/useModal";
import useFetchLikers from "../../hooks/useFetchLikers";
import useHandleOtherLike from "../../hooks/useHandleOtherLike";
import useFetchOtherLikers from "../../hooks/useFetchOtherLikers";
import useHandleOther2Like from "../../hooks/useHandleOther2Like";
import useFetchOther2Likers from "../../hooks/useFetchOther2Likers";
import useFetchOther3Likers from "../../hooks/useFetchOther3Likers";
import useHandleOther3Like from "../../hooks/useHandleOther3Like";

const ProfileCard = ({ profileData, API_BASE_URL, isLikePage, toUserId }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const { fetchLikeStatus, handleLike, likes } = useHandleLike();
  const { fetchOtherLikeStatus, handleOtherLike, otherLikes } =
    useHandleOtherLike();
  const { fetchOther2LikeStatus, handleOther2Like, other2Likes } =
    useHandleOther2Like();
  const { fetchOther3LikeStatus, handleOther3Like, other3Likes } =
    useHandleOther3Like();

  const { showModal, renderModal } = useModal();
  const { likers, error, fetchLikers } = useFetchLikers();

  const { otherLikers, otherError, fetchOtherLikers } = useFetchOtherLikers();
  const { other2Likers, other2Error, fetchOther2Likers } =
    useFetchOther2Likers();
  const { other3Likers, other3Error, fetchOther3Likers } =
    useFetchOther3Likers();

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

  // const { user_id } = useParams();

  useEffect(() => {
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
  const openQRModal = () => {
    setIsQRModalOpen(true);
  };

  const closeQRModal = () => {
    setIsQRModalOpen(false);
  };

  const handleScanResult = (result) => {
    if (result) {
      const url = new URL(result);
      const relativePath = url.pathname; // pathname部分を取得して
      navigate(relativePath); // navigateに渡す
    }
  };
  // console.log(profileData.theme_color.color1);

  if (!profileData) return <div>Loading...</div>;

  const imagePath = profileData.profile_image_path
    ? `${API_BASE_URL}/${profileData.profile_image_path}`
    : "";
  const freeImagePath = profileData.free_posts[0].image_path
    ? `${API_BASE_URL}/${profileData.free_posts[0].image_path}`
    : "";

  return (
    <div className={styles["profile__container"]}>
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
                      {otherLikes[hobby.id] ? (
                        <FcLike />
                      ) : (
                        <FcLikePlaceholder />
                      )}
                      {/* {likers.some((liker) => liker.id === 2) ? (
                        <FcLike />
                      ) : (
                        <FcLikePlaceholder />
                      )} */}

                      {/* {likes1[hobby.id] ? <FcLike /> : <FcLikePlaceholder />} */}
                    </dd>
                  )}
                </div>
              ))}
            {renderModal()} {/* ここでモーダルをレンダリング */}
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
                      <dd className={styles["profile__section-item"]}>
                        {other.name}
                        {otherLikes[other.id] ? (
                          <FcLike />
                        ) : (
                          <FcLikePlaceholder />
                        )}
                      </dd>
                    </div>
                  ) : (
                    <dd
                      className={styles["profile__section-item"]}
                      onClick={() => showOtherLikersModal(other.id)}
                    >
                      {other.name}
                      {otherLikes[other.id] ? (
                        <FcLike />
                      ) : (
                        <FcLikePlaceholder />
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
                      <dd className={styles["profile__section-item"]}>
                        {other.name}
                        {other2Likes[other.id] ? (
                          <FcLike />
                        ) : (
                          <FcLikePlaceholder />
                        )}
                      </dd>
                    </div>
                  ) : (
                    <dd
                      className={styles["profile__section-item"]}
                      onClick={() => showOther2LikersModal(other.id)}
                    >
                      {other.name}
                      {other2Likes[other.id] ? (
                        <FcLike />
                      ) : (
                        <FcLikePlaceholder />
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
                      <dd className={styles["profile__section-item"]}>
                        {other.name}
                        <p></p>
                        {other3Likes[other.id] ? (
                          <FcLike />
                        ) : (
                          <FcLikePlaceholder />
                        )}
                      </dd>
                    </div>
                  ) : (
                    <dd
                      className={styles["profile__section-item"]}
                      onClick={() => showOther3LikersModal(other.id)}
                    >
                      {other.name}
                      {other3Likes[other.id] ? (
                        <FcLike />
                      ) : (
                        <FcLikePlaceholder />
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
              width="100"
              height="100"
              className={styles["profile__section--free-post-image"]}
            />
          )}
          <p
            className={styles["profile__section--free-post-image-description"]}
          >
            {profileData.free_posts[0].description}
          </p>

          {/* {profileData.freePosts &&
            profileData.freePosts.map((post, index) => (
              <div key={index} className={styles["profile__section-post"]}>
                <p className={styles["profile__section-post-title"]}>
                  {post.title}
                </p>
                {post.image_path && (
                  <img
                    src={`${API_BASE_URL}/${post.image_path}`}
                    alt={post.title}
                    className={styles["profile__section-post-image"]}
                  />
                )}
                <p className={styles["profile__section-post-description"]}>
                  {post.description}
                </p>
              </div>
            ))} */}
          <div style={{ color: profileData.theme_colors.color1 }}>
            このテキストの色は{profileData.theme_colors.color1}です。
          </div>
          <div style={{ color: profileData.theme_colors.color2 }}>
            このテキストの色は{profileData.theme_colors.color2}です。
          </div>
        </dl>
      </div>
      <Divider>{}</Divider>
    </div>
  );
};

export default ProfileCard;
