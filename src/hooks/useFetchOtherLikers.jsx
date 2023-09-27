import { useState, useCallback } from "react";
import axios from "axios";
import { getTokenFromCookie } from "../utils/cookies";

const useFetchOtherLikers = () => {
  const [otherLikers, setOtherLikers] = useState([]); // likersをotherLikersに変更
  const [otherError, setOtherError] = useState(null); // errorをotherErrorに変更

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = getTokenFromCookie();

  const fetchOtherLikers = useCallback(
    async (otherId) => {
        console.log(otherId)
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/others/${otherId}/likes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched other likers: ", response.data);
        setOtherLikers(response.data); // setLikersをsetOtherLikersに変更
        return response.data;
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation for other:",
          error
        );
        setOtherError(error); // setErrorをsetOtherErrorに変更
        return [];
      }
    },
    [API_BASE_URL, token]
  );

  return { otherLikers, otherError, fetchOtherLikers }; // likersをotherLikers、errorをotherErrorに変更
};

export default useFetchOtherLikers;
