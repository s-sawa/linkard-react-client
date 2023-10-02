import axios from "axios";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";

const Login = () => {
  // 環境変数からAPIのベースURLを取得
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });
  const navigate = useNavigate(); // useNavigateを初期化
  const [token, setToken] = useState(Cookies.get("token") || null);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, data);
      const receivedToken = response.data.token;
      setToken(receivedToken);
      Cookies.set("token", receivedToken, { expires: 7 });
      setErrorMessage("");
      navigate("/");
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("ログインに失敗しました");
      }
    }
  };

  return (
    // <div className="form-container">
    //   {/* handleSubmitはreact-hook-formの関数
    //   onSubmit関数をhandleSubmit関数の引数に渡す*/}
    //   <form onSubmit={handleSubmit(onSubmit)}>
    //     <label htmlFor="email">メールアドレス</label>
    //     <input
    //       type="email"
    //       id="email"
    //       {...register("email", {
    //         required: "メールアドレスは必須です",
    //         pattern: {
    //           value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
    //           message: "有効なEmailアドレスを入力してください",
    //         },
    //       })}
    //     />
    //     {errors.email && <p>{errors.email.message}</p>}

    //     <label htmlFor="password">パスワード</label>
    //     <input
    //       id="password"
    //       type="password"
    //       {...register("password", {
    //         required: "パスワードは必須です",
    //         minLength: { value: 8, message: "8文字以上で入力してください" },
    //       })}
    //     />
    //     <p>{errors.password && <p>{errors.password.message}</p>}</p>
    //     {errorMessage && (
    //       <p className={styles["login__error__message"]}>{errorMessage}</p>
    //     )}

    //     <button type="submit">ログイン</button>
    //     <button onClick={() => navigate("/register")}>新規登録</button>
    //   </form>
    // </div>
    <div className={styles["login__form-container"]}>
      <div className={styles["login__branding"]}>
        <h1 className={styles["login__title"]}>LINKARD</h1>
        {/* または <img src="ロゴのURL" alt="プロダクト名" /> */}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={styles["login__form"]}>
        <label htmlFor="email" className={styles["login__label"]}>
          メールアドレス
        </label>
        <input
          type="email"
          id="email"
          className={styles["login__input"]}
          {...register("email", {
            required: "メールアドレスは必須です",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "有効なEmailアドレスを入力してください",
            },
          })}
        />
        {errors.email && (
          <p className={styles["login__error-message"]}>
            {errors.email.message}
          </p>
        )}

        <label htmlFor="password" className={styles["login__label"]}>
          パスワード
        </label>
        <input
          id="password"
          type="password"
          className={styles["login__input"]}
          {...register("password", {
            required: "パスワードは必須です",
            minLength: { value: 8, message: "8文字以上で入力してください" },
          })}
        />
        {errors.password && (
          <p className={styles["login__error-message"]}>
            {errors.password.message}
          </p>
        )}
        {errorMessage && (
          <p className={styles["login__error-message"]}>{errorMessage}</p>
        )}

        <button type="submit" className={styles["login__submit-button"]}>
          ログイン
        </button>
        <button
          onClick={() => navigate("/register")}
          className={styles["login__register-button"]}
        >
          新規登録
        </button>
      </form>
    </div>
  );
};

export default Login;
