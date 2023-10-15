import { createContext, useEffect, useState } from "react";
import axios from "axios";
// import ProfileLink from "../../components/ProfileLink/ProfileLink";
import QRCodeModal from "../../components/QR/QRCodeModal";
import { useNavigate, useParams } from "react-router-dom";
// import "./ProfilePage.css";
import { getTokenFromCookie } from "../../utils/cookies";
import CameraModal from "../../components/CameraModal/CameraModal";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import { BsQrCode } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import styles from "./ProfilePage.module.scss";
import useConfirmModal from "../../hooks/useConfirmModal";
import FollowButton from "../../components/FollowButton/FollowButton";
import { useUser } from "../../components/ContextProvider";

const ProfilePage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const { user, setUser } = useUser();

  const navigate = useNavigate();
  const { user_id } = useParams();
  // useConfirmModal.jsxからreturnされたconfirmModal関数が、confirmModal変数に格納される
  const confirmModal = useConfirmModal();

  const handleScanResult = (result) => {
    if (result) {
      const url = new URL(result);
      const relativePath = url.pathname; // pathname部分を取得して
      // 3つの引数を関数にわたしている
      confirmModal("確認", "フォローページに移動します", () => {
        navigate(relativePath);
      });
    }
  };

  const [profileData, setProfileData] = useState(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const openQRModal = () => {
    setIsQRModalOpen(true);
  };

  const closeQRModal = () => {
    setIsQRModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = getTokenFromCookie();
      let endpoint = "";
      try {
        if (user_id) {
          endpoint = `api/profile/${user_id}/preview`;
        } else {
          endpoint = `api/profile/me`;
        }
        const response = await axios.get(`${API_BASE_URL}/${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data.user);
        setUser(response.data.user);
        console.log(response.data.user);
      } catch (error) {
        console.error("プロフィール情報の取得に失敗しました: ", error);
      }
    };

    fetchData();
  }, [user_id]);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  // if (!profileData.name) {
  //   return (
  //     <div>
  //       <p>プロフィールが未入力です</p>
  //       <button onClick={() => navigate("/profile/setup")}>
  //         プロフィールを入力する
  //       </button>
  //     </div>
  //   );
  // }
  if (!profileData.name) {
    return (
      <div className={styles["profile-setup"]}>
        <p className={styles["profile-setup__text"]}>
          プロフィールが未入力です
        </p>
        <button
          onClick={() => navigate("/profile/setup")}
          className={styles["profile-setup__button"]}
        >
          プロフィールを入力する
        </button>
      </div>
    );
  }

  return (
    <div className={styles["profile-page"]}>
      <div
        className={styles["profile-page__icons-wrapper"]}
        style={{ backgroundColor: profileData.theme_colors.color3 }}
      >
        {!user_id ? (
          <>
            <AiFillEdit
              size={32}
              onClick={() => navigate("./profile/edit")}
              style={{ cursor: "pointer", color: "#4d5156" }}
            />

            <BsQrCode
              size={32}
              onClick={openQRModal}
              style={{ cursor: "pointer", color: "#4d5156" }}
            />
            <CameraModal onScan={handleScanResult} color={"#4d5156"} />
          </>
        ) : (
          <>
            <FollowButton API_BASE_URL={API_BASE_URL} toUserId={user_id} />
          </>
        )}
      </div>
      <ProfileCard
        profileData={profileData}
        API_BASE_URL={API_BASE_URL}
        isLikePage={false}
        toUserId={user_id}
      />
      <QRCodeModal
        isOpen={isQRModalOpen}
        onRequestClose={closeQRModal}
        url={`${BASE_URL}/profile/${profileData.id}/preview`}
      />
    </div>
  );
};

export default ProfilePage;
