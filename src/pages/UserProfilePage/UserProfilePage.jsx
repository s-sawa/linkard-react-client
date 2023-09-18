import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import FollowButton from "../../components/FollowButton/FollowButton";
import GroupSelection from "../../components/GroupSelection/GroupSelection";


const UserProfilePage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { user_id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [otherLabel, setOtherLabel] = useState("その他"); // その他の項目名を保持する変数

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `${API_BASE_URL}/api/profile/${user_id}/preview`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(user_id);

        setProfileData(response.data);
        console.log(response.data);

        // 取得した項目名を設定
        if (response.data.otherName) {
          setOtherLabel(response.data.otherName);
        }
      } catch (error) {
        console.error("プロフィール情報の取得に失敗しました: ", error);
      }
    };

    fetchData();
  }, []);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>プロフィール</h1>
      {/* <GroupSelection API_BASE_URL={API_BASE_URL} /> */}

      <FollowButton API_BASE_URL={API_BASE_URL} userId={user_id} />
      <p>ニックネーム: {profileData.user.name}</p>
      {profileData.user.profile_image_path && (
        <div>
          <p>プロフィール画像:</p>
          <img
            src={`${API_BASE_URL}/${profileData.user.profile_image_path}`}
            alt="プロフィール画像"
            style={{ width: "100px", height: "100px" }}
          />
        </div>
      )}
      <p>趣味</p>
      {profileData.hobbies.map((hobby, index) => (
        <p key={index}>{hobby.hobby}</p>
      ))}
      <p>{profileData.otherData[0].newOtherName}</p>
      {profileData.otherData.map((other, index) => (
        <p key={index}>{other.name}</p>
      ))}
      <p>フリー投稿</p>
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
  );
};

export default UserProfilePage;
