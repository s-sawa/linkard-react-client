import axios from "axios";
import { useState } from "react";
import AddGroupButton from "../AddGroupButton/AddGroupButton";
import { useForm } from "react-hook-form";
import useIsFollowing from "../../hooks/useIsFollowing";
import useGroups from "../../hooks/useGroups";
import { getTokenFromCookie } from "../../utils/cookies";

const FollowButton = ({ API_BASE_URL, toUserId }) => {
  const [reloadGroups, setReloadGroups] = useState(false);
  const { register, handleSubmit, setValue } = useForm();

  const { groups, loading: groupsLoading } = useGroups(
    API_BASE_URL,
    reloadGroups
  );

  // フォローしているかどうか
  const { isFollowing, loading } = useIsFollowing(API_BASE_URL, toUserId);

  const isLoading = loading || groupsLoading;

  const onSubmit = async (data) => {
    console.log(toUserId);
    try {
      const token = getTokenFromCookie();
      const response = await axios.post(
        `${API_BASE_URL}/api/users/${toUserId}/follow`,
        { userId: Number(toUserId), groupId: Number(data.group) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);

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
      {isLoading ? (
        <p>ロード中...</p>
      ) : (
        <>
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
            <button type="submit">
              {isFollowing ? "フォローを解除する" : "フォローする"}
            </button>
          </form>
          <AddGroupButton
            API_BASE_URL={API_BASE_URL}
            onGroupAdded={() => setReloadGroups(!reloadGroups)}
          />
        </>
      )}
    </div>
  );
};

export default FollowButton;
