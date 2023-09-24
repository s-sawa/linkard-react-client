import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa6";
import styles from "./ProfileCard.module.scss";
import { Divider, Image } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { BsQrCode } from "react-icons/bs";
import { useState } from "react";
import QRCodeModal from "../QR/QRCodeModal";
import CameraModal from "../CameraModal/CameraModal";
import useHandleLike from "../../hooks/useHandleLike";

const ProfileCard = ({ profileData, API_BASE_URL }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const handleLike = useHandleLike();
  const isShowEditButton = location.pathname === "/profile/list";

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

  if (!profileData) return <div>Loading...</div>;

  const imagePath = profileData.profile_image_path
    ? `${API_BASE_URL}/${profileData.profile_image_path}`
    : "";
  const freeImagePath = profileData.free_posts[0].image_path
    ? `${API_BASE_URL}/${profileData.free_posts[0].image_path}`
    : "";
  console.log(profileData.social_links);

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
          {isShowEditButton ? null : (
            <>
              {/* <button
                onClick={() => navigate("./profile/edit")}
                className={styles["profile__edit-button"]}
              >
                aaa
              </button>
              <BsQrCode onClick={openQRModal} style={{ cursor: "pointer" }} />
              <CameraModal onScan={handleScanResult} /> */}
            </>
          )}

          {/* <button
            onClick={() => navigate("./profile/edit")}
            className={styles["profile__edit-button"]}
          >
            aaa
          </button> */}
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
                  <dd className={styles["profile__section-item"]}>
                    {hobby.hobby}
                  </dd>
                  <button onClick={() => handleLike(hobby.id)}>いいね</button>
                </div>
              ))}
          </div>
        </dl>

        <dl className={styles["profile__section"]}>
          <dt className={styles["profile__section-title"]}>
            {profileData.others[0].newOtherName}
          </dt>
          <div className={styles["profile__section-item-wrapper"]}>
            {profileData.others[0].name &&
              profileData.others.map((other, index) => (
                <dd key={index} className={styles["profile__section-item"]}>
                  {other.name}
                </dd>
              ))}
          </div>
        </dl>

        <dl className={styles["profile__section"]}>
          <dt className={styles["profile__section-title"]}>
            {profileData.others2[0].newOtherName2}:
          </dt>
          <div className={styles["profile__section-item-wrapper"]}>
            {profileData.others2 &&
              profileData.others2.map((other, index) => (
                <dd key={index} className={styles["profile__section-item"]}>
                  {other.name}
                </dd>
              ))}
          </div>
        </dl>

        <dl className={styles["profile__section"]}>
          <dt className={styles["profile__section-title"]}>
            {profileData.others3[0].newOtherName3}:
          </dt>
          <div className={styles["profile__section-item-wrapper"]}>
            {profileData.others3 &&
              profileData.others3.map((other, index) => (
                <dd key={index} className={styles["profile__section-item"]}>
                  {other.name}
                </dd>
              ))}
          </div>
        </dl>

        <dl className={styles["profile__section"]}>
          {/* <dt className={styles["profile__section-title"]}>Free Posts:</dt> */}
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

          {profileData.freePosts &&
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
            ))}
        </dl>
      </div>
      <Divider>{}</Divider>
    </div>
  );
};

export default ProfileCard;
