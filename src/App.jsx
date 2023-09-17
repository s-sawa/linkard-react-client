import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Logout from "./pages/Logout/Logout";
import Register from "./pages/Register/Register";
import Cookies from "js-cookie";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ProfileForm from "./pages/ProfileForm/ProfileForm";
import UserProfilePage from "./pages/UserProfilePage/UserProfilePage";
import ProfileEdit from "./pages/ProfileEdit/ProfileEdit";

function App() {
  const token = Cookies.get("token");
    const displayText = import.meta.env.VITE_DISPLAY_TEXT;


  return (
    <div className="App">
      <h1>{displayText}</h1>

      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route
          path="/register"
          element={token ? <Navigate to="/logout" /> : <Register />}
        />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/logout" element={<Logout />} />
        <Route path="/profile/setup" element={<ProfileForm />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/profile/:user_id/preview" element={<UserProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;
