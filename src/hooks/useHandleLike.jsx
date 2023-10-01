import { useState, useCallback } from "react";
import axios from "axios";
import { getTokenFromCookie } from "../utils/cookies";

const useHandleLike = () => {
  const [likes, setLikes] = useState({}); // 各hobbyIdのいいね状態を管理するオブジェクト
  const token = getTokenFromCookie();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchLikeStatus = useCallback(
    async (hobbyId) => {
      console.log("fetchLikeStatus is called with hobbyId:", hobbyId); // 関数が呼び出された際のhobbyIdを表示

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/hobbies/${hobbyId}/liked`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLikes((prevLikes) => ({
          ...prevLikes,
          [hobbyId]: response.data.isLiked,
        }));
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch like status:", error);
      }
    },
    [API_BASE_URL, token]
  );

  const handleLike = useCallback(
    async (hobbyId) => {
      try {
        const isLiked = likes[hobbyId] || false;
        const method = isLiked ? "delete" : "post";
        const response = await axios({
          method,
          url: `${API_BASE_URL}/api/hobbies/${hobbyId}/likes`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLikes((prevLikes) => ({ ...prevLikes, [hobbyId]: !isLiked }));
        console.log(response.data); // サーバーからのレスポンスをログに表示
      } catch (error) {
        console.error("Like action failed:", error); // エラーをログに表示
      }
    },
    [API_BASE_URL, token, likes]
  );

  return { fetchLikeStatus, handleLike, likes };
};

export default useHandleLike;
