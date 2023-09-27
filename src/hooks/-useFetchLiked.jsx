// // useFetchData.js
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { getTokenFromCookie } from "../utils/cookies";

// function useFetchLiked(endpoint) {
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);
//   const token = getTokenFromCookie();

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await axios.get(endpoint, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setData(response.data);
//       } catch (error) {
//         console.error(`Failed to fetch data from ${endpoint}`, error);
//         setError(error);
//       }
//     }

//     fetchData();
//   }, [endpoint]); // エンドポイントが変更された場合のみ実行

//   return { data, error };
// }

// export default useFetchLiked;
