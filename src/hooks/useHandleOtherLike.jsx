import { useState, useCallback } from "react";
import axios from "axios";
import { getTokenFromCookie } from "../utils/cookies";

const useHandleOtherLike = () => {
  const [otherLikes, setOtherLikes] = useState({}); // likes を otherLikes に変更
  const token = getTokenFromCookie();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchOtherLikeStatus = useCallback(
    async (otherId) => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/others/${otherId}/liked`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOtherLikes((prevLikes) => ({
          // setLikes を setOtherLikes に変更
          ...prevLikes,
          [otherId]: response.data.isLiked,
        }));
      } catch (error) {
        console.error("Failed to fetch like status:", error);
      }
    },
    [API_BASE_URL, token]
  );

  const handleOtherLike = useCallback(
    async (otherId) => {
      try {
        const isLiked = otherLikes[otherId] || false; // likes を otherLikes に変更
        const method = isLiked ? "delete" : "post";
        const response = await axios({
          method,
          url: `${API_BASE_URL}/api/others/${otherId}/likes`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOtherLikes((prevLikes) => ({
          // setLikes を setOtherLikes に変更
          ...prevLikes,
          [otherId]: !isLiked,
        }));
      } catch (error) {
        console.error("Like action failed:", error);
      }
    },
    [API_BASE_URL, token, otherLikes] // likes を otherLikes に変更
  );

  return { fetchOtherLikeStatus, handleOtherLike, otherLikes }; // likes を otherLikes に変更
};

export default useHandleOtherLike;
