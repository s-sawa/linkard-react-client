import axios from "axios";
import { useState, useCallback } from "react";
import { getTokenFromCookie } from "../utils/cookies";

function useLikes() {
  const [likedHobbies, setLikedHobbies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likes, setLikes] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = getTokenFromCookie();

  const handleLike = useCallback(
    (hobbyId) => {
      if (likedHobbies.includes(hobbyId)) {
        // いいね解除のロジック
        setLikedHobbies((prev) => prev.filter((id) => id !== hobbyId));
      } else {
        // いいねのロジック
        setLikedHobbies((prev) => [...prev, hobbyId]);
      }
    },
    [likedHobbies]
  );

  const handleShowLikes = useCallback(async (hobbyId) => {
    try {
      // APIから「いいね」したユーザーのリストを取得
      // エンドポイントとパラメータは適切に調整してください。
      const response = await axios.get(
        `${API_BASE_URL}/api/hobbies/${hobbyId}/likes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLikes(response.data.likes); // 取得した「いいね」のリストをステートにセット
      setIsModalOpen(true); // モーダルを開く
      console.log(response);
    } catch (error) {
      console.error("Error getting likes", error);
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    likedHobbies,
    isModalOpen,
    likes,
    handleLike,
    handleShowLikes,
    closeModal,
  };
}

export default useLikes;
