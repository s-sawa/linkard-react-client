import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.scss";

const Register = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ mode: "onSubmit" });

  const password = watch("password");
  const navigate = useNavigate(); // useNavigateを初期化
  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/register`, data);
      if (response.status === 204) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles["register-container"]}>
      <h1 className={styles["register-container__title"]}>新規登録</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["register-container__form"]}
      >
        <label htmlFor="email" className={styles["register-container__label"]}>
          メールアドレス
        </label>
        <input
          type="email"
          id="email"
          {...register("email", {
            required: "メールアドレスは必須です",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "有効なEmailアドレスを入力してください",
            },
          })}
          className={styles["register-container__input"]}
        />
        {errors.email && (
          <p className={styles["register-container__error"]}>
            {errors.email.message}
          </p>
        )}

        <label
          htmlFor="password"
          className={styles["register-container__label"]}
        >
          パスワード
        </label>
        <input
          id="password"
          type="password"
          {...register("password", {
            required: "パスワードは必須です",
            minLength: { value: 8, message: "8文字以上で入力してください" },
          })}
          className={styles["register-container__input"]}
        />
        {errors.password && (
          <p className={styles["register-container__error"]}>
            {errors.password.message}
          </p>
        )}

        <label
          htmlFor="password_confirmation"
          className={styles["register-container__label"]}
        >
          パスワード
          <span className={styles["register-container__sublabel"]}>（確認）</span>
        </label>
        <input
          id="password_confirmation"
          type="password"
          {...register("password_confirmation", {
            required: "パスワード確認は必須です",
            validate: (value) =>
              value === password || "パスワードが一致しません",
          })}
          className={styles["register-container__input"]}
        />
        {errors.password_confirmation && (
          <p className={styles["register-container__error"]}>
            {errors.password_confirmation.message}
          </p>
        )}

        <button type="submit" className={styles["register-container__button"]}>
          登録する
        </button>
      </form>
    </div>
  );
};

export default Register;
