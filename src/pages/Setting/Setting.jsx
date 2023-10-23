// import DeleteProfileButton from "../../components/DeleteProfileButton/DeleteProfileButton";
// import LogoutButton from "../../components/LogoutButton/LogoutButton";
// import styles from "./Setting.module.scss";
// import { useUser } from "../../components/ContextProvider";
// import { useEffect, useState } from "react";

// const Setting = () => {
//   const { user } = useUser();
//   const [localStorageUserName, setLocalStorageUserName] = useState("");

//   useEffect(() => {
//     const storedUserName = localStorage.getItem("userName");
//     if (storedUserName) {
//       setLocalStorageUserName(storedUserName);
//     }
//   }, []);

//   return (
//     <div className={styles["setting-container"]}>
//       <p>こんにちは{localStorageUserName || user.name}さん</p>
//       <LogoutButton className={styles["setting-container__logout-button"]} />
//       <DeleteProfileButton className={styles.button} />
//     </div>
//   );
// };

// export default Setting;

import DeleteProfileButton from "../../components/DeleteProfileButton/DeleteProfileButton";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import styles from "./Setting.module.scss";
import { useUser } from "../../components/ContextProvider";
import { useEffect, useState } from "react";

const Setting = () => {
  // const { user } = useUser();
  // const [localStorageUserName, setLocalStorageUserName] = useState("");

  // useEffect(() => {
  //   const storedUserName = localStorage.getItem("userName");
  //   if (storedUserName) {
  //     setLocalStorageUserName(storedUserName);
  //   }
  // }, []); // 最初のレンダリング時にのみ実行されます

  // // ローカルストレージにユーザー名を設定する関数
  // const setUserNameInLocalStorage = (userName) => {
  //   localStorage.setItem("userName", userName);
  //   setLocalStorageUserName(userName);
  // };

  return (
    <div className={styles["setting-container"]}>
      {/* <p>こんにちは{localStorageUserName || user.name}さん</p> */}
      <LogoutButton className={styles["setting-container__logout-button"]} />
      <DeleteProfileButton
        className={styles.button}
        // ボタンがクリックされたときにローカルストレージにユーザー名を設定
        // onClick={() => setUserNameInLocalStorage(user.name)}
      />
    </div>
  );
};

export default Setting;
