import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Logout from "./pages/Logout/Logout";
import Register from "./pages/Register/Register";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ProfileForm from "./pages/ProfileForm/ProfileForm";
import ProfileEdit from "./pages/ProfileEdit/ProfileEdit";
import ProfileList from "./pages/ProfileList/ProfileList";
import Footer from "./components/Footer/Footer";
import Modal from "react-modal";
import Setting from "./pages/Setting/Setting";
import "./App.css";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import PrivateRoute from "./components/PrivateRoute";
import { UserProvider } from "./components/ContextProvider";

Modal.setAppElement("#root");

function App() {
  return (
    <div className="container">
      <UserProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* /login, /register以外のルートに対して以下がマッチする (path="/*" ワイルドカードのため) */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Routes>
                  <Route path="/logout" element={<Logout />} />
                  <Route path="/profile/setup" element={<ProfileForm />} />
                  <Route path="/profile/list" element={<ProfileList />} />
                  <Route path="/profile/edit" element={<ProfileEdit />} />
                  <Route
                    path="/profile/:user_id/preview"
                    element={<ProfilePage />}
                  />
                  <Route path="/setting" element={<Setting />} />
                  <Route path="/" element={<ProfilePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </PrivateRoute>
            }
          />
        </Routes>
      </UserProvider>
      <Footer />
    </div>
  );
}

export default App;
