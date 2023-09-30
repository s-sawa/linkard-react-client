import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Steps, Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { getTokenFromCookie } from "../../utils/cookies";
import axios from "axios";
import styles from "./ProfileForm.module.scss";
import defaultProfileImage from "../../assets/defaultProfileImage.svg";
import defaultFreeImage from "../../assets/defaultFreeImage.svg";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { CgAddR } from "react-icons/cg";

const { Step } = Steps;

const steps = [
  {
    title: "基本情報",
    content: "First-content",
  },
  {
    title: "追加情報1",
    content: "Second-content",
  },
  {
    title: "追加情報2",
    content: "Last-content",
  },
];

const ProfileForm = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [isModalVisible3, setIsModalVisible3] = useState(false);
  console.log(isModalVisible);

  const [current, setCurrent] = useState(0);
  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      hobbies: [{ hobby: "" }],
      others: [{ other: "" }],
      others2: [{ other2: "" }],
      others3: [{ other3: "" }],
      mode: "onChange",
    },
  });

  const {
    fields,
    append: appendHobbies,
    remove: removeHobby,
  } = useFieldArray({
    control,
    name: "hobbies",
  });
  const {
    fields: fieldsOther,
    append: appendOther,
    remove: removeOther,
  } = useFieldArray({
    control,
    name: "others",
  });

  const {
    fields: fieldsOther2,
    append: appendOther2,
    remove: removeOther2,
  } = useFieldArray({
    control,
    name: "others2",
  });

  const {
    fields: fieldsOther3,
    append: appendOther3,
    remove: removeOther3,
  } = useFieldArray({
    control,
    name: "others3",
  });

  // profile画像
  const [image, setImage] = useState(null);
  // フリー投稿画像
  const [freeImage, setFreeImage] = useState(null);
  const token = getTokenFromCookie();

  const onImageChange = (event) => {
    // eventで選択された画像ファイルをfile格納
    const file = event.target.files[0];
    // imageをfileに更新する
    setImage(file);
  };
  const onFreeImageChange = (event) => {
    // eventで選択された画像ファイルをfile格納
    const file = event.target.files[0];
    // imageをfileに更新する
    setFreeImage(file);
  };

  // その他1
  const [newOtherName, setNewOtherName] = useState("その他");
  // その他2
  const [newOtherName2, setNewOtherName2] = useState("その他");
  // その他3
  const [newOtherName3, setNewOtherName3] = useState("今後の目標");

  // その他の項目名変更ボタンがクリックされたときのハンドラ
  const handleOtherNameChange = () => {
    // フォームの新しい項目名を取得
    const updatedOtherName = getValues("otherName"); // getValues を使用して値を取得
    setNewOtherName(updatedOtherName);
    setIsModalVisible(false);
  };
  const handleOtherNameChange2 = () => {
    const updatedOtherName = getValues("otherName2");
    setNewOtherName2(updatedOtherName);
    setIsModalVisible2(false);
  };
  const handleOtherNameChange3 = () => {
    const updatedOtherName = getValues("otherName3");
    setNewOtherName3(updatedOtherName);
    setIsModalVisible3(false);
  };

  const onPrev = () => {
    setCurrent(current - 1);
  };

  const onNext = () => {
    setCurrent(current + 1);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    // appendを使ってobject形式で、formDataに入れていく
    // ()の中のキー (birthday)はテーブルのカラム名と一致させる
    // バリューのdataはhook-formのregisterで登録した入力値が入っている
    formData.append("name", data.name);
    // formData.append("birthday", data.birthday);
    formData.append("comment", data.comment);
    formData.append("themeId", data.themeId);

    data.hobbies.forEach((hobbyObj, index) => {
      formData.append(`hobbies[${index}][hobby]`, hobbyObj.hobby);
    });

    data.others.forEach((otherObj, index) => {
      formData.append(`others[${index}][name]`, otherObj.name);
    });
    data.others2.forEach((otherObj, index) => {
      formData.append(`others2[${index}][name]`, otherObj.name);
    });
    data.others3.forEach((otherObj, index) => {
      formData.append(`others3[${index}][name]`, otherObj.name);
    });

    formData.append("newOtherName", newOtherName);
    formData.append("newOtherName2", newOtherName2);
    formData.append("newOtherName3", newOtherName3);

    formData.append("title", data.title);
    formData.append("description", data.description);

    if (image) {
      formData.append("profile_image", image);
    }
    if (freeImage) {
      formData.append("free_image", freeImage);
    }
    if (data.facebook_link) {
      formData.append("social_links[0][platform]", "facebook");
      formData.append("social_links[0][url]", data.facebook_link);
    }

    if (data.twitter_link) {
      formData.append("social_links[1][platform]", "twitter");
      formData.append("social_links[1][url]", data.twitter_link);
    }

    if (data.instagram_link) {
      formData.append("social_links[2][platform]", "instagram");
      formData.append("social_links[2][url]", data.instagram_link);
    }

    console.log([...formData.entries()]);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/profile/me`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles["form"]}>
      <Steps
        current={current}
        className={styles["form__steps"]}
        responsive={false}
      >
        {steps.map((item) => (
          <Step
            key={item.title}
            title={item.title}
            className={styles["form__step"]}
          />
        ))}
      </Steps>
      <div className={styles["form__content"]}>
        {current === 0 && (
          <div className={styles["form__section"]}>
            <div className={styles["form__group"]}>
              {/* <label className={styles["form__label"]}>プロフィール画像:</label> */}
              <div className={styles["form__image-wrapper"]}>
                <img
                  src={image ? URL.createObjectURL(image) : defaultProfileImage}
                  alt="プロフィール画像"
                  className={styles["form__image"]}
                  style={{ width: "100px", height: "100px" }}
                />
                <div className={styles["form__file-wrapper"]}>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    required
                    className={styles["form__file-input"]}
                  />
                  <label
                    htmlFor="fileInput"
                    className={styles["form__custom-file-label"]}
                  >
                    プロフィール画像を選択
                  </label>
                </div>
              </div>
            </div>

            <div className={styles["form__group"]}>
              <label className={styles["form__label"]}>ニックネーム *</label>
              <input
                type="text"
                name="name"
                className={styles["form__input"]}
                {...register("name", {
                  required: "入力必須です",
                  minLength: {
                    value: 2,
                    message: "2文字以上で入力してください",
                  },
                })}
              />
            </div>
            <p className={styles["form__error"]}>
              {errors.name ? errors.name.message : null}
            </p>

            <div className={styles["form__group"]}>
              <label className={styles["form__label"]}>コメント *</label>
              <textarea
                name="comment"
                className={styles["form__textarea"]}
                {...register("comment", {
                  required: "入力必須です",
                })}
              ></textarea>
            </div>
            <p className={styles["form__error"]}>
              {errors.comment ? errors.comment.message : null}
            </p>
            <div className={styles["form__group"]}>
              <legend className={styles["form__legend"]}>
                テーマカラー選択 *
              </legend>
              <div className={styles["form__label-wrapper"]}>
                <label
                  className={`${styles["form__label"]} ${styles["form__label-color-wrapper"]}`}
                >
                  テーマ1
                  <input
                    type="radio"
                    value="1"
                    className={styles["form__radio"]}
                    {...register("themeId", { required: true })}
                  />
                  <div className={styles["color-combination"]}>
                    <div className={styles["color1"]}></div>
                    <div className={styles["color2"]}></div>
                    <div className={styles["color3"]}></div>
                  </div>
                </label>
                <label
                  className={`${styles["form__label"]} ${styles["form__label-color-wrapper"]}`}
                >
                  テーマ2
                  <input
                    type="radio"
                    value="2"
                    {...register("themeId", { required: true })}
                    className={styles["form__radio"]}
                  />
                  <div className={styles["color-combination"]}>
                    <div className={styles["color1"]}></div>
                    <div className={styles["color2"]}></div>
                    <div className={styles["color3"]}></div>
                  </div>
                </label>
                <label
                  className={`${styles["form__label"]} ${styles["form__label-color-wrapper"]}`}
                >
                  テーマ3
                  <input
                    type="radio"
                    value="3"
                    className={styles["form__radio"]}
                    {...register("themeId", { required: true })}
                  />
                  <div className={styles["color-combination"]}>
                    <div className={styles["color1"]}></div>
                    <div className={styles["color2"]}></div>
                    <div className={styles["color3"]}></div>
                  </div>
                </label>
              </div>
            </div>

            <div className={styles["form__group"]}>
              <label className={styles["form__label"]}>趣味 *</label>
              {fields &&
                fields.map((field, index) => (
                  <div key={field.id} className={styles["form__hobby"]}>
                    <input
                      name={`hobbies[${index}].hobby`}
                      {...register(`hobbies[${index}].hobby`, {
                        required: "入力は必須です",
                      })}
                      defaultValue={field.hobby}
                      className={`${styles["form__input"]} ${styles["form__input-hobby"]}`}
                    />
                    <AiOutlineDelete
                      size={24}
                      type="button"
                      onClick={() => removeHobby(index)}
                      className={styles["form__button-remove"]}
                    />
                    {errors.hobbies && errors.hobbies[index] && (
                      <p className={styles["form__error"]}>
                        {errors.hobbies[index]?.hobby?.message}
                      </p>
                    )}
                  </div>
                ))}

              <CgAddR
                size={24}
                type="button"
                onClick={() => appendHobbies({ hobby: "" })}
                className={styles["form__button-append"]}
              />
            </div>
          </div>
        )}
        {current === 1 && (
          <div className={styles["form__section"]}>
            {/* その他1 */}
            <div
              className={`${styles["form__group"]} ${styles["form__flex-container"]}`}
            >
              <div className={styles["form__label-icon-wrapper"]}>
                <label
                  className={`${styles["form__label"]} ${styles["form__label-other"]}`}
                >
                  {newOtherName}:
                </label>
                {/* <input
                type="text"
                name="otherName"
                {...register("otherName")}
                placeholder="「その他」を好きな項目名に変更"
                className={`${styles["form__input"]} ${styles["form__input-change-category"]}`}
              /> */}
                <AiOutlineEdit
                  size={30}
                  type="button"
                  // onClick={handleOtherNameChange}
                  onClick={() => setIsModalVisible(true)}
                  className={styles["form__button-change"]}
                />
              </div>
              <Modal
                title="項目名を変更"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleOtherNameChange}
              >
                <input
                  type="text"
                  name="otherName"
                  {...register("otherName")}
                  placeholder="「その他」を好きな項目名に変更"
                  className={`${styles["form__input"]} ${styles["form__input-change-category"]}`}
                />
              </Modal>

              {fieldsOther &&
                fieldsOther.map((field, index) => (
                  <div key={field.id} className={styles["form__other"]}>
                    <input
                      name={`others[${index}].name`}
                      {...register(`others[${index}].name`)}
                      defaultValue={field.name}
                      className={`${styles["form__input"]} ${styles["form__input-other"]}`}
                    />
                    <AiOutlineDelete
                      size={24}
                      type="button"
                      onClick={() => removeOther(index)}
                      className={styles["form__button-remove"]}
                    />
                  </div>
                ))}
              <CgAddR
                size={24}
                type="button"
                onClick={() => appendOther({ other: "" })}
                className={styles["form__button-append"]}
              />
            </div>

            {/* その他2 */}
            <div className={styles["form__group"]}>
              <div className={styles["form__label-icon-wrapper"]}>
                <label
                  className={`${styles["form__label"]} ${styles["form__label-other"]}`}
                >
                  {newOtherName2}:
                </label>
                {/* <input
                type="text"
                name="otherName2"
                {...register("otherName2")}
                placeholder="「その他」を好きな項目名に変更"
                className={`${styles["form__input"]} ${styles["form__input-change-category"]}`}
              /> */}
                <AiOutlineEdit
                  size={30}
                  type="button"
                  // onClick={handleOtherNameChange}
                  onClick={() => setIsModalVisible2(true)}
                  className={styles["form__button-change"]}
                />
              </div>
              <Modal
                title="項目名を変更"
                open={isModalVisible2}
                onCancel={() => setIsModalVisible2(false)}
                onOk={handleOtherNameChange2}
              >
                <input
                  type="text"
                  name="otherName2"
                  {...register("otherName2")}
                  placeholder="「その他」を好きな項目名に変更"
                  className={`${styles["form__input"]} ${styles["form__input-change-category"]}`}
                />
              </Modal>
              {/* <button
                type="button"
                onClick={handleOtherNameChange2}
                className={styles["form__button-change"]}
              >
                項目名変更
              </button> */}
              {fieldsOther2 &&
                fieldsOther2.map((field, index) => (
                  <div key={field.id} className={styles["form__item"]}>
                    <input
                      name={`others2[${index}].name`}
                      {...register(`others2[${index}].name`)}
                      defaultValue={field.name}
                      className={`${styles["form__input"]} ${styles["form__input-other"]}`}
                    />
                    <AiOutlineDelete
                      size={24}
                      type="button"
                      onClick={() => removeOther2(index)}
                      className={styles["form__button-remove"]}
                    />
                    {/* <button
                      type="button"
                      onClick={() => removeOther2(index)}
                      className={styles["form__button-remove"]}
                    >
                      削除
                    </button> */}
                  </div>
                ))}
              <CgAddR
                size={24}
                type="button"
                onClick={() => appendOther2({ other2: "" })}
                className={styles["form__button-append"]}
              />
              {/* <button
                type="button"
                onClick={() => appendOther2({ other2: "" })}
                className={styles["form__button-append"]}
              >
                ＋
              </button> */}
            </div>

            {/* その他3 */}
            <div className={styles["form__group"]}>
              <div className={styles["form__label-icon-wrapper"]}>
                <label
                  className={`${styles["form__label"]} ${styles["form__label-other"]}`}
                >
                  {newOtherName3}:
                </label>
                {/* <input
                type="text"
                name="otherName3"
                {...register("otherName3")}
                placeholder="「その他」を好きな項目名に変更"
                className={`${styles["form__input"]} ${styles["form__input-change-category"]}`}
              /> */}
                <AiOutlineEdit
                  size={30}
                  type="button"
                  // onClick={handleOtherNameChange}
                  onClick={() => setIsModalVisible3(true)}
                  className={styles["form__button-change"]}
                />
              </div>
              <Modal
                title="項目名を変更"
                open={isModalVisible3}
                onCancel={() => setIsModalVisible3(false)}
                onOk={handleOtherNameChange3}
              >
                <input
                  type="text"
                  name="otherName3"
                  {...register("otherName3")}
                  placeholder="「その他」を好きな項目名に変更"
                  className={`${styles["form__input"]} ${styles["form__input-change-category"]}`}
                />
              </Modal>
              {/* <button
                type="button"
                onClick={handleOtherNameChange3}
                className={styles["form__button-change"]}
              >
                項目名変更
              </button> */}
              {fieldsOther3 &&
                fieldsOther3.map((field, index) => (
                  <div key={field.id} className={styles["form__item"]}>
                    <input
                      name={`others3[${index}].name`}
                      {...register(`others3[${index}].name`)}
                      defaultValue={field.name}
                      className={`${styles["form__input"]} ${styles["form__input-other"]}`}
                    />
                    <AiOutlineDelete
                      size={24}
                      type="button"
                      onClick={() => removeOther3(index)}
                      className={styles["form__button-remove"]}
                    />
                    {/* <button
                      type="button"
                      onClick={() => removeOther3(index)}
                      className={styles["form__button-remove"]}
                    >
                      削除
                    </button> */}
                  </div>
                ))}
              <CgAddR
                size={24}
                type="button"
                onClick={() => appendOther3({ other3: "" })}
                className={styles["form__button-append"]}
              />
            </div>
          </div>
        )}

        {current === 2 && (
          <div className={styles["form__section"]}>
            {/* フリー入力欄 */}
            {/* <div className={styles["form__group"]}>
              <label className={styles["form__label"]}>フリー入力欄</label>
              <p className={styles["form__label-comment"]}>
                (画像と一緒に自由に投稿できます)
              </p>
              <p className={styles["form__sublabel"]}>画像:</p>
              <input
                type="file"
                accept="image/*"
                onChange={onFreeImageChange}
                className={styles["form__input-file"]}
              />
              {freeImage && (
                <img
                  src={URL.createObjectURL(freeImage)}
                  alt="フリー投稿画像"
                  className={styles["form__image-preview"]}
                />
              )}
              <p className={styles["form__sublabel"]}>タイトル</p>
              <input
                type="text"
                name="title"
                {...register("title")}
                className={styles["form__input"]}
              />
              <p className={styles["form__sublabel"]}>内容</p>
              <textarea
                name="description"
                {...register("description")}
                className={styles["form__textarea"]}
              ></textarea>
            </div> */}
            <div className={styles["form__group"]}>
              <label className={styles["form__label"]}>フリー入力欄</label>
              <p className={styles["form__label-comment"]}>
                (画像と一緒に自由に投稿できます)
              </p>

              <div className={styles["form__image-wrapper"]}>
                <img
                  src={
                    freeImage
                      ? URL.createObjectURL(freeImage)
                      : defaultFreeImage
                  }
                  alt="フリー投稿画像"
                  className={styles["form__free-image"]}
                  style={{ width: "320px", height: "180px" }}
                />
                <div className={styles["form__file-wrapper"]}>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={onFreeImageChange}
                    className={styles["form__file-input"]}
                  />
                  <label
                    htmlFor="fileInput"
                    className={styles["form__custom-file-label"]}
                  >
                    投稿画像を選択
                  </label>
                </div>
              </div>

              <p className={styles["form__sublabel"]}>タイトル</p>
              <input
                type="text"
                name="title"
                {...register("title")}
                className={styles["form__input"]}
              />

              <p className={styles["form__sublabel"]}>内容</p>
              <textarea
                name="description"
                {...register("description")}
                className={styles["form__textarea"]}
              ></textarea>
            </div>

            {/* SNSリンク */}
            <div className={styles["form__group"]}>
              <p className={styles["form__sublabel"]}>Facebook URL:</p>
              <input
                type="url"
                name="facebook_link"
                {...register("facebook_link")}
                placeholder="https://facebook.com/yourname"
                className={styles["form__input"]}
              />
              <p className={styles["form__sublabel"]}>X(Twitter) URL:</p>
              <input
                type="url"
                name="twitter_link"
                {...register("twitter_link")}
                placeholder="https://twitter.com/yourname"
                className={styles["form__input"]}
              />
              <p className={styles["form__sublabel"]}>Instagram URL:</p>
              <input
                type="url"
                name="instagram_link"
                {...register("instagram_link")}
                placeholder="https://instagram.com/yourname"
                className={styles["form__input"]}
              />
            </div>
          </div>
        )}
      </div>
      {/* <div className="steps-action">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => onNext()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <button type="submit" className={styles["submit-button"]}>
            登録する
          </button>
        )}
        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => onPrev()}>
            Previous
          </Button>
        )}
      </div> */}
      <div className={styles["steps-action"]}>
        {current < steps.length - 1 && (
          <button
            type="button"
            onClick={() => onNext()}
            className={styles["button--primary"]}
          >
          次へ
          </button>
        )}
        {current === steps.length - 1 && (
          <button type="submit" className={styles["button--submit"]}>
            登録する
          </button>
        )}
        {current > 0 && (
          <button
            type="button"
            onClick={() => onPrev()}
            className={styles["button--secondary"]}
            style={{ margin: "0 8px" }}
          >
            戻る
          </button>
        )}
      </div>

    
    </form>
  );
};

export default ProfileForm;
