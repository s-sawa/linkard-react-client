import { useEffect, useState } from "react";
import axios from "axios";
// import ProfileLink from "../../components/ProfileLink/ProfileLink";
import QRCodeModal from "../../components/QR/QRCodeModal";
import { useNavigate } from "react-router-dom";
// import "./ProfilePage.css";
import { getTokenFromCookie } from "../../utils/cookies";
import CameraModal from "../../components/CameraModal/CameraModal";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import { BsQrCode } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import styles from "./ProfilePage.module.scss";
import useConfirmModal from "../../hooks/useConfirmModal";

const ProfilePage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
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
  // const [otherLabel, setOtherLabel] = useState("その他"); // その他の項目名を保持する変数

  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const openQRModal = () => {
    setIsQRModalOpen(true);
  };

  const closeQRModal = () => {
    setIsQRModalOpen(false);
  };
  // const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  useEffect(() => {
    const token = getTokenFromCookie();

    axios
      .get(`${API_BASE_URL}/api/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProfileData(response.data.user);
        console.log(response.data.user);
      })

      .catch((error) => {
        console.error("プロフィール情報の取得に失敗しました: ", error);
      });
  }, []);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  if (!profileData.name) {
    // if (!profileData.hobbies || profileData.hobbies.length === 0) {
    return (
      <div>
        <p>プロフィールが未入力です</p>
        <button onClick={() => navigate("/profile/setup")}>
          プロフィールを入力する
        </button>
      </div>
    );
  }

  return (
    <div className={styles["profile-page"]}>
      <div className={styles["profile-page__icons-wrapper"]}>
        <AiFillEdit size={32} onClick={() => navigate("./profile/edit")} />

        <BsQrCode
          size={32}
          onClick={openQRModal}
          style={{ cursor: "pointer" }}
        />
        <CameraModal onScan={handleScanResult} />
      </div>
      <ProfileCard profileData={profileData} API_BASE_URL={API_BASE_URL} isLikePage={false} />
      <QRCodeModal
        isOpen={isQRModalOpen}
        onRequestClose={closeQRModal}
        url={`${BASE_URL}/profile/${profileData.id}/preview`}
      />
    </div>
  );
};

export default ProfilePage;
