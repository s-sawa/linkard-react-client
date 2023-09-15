import React from "react";

const ProfileLink = ({ username }) => {
  const profileLink = `http://example.com/profile/${username}`; // プロフィールページへのリンクを設定

  return (
    <div>
      <p>あなたのプロフィールリンク:</p>
      <a href={profileLink} target="_blank" rel="noopener noreferrer">
        {profileLink}
      </a>
    </div>
  );
};

export default ProfileLink;
