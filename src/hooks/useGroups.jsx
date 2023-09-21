// hooks/useGroups.js
import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

const useGroups = (API_BASE_URL, reload = false) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${API_BASE_URL}/api/groups`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGroups(response.data);
        setLoading(false);
      } catch (error) {
        console.error("グループの取得に失敗しました: ", error);
        setLoading(false);
      }
    };
    fetchGroups();
  }, [API_BASE_URL, reload]);

  return { groups, loading };
};

export default useGroups;
