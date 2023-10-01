import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const useIsFollowing = (API_BASE_URL, toUserId) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFollowingStatus = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `${API_BASE_URL}/api/users/me/follows/${toUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response)
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error("フォローステータスの取得に失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };
    checkFollowingStatus();
  }, [API_BASE_URL, toUserId]);

  return { isFollowing, setIsFollowing, loading };
  // return { isFollowing, loading };
};

export default useIsFollowing;
