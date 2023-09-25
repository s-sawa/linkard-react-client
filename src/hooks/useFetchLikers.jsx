import { useState, useCallback } from "react";
import axios from "axios";
import { getTokenFromCookie } from "../utils/cookies";

const useFetchLikers = () => {
  const [likers, setLikers] = useState([]);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = getTokenFromCookie();

  const fetchLikers = useCallback(
    async (hobbyId) => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/hobbies/${hobbyId}/likes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched likers: ", response.data); // APIのレスポンスをログ出力
        setLikers(response.data);
        return response.data; // 正常にデータを取得できた場合、データを返す
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
        setError(error);
        return []; // エラーが発生した場合、空の配列を返す
      }
    },
    [API_BASE_URL, token]
  );

  return { likers, error, fetchLikers };
};

export default useFetchLikers;
