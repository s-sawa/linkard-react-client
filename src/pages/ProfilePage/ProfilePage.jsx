import { useEffect, useState } from "react";
import axios from "axios";
// import ProfileLink from "../../components/ProfileLink/ProfileLink";
import QRCodeModal from "../../components/QR/QRCodeModal";
import DeleteProfileButton from "../../components/DeleteProfileButton/DeleteProfileButton";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import { getTokenFromCookie } from "../../utils/cookies";
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";
import BarcodeScanner from "../../components/QR/BarcodeScanner";
import CameraModal from "../../components/CameraModal/CameraModal";

const ProfilePage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const [showScanner, setShowScanner] = useState(false);

  const handleScanResult = (result) => {
    console.log("Scanned QR Code:", result); // 読み取ったURLを確認
    setShowScanner(false);

    if (result) {
      const url = new URL(result);
      const relativePath = url.pathname; // pathname部分を取得して
      navigate(relativePath); // navigateに渡す
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
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  useEffect(() => {
    const token = getTokenFromCookie();

    axios
      .get(`${API_BASE_URL}/api/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProfileData(response.data);
        console.log(response.data);
      })

      .catch((error) => {
        console.error("プロフィール情報の取得に失敗しました: ", error);
      });
  }, []);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  if (!profileData.hobbies || profileData.hobbies.length === 0) {
    return (
      <div>
        <p>プロフィールが未入力です。</p>
        <button onClick={() => navigate("/profile/setup")}>
          プロフィールを入力する
        </button>
      </div>
    );
  }

  return (
    <div className="profile-card">
      <div className="profile-header">
        <h1>プロフィール</h1>
        {profileData.user.profile_image_path && (
          <img
            src={`${API_BASE_URL}/${profileData.user.profile_image_path}`}
            alt="プロフィール画像"
          />
        )}
        <div className="item-content">
          <p className="item-header">ニックネーム:</p>
          <p>{profileData.user.name}</p>
        </div>
        <div>
          <p className="item-header">コメント</p>
          <p>{profileData.user.comment}</p>
        </div>
      </div>
      {/* SNS */}
      <div>
        <a
          href="https://twitter.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaXTwitter size={24} />
        </a>
        <a
          href="https://twitter.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook size={24} />
        </a>
        <a
          href="https://twitter.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram size={24} />
        </a>
      </div>
      <button onClick={openQRModal}>QR</button>

      <CameraModal onScan={handleScanResult} />

      <div className="profile-content">
        <div className="item-content">
          <p className="item-header">趣味</p>
          {profileData.hobbies.map((hobby, index) => (
            <span key={index} className="badge">
              {hobby.hobby}
            </span>
          ))}
        </div>

        {/* その他1 */}
        <div className="item-content">
          <p className="item-header">{profileData.otherData[0].newOtherName}</p>
          {profileData.otherData.map((other, index) => (
            <span key={index} className="badge">
              {other.name}
            </span>
          ))}
        </div>

        {/* その他2 */}
        <div className="item-content">
          <p className="item-header">
            {profileData.otherData2[0].newOtherName2}
          </p>
          {profileData.otherData2.map((other, index) => (
            <span key={index} className="badge">
              {other.name}
            </span>
          ))}
        </div>

        {/* その他3 */}
        <div className="item-content">
          <p className="item-header">
            {profileData.otherData3[0].newOtherName3}
          </p>
          {profileData.otherData3.map((other, index) => (
            <span key={index} className="badge">
              {other.name}
            </span>
          ))}
        </div>

        <div className="item-content">
          <p className="item-header">フリー投稿</p>
          {profileData.freePosts[0].image_path && (
            <div>
              <p>{profileData.freePosts[0].title}</p>
              <img
                className="no-style-img"
                src={`${API_BASE_URL}/${profileData.freePosts[0].image_path}`}
                alt="フリー画像"
              />
              <p>{profileData.freePosts[0].description}</p>
            </div>
          )}
        </div>
      </div>
      <div className="profile-actions">
        {/* <ProfileLink username="your-username" /> */}
        <DeleteProfileButton />
      </div>
      <QRCodeModal
        isOpen={isQRModalOpen}
        onRequestClose={closeQRModal}
        url={`${BASE_URL}/profile/${profileData.user.id}/preview`}
      />
    </div>
  );
};

export default ProfilePage;
