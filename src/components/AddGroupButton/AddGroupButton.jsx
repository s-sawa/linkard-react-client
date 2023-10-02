import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import styles from "./AddGroupButton.module.scss";

const AddGroupButton = ({ API_BASE_URL, onGroupAdded }) => {
  const { register, handleSubmit } = useForm();
  const [showForm, setShowForm] = useState(false);

  const onSubmit = async (data) => {
    try {
      const token = Cookies.get("token");
      await axios.post(`${API_BASE_URL}/api/groups`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("グループが追加されました！");
      onGroupAdded(); // グループが追加されたらこの関数を呼び出す

      setShowForm(false);
    } catch (error) {
      // console.error("グループの追加に失敗しました: ", error);
    }
  };

  return (
    <div className={styles.block}>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className={styles["block__button--add"]}
        >
          グループを追加
        </button>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.block__form}>
          <input
            {...register("name")}
            placeholder="グループ名"
            required
            className={styles.block__input}
          />
          <button type="submit" className={styles["block__button--submit"]}>
            追加する
          </button>
        </form>
      )}
    </div>
  );
};

export default AddGroupButton;