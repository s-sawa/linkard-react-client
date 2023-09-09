import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ mode: "onChange" });

  const password = watch("password");

  const navigate = useNavigate(); // useNavigateを初期化

  const onSubmit = async (data) => {
    console.log(data);

    await axios
      .post("http://localhost/api/register", data)
      .then(function (response) {
        console.log(response.status);
        if (response.status === 204) {
          navigate("/login");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="form-container">
      <h1>新規登録</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="名前">名前</label>
        {/* registerを使うとdataにinputで入力された値を含めることができる */}
        <input
          id="name"
          type="text"
          {...register("name", {
            required: "名前は必須です",
            minLength: { value: 4, message: "4文字以上で入力してください" },
          })}
        />
        <p>{errors.name && <p>{errors.name.message}</p>}</p>

        <label htmlFor="email">メールアドレス</label>
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
        <label htmlFor="password_confirmation">password（確認）</label>
        <input
          id="password_confirmation"
          type="password"
          {...register("password_confirmation", {
            required: "パスワード確認は必須です",
            validate: (value) =>
              value === password || "パスワードが一致しません",
          })}
        />
        <p>
          {errors.password_confirmation
            ? errors.password_confirmation.message
            : null}
        </p>
        <button type="submit">登録する</button>
      </form>
    </div>
  );
};

export default Register;
