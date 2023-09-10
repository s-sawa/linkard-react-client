import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

const ProfileForm = () => {
  const { register, handleSubmit, errors, control } = useForm({
    defaultValues: {
      hobbies: [{ hobby: "" }],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "hobbies",
  });

  const [image, setImage] = useState(null);
  const [token, setToken] = useState(Cookies.get("token") || null);

  const onImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("birthday", data.birthday);
    formData.append("comment", data.comment);

    data.hobbies.forEach((hobbyObj, index) => {
      formData.append(`hobbies[${index}][hobby]`, hobbyObj.hobby);
    });

    if (image) {
      formData.append("profile_image", image);
    }
    console.log([...formData.entries()]);

    try {
      const response = await axios.post(
        "http://localhost/api/profile/me",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      console.log(response.data.user.id);
      const receivedToken = response.data.token;
      setToken(receivedToken);
      console.log(token);
      Cookies.set("token", receivedToken, { expires: 7 });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>ProfileForm</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>誕生日:</label>
          <input type="date" name="birthday" {...register("birthday")} />
        </div>
        <div>
          <label>一言メッセージ:</label>
          <textarea name="comment" {...register("comment")}></textarea>
        </div>
        <div>
          <label>プロフィール画像:</label>
          <input type="file" accept="image/*" onChange={onImageChange} />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="プロフィール画像"
              style={{ width: "100px", height: "100px" }}
            />
          )}
        </div>

        <div>
          <label>趣味:</label>
          {fields.map((field, index) => (
            <div key={field.id}>
              <input
                name={`hobbies[${index}].hobby`}
                {...register(`hobbies[${index}].hobby`)}
                defaultValue={field.hobby}
              />
            </div>
          ))}
          <button type="button" onClick={() => append({ hobby: "" })}>
            ＋
          </button>
        </div>

        <div>
          <button type="submit">送信</button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
