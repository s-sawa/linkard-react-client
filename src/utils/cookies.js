import Cookies from "js-cookie";

export function getTokenFromCookie() {
  return Cookies.get("token");
}
