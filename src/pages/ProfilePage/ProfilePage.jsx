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
        console.log(response.data.otherData);
        console.log(profileData);
        // console.log(profileData.hobbies[0])
        // console.log(profileData.hobbies);
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
      <p>趣味</p>
      {profileData.hobbies.map((hobby, index) => (
        <p key={index}>{hobby.hobby}</p>
      ))}

      <p>その他aaa</p>
      {profileData.otherData.map((other, index) => (
        <p key={index}>{other.name}</p>
      ))}

      <p>フリー投稿</p>
      {profileData.freePosts[0].image_path && (
        <div>
          <p>{profileData.freePosts[0].title}</p>
          <img
            src={`http://localhost/${profileData.freePosts[0].image_path}`}
            alt="フリー画像"
            style={{ width: "100px", height: "100px" }}
          />
          <p>{profileData.freePosts[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
