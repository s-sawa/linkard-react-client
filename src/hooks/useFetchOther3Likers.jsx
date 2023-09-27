import { useState, useCallback } from "react";
import axios from "axios";
import { getTokenFromCookie } from "../utils/cookies";

const useFetchOther3Likers = () => {
  const [other3Likers, setOther3Likers] = useState([]); // other2Likersをother3Likersに変更
  const [other3Error, setOther3Error] = useState(null); // other2Errorをother3Errorに変更

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = getTokenFromCookie();

  const fetchOther3Likers = useCallback(
    async (other3Id) => {
      console.log(other3Id);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/others3/${other3Id}/likes`, // エンドポイントをothers3に変更
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched other3 likers: ", response.data);
        setOther3Likers(response.data);
        return response.data;
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation for other3:",
          error
        );
        setOther3Error(error);
        return [];
      }
    },
    [API_BASE_URL, token]
  );

  return { other3Likers, other3Error, fetchOther3Likers };
};

export default useFetchOther3Likers; // 関数名もother3に変更
