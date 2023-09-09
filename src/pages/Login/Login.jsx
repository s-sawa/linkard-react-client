import axios from "axios";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const navigate = useNavigate(); // useNavigateを初期化

  const [token, setToken] = useState(Cookies.get("token") || null);

  const onSubmit = async (data) => {
    console.log(data);
    // try {
    // axiosのインスタンスを使用してPOSTリクエストを送信
    // postの中身は第１引数にエンドポイント、第２引数に渡すデータ

    await axios
      .post("http://localhost/api/login", data)
      .then(function (response) {
        console.log(response);
        console.log(response.data.user.id);

        // サーバーからのレスポンスデータからトークンを抽出
        const receivedToken = response.data.token;

        // トークンを変数に格納
        setToken(receivedToken);

        // トークンをコンソールに表示（確認用）
        console.log(token);
        // トークンをクッキーに保存
        Cookies.set("token", receivedToken, { expires: 7 }); // 有効期限を設定
        // ログイン後に遷移させる
        navigate("/profile");
      })
      .catch(function (error) {
        console.log(error);
      });
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

        {/* <button type="submit">ログイン</button> */}
        <button type="submit">ログイン</button>
        {/* <button type="submit">ログイン</button>
        <Button colorScheme="blue">Button</Button> */}
      </form>
    </div>
  );
};

export default Login;
