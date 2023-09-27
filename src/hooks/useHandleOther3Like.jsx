import { useState, useCallback } from "react";
import axios from "axios";
import { getTokenFromCookie } from "../utils/cookies";

const useHandleOther3Like = () => {
  const [other3Likes, setOther3Likes] = useState({});
  const token = getTokenFromCookie();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchOther3LikeStatus = useCallback(
    async (other3Id) => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/others3/${other3Id}/liked`, // エンドポイントをothers3に変更
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(other3Id);
        setOther3Likes((prevLikes) => ({
          ...prevLikes,
          [other3Id]: response.data.isLiked,
        }));
      } catch (error) {
        console.error("Failed to fetch like status for other3:", error); // otherをother3に変更
      }
    },
    [API_BASE_URL, token]
  );

  const handleOther3Like = useCallback(
    async (other3Id) => {
      try {
        const isLiked = other3Likes[other3Id] || false; // otherLikes を other3Likes に変更
        const method = isLiked ? "delete" : "post";
        const response = await axios({
          method,
          url: `${API_BASE_URL}/api/others3/${other3Id}/likes`, // エンドポイントをothers3に変更
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOther3Likes((prevLikes) => ({
          ...prevLikes,
          [other3Id]: !isLiked,
        }));
        console.log(response.data);
      } catch (error) {
        console.error("Like action failed for other3:", error); // otherをother3に変更
      }
    },
    [API_BASE_URL, token, other3Likes] // otherLikes を other3Likes に変更
  );

  return { fetchOther3LikeStatus, handleOther3Like, other3Likes }; // otherLikes を other3Likes に変更
};

export default useHandleOther3Like; // 関数名もother3に変更
