import { useState, useCallback } from "react";
import axios from "axios";
import { getTokenFromCookie } from "../utils/cookies";

const useHandleOther2Like = () => {
  const [other2Likes, setOther2Likes] = useState({}); // otherLikes を other2Likes に変更
  const token = getTokenFromCookie();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchOther2LikeStatus = useCallback(
    async (other2Id) => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/others2/${other2Id}/liked`, // エンドポイントをothers2に変更
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(other2Id);
        setOther2Likes((prevLikes) => ({
          ...prevLikes,
          [other2Id]: response.data.isLiked,
        }));
      } catch (error) {
        console.error("Failed to fetch like status for other2:", error); // otherをother2に変更
      }
    },
    [API_BASE_URL, token]
  );

  const handleOther2Like = useCallback(
    async (other2Id) => {
      try {
        const isLiked = other2Likes[other2Id] || false; // otherLikes を other2Likes に変更
        const method = isLiked ? "delete" : "post";
        const response = await axios({
          method,
          url: `${API_BASE_URL}/api/others2/${other2Id}/likes`, // エンドポイントをothers2に変更
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOther2Likes((prevLikes) => ({
          ...prevLikes,
          [other2Id]: !isLiked,
        }));
        console.log(response.data);
      } catch (error) {
        console.error("Like action failed for other2:", error); // otherをother2に変更
      }
    },
    [API_BASE_URL, token, other2Likes] // otherLikes を other2Likes に変更
  );

  return { fetchOther2LikeStatus, handleOther2Like, other2Likes }; // otherLikes を other2Likes に変更
};

export default useHandleOther2Like; // 関数名もother2に変更
