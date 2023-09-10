import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");

    axios
      .get("http://localhost/api/profile/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProfileData(response.data);
        // console.log(response.data.hobbies[0].name);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("プロフィール情報の取得に失敗しました: ", error);
      });
  }, []);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>プロフィール</h1>
      <p>ニックネーム: {profileData.user.name}</p>
      <p>Email: {profileData.user.email}</p>
      <p>
        趣味:{" "}
        {profileData.hobbies && profileData.hobbies.length > 0
          ? profileData.hobbies[0].name
          : "情報なし"}
      </p>
      {profileData.user.profile_image_path && (
        <div>
          <p>プロフィール画像:</p>
          <img
            src={`http://localhost/${profileData.user.profile_image_path}`}
            alt="プロフィール画像"
            style={{ width: "100px", height: "100px" }}
          />
        </div>
      )}
      {/* 他のプロフィール情報を表示 */}
    </div>
  );
};

export default ProfilePage;
