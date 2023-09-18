import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import AddGroupButton from "../AddGroupButton/AddGroupButton";
import { useForm } from "react-hook-form";

const FollowButton = ({ API_BASE_URL, userId }) => {
  const [groups, setGroups] = useState([]);
  const [reloadGroups, setReloadGroups] = useState(false);
  const { register, handleSubmit, setValue } = useForm();

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
      } catch (error) {
        console.error("グループの取得に失敗しました: ", error);
      }
    };
    fetchGroups();
  }, [reloadGroups]);

  const onSubmit = async (data) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${API_BASE_URL}/api/users/${userId}/follow`,
        { userId, groupId: data.group },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("フォローしました！");
      } else {
        alert("フォローに失敗しました。");
      }
    } catch (error) {
      console.error("フォローに失敗しました: ", error);
      alert("エラーが発生しました。");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <select
          {...register("group")}
          onChange={(e) => setValue("group", e.target.value)}
        >
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
        <button type="submit">フォローする</button>
      </form>
      <AddGroupButton
        API_BASE_URL={API_BASE_URL}
        onGroupAdded={() => setReloadGroups(!reloadGroups)}
      />
    </div>
  );
};

export default FollowButton;
