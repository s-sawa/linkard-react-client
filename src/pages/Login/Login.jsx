import axios from "axios";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // 環境変数からAPIのベースURLを取得
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const navigate = useNavigate(); // useNavigateを初期化

  const [token, setToken] = useState(Cookies.get("token") || null);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, data); // APIのURLを動的に設定
      // const response = await axios.post("http://localhost/api/login", data);
      console.log(response);
      console.log(response.data.user.id);
      const receivedToken = response.data.token;
      setToken(receivedToken);
      console.log(token);
      Cookies.set("token", receivedToken, { expires: 7 });
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="form-container">
      {token ? <p>ログイン中</p> : <p>ログアウト状態</p>}
      {/* handleSubmitはreact-hool-formの関数 
      onSubmit関数をhandleSubmit関数の引数に渡す*/}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">メールアドレス</label>
        <br />
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
        />
        <br />
        {errors.email && <p>{errors.email.message}</p>}

        <label htmlFor="password">パスワード</label>
        <input
          id="password"
          type="password"
          {...register("password", {
            required: "パスワードは必須です",
            minLength: { value: 8, message: "8文字以上で入力してください" },
          })}
        />
        <p>{errors.password && <p>{errors.password.message}</p>}</p>

        <button type="submit">ログイン</button>
        <button onClick={() => navigate("/register")}>新規登録</button>
      </form>
    </div>
  );
};

export default Login;
