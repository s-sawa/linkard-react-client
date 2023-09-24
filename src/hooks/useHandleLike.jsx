import { useCallback } from "react";

const useHandleLike = () => {
  const handleLike = useCallback((hobbyId) => {
    console.log(`Hobby ID ${hobbyId} has been liked!`);
    // 実際にはここでAPI呼び出しや状態更新を行います。
    console.log(hobbyId)
  }, []);

  return handleLike;
};

export default useHandleLike;
