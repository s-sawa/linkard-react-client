import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FollowButton from "../../components/FollowButton/FollowButton";
import { getTokenFromCookie } from "../../utils/cookies";

const UserProfilePage = ({ userId }) => {
  // ← userIdをpropsとして受け取る
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // const { user_id } = useParams(); ← この行は不要なので削除
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getTokenFromCookie();
        const response = await axios.get(
          `${API_BASE_URL}/api/profile/${userId}/preview`, // ← user_id を userId に置き換え
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfileData(response.data);
      } catch (error) {
        console.error("プロフィール情報の取得に失敗しました: ", error);
      }
    };

    fetchData();
  }, [userId, API_BASE_URL]); // ← 依存配列にuserIdを追加

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>プロフィール</h1>
      {/* <GroupSelection API_BASE_URL={API_BASE_URL} /> */}
      <FollowButton API_BASE_URL={API_BASE_URL} toUserId={userId} />
      <div className="item-content">
        <p className="item-header">ニックネーム:</p>
        <p>{profileData.user.name}</p>
      </div>
      <div className="item-content">
        <p className="item-header">趣味</p>
        {profileData.hobbies.map((hobby, index) => (
          <p key={index}>{hobby.hobby}</p>
        ))}
      </div>
      <div className="item-content">
        <p className="item-header">{profileData.otherData[0].newOtherName}</p>
        {profileData.otherData.map((other, index) => (
          <p key={index}>{other.name}</p>
        ))}
      </div>
      <div className="item-content">
        <p className="item-header">フリー投稿</p>
        {profileData.freePosts[0].image_path && (
          <div>
            <p>{profileData.freePosts[0].title}</p>
            <img
              src={`${API_BASE_URL}/${profileData.freePosts[0].image_path}`}
              alt="フリー画像"
              style={{ width: "100px", height: "100px" }}
            />
            <p>{profileData.freePosts[0].description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
