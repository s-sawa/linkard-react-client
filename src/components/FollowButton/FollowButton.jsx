import axios from "axios";
import { useEffect, useState } from "react";
import AddGroupButton from "../AddGroupButton/AddGroupButton";
import { useForm } from "react-hook-form";
import useIsFollowing from "../../hooks/useIsFollowing";
import useGroups from "../../hooks/useGroups";
import { getTokenFromCookie } from "../../utils/cookies";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import styles from "./FollowButton.module.scss";


const FollowButton = ({ API_BASE_URL, toUserId }) => {
  const [reloadGroups, setReloadGroups] = useState(false);
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();

  const { groups, loading: groupsLoading } = useGroups(
    API_BASE_URL,
    reloadGroups
  );

  // フォローしているかどうか
  const { isFollowing, setIsFollowing, loading } = useIsFollowing(
    API_BASE_URL,
    toUserId
  );
  const isLoading = loading || groupsLoading;

  const [buttonLabel, setButtonLabel] = useState(
    isFollowing ? "フォロー解除する" : "フォローする"
  );

  useEffect(() => {
    setButtonLabel(isFollowing ? "フォロー解除する" : "フォローする");
  }, [isFollowing]);
  useEffect(() => {
    if (groups && groups.length > 0) {
      setValue("group", groups[0].id); // 初期値を設定
    }
  }, [groups, setValue]);


  const onSubmit = async (data) => {
    try {
      const token = getTokenFromCookie();
      const method = isFollowing ? "delete" : "post";
      const response = await axios({
        method: method, // ここで動的にメソッドを設定
        url: `${API_BASE_URL}/api/users/${toUserId}/follow`,
        data: { userId: Number(toUserId), groupId: Number(data.group) }, // POSTのボディデータ
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsFollowing(!isFollowing); // 状態を反転させる
    } catch (error) {
      console.error("フォローに失敗しました: ", error);
      alert("エラーが発生しました。");
    }
  };

  return (
    <div className={styles["container"]}>
      {!isFollowing && (
        <AddGroupButton
          API_BASE_URL={API_BASE_URL}
          onGroupAdded={() => setReloadGroups(!reloadGroups)}
          className={styles["add-group-button"]}
        />
      )}
      {/* <AddGroupButton
        API_BASE_URL={API_BASE_URL}
        onGroupAdded={() => setReloadGroups(!reloadGroups)}
        className={styles["add-group-button"]}
      /> */}
      <div className={styles["sub-container"]}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles["form"]}>
          {!isFollowing && (
            <select
              {...register("group")}
              onChange={(e) => setValue("group", e.target.value)}
              className={styles["form__select"]}
            >
              {groups.map((group) => (
                <option
                  key={group.id}
                  value={group.id}
                  className={styles["form__option"]}
                >
                  {group.name}
                </option>
              ))}
            </select>
          )}
          <button type="submit" className={styles["form__button"]}>
            {buttonLabel}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FollowButton;
