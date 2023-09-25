import { useState, useCallback } from "react";
import axios from "axios";
import { getTokenFromCookie } from "../utils/cookies";

function useHandleShowLikes() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [likes, setLikes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = getTokenFromCookie();

  const handleShowLikes = useCallback(async (hobbyId) => {
    console.log(hobbyId);
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
      console.log(response)
    } catch (error) {
      console.error("Error getting likes", error);
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return { likes, isModalOpen, handleShowLikes, closeModal };
}

export default useHandleShowLikes;
