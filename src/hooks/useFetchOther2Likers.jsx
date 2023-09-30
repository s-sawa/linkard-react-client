import { useState, useCallback } from "react";
import axios from "axios";
import { getTokenFromCookie } from "../utils/cookies";

const useFetchOther2Likers = () => {
  const [other2Likers, setOther2Likers] = useState([]); // otherLikersをother2Likersに変更
  const [other2Error, setOther2Error] = useState(null); // otherErrorをother2Errorに変更

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = getTokenFromCookie();

  const fetchOther2Likers = useCallback(
    async (other2Id) => {
      console.log(other2Id);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/others2/${other2Id}/likes`, // エンドポイントをothers2に変更
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched other2 likers: ", response.data); // otherをother2に変更
        setOther2Likers(response.data); // setOtherLikersをsetOther2Likersに変更
        return response.data;
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation for other2:", // otherをother2に変更
          error
        );
        setOther2Error(error); // setOtherErrorをsetOther2Errorに変更
        return [];
      }
    },
    [API_BASE_URL, token]
  );

  return { other2Likers, other2Error, fetchOther2Likers }; // otherLikersをother2Likers、otherErrorをother2Errorに変更
};

export default useFetchOther2Likers; // 関数名もother2に変更
