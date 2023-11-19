// カラーコードからを明るさの数値に変換する関数
const getYIQ = (hexcolor) => {
  // カラーコードの赤成分(最初の2文字)を取得し10進数に変換
  const r = parseInt(hexcolor.substr(1, 2), 16);
  // カラーコードの緑成分(次の2文字)を取得し10進数に変換
  const g = parseInt(hexcolor.substr(3, 2), 16);
  // カラーコードの青成分(次の2文字)を取得し10進数に変換
  const b = parseInt(hexcolor.substr(5, 2), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
};

// 2つの色のうち、背景色とのコントラストが高い方を選択する関数
export const getHigherContrastTextColor = (backgroundColor, color1, color2) => {
  const backgroundYIQ = getYIQ(backgroundColor);
  const color1YIQ = getYIQ(color1);
  const color2YIQ = getYIQ(color2);

  // 背景色とのYIQ差を比較し、差が大きい方を選ぶ
  const contrastColor1 = Math.abs(backgroundYIQ - color1YIQ);
  const contrastColor2 = Math.abs(backgroundYIQ - color2YIQ);

  return contrastColor1 > contrastColor2 ? color1 : color2;
};
