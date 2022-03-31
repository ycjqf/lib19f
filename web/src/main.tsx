import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "dist/output.css";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Home from "src/pages/Home";
import Articles from "src/pages/Articles";
import Article from "src/pages/Article";
import Register from "src/pages/Register";
import Login from "src/pages/Login";
import Upload from "src/pages/Upload";
import { ProfileContext, ProfileContextType } from "src/contexts";
import axios from "axios";
import Footer from "src/components/Footer";
import { defaultHeader } from "src/config/request";
import { translations } from "src/translations";
import Header from "src/components/Header";
import LanguageDetector from "i18next-browser-languagedetector";

async function loadI18N() {
  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: translations,
      fallbackLng: "en",
      interpolation: { escapeValue: false },
    });
}
loadI18N().finally(() => {});

function App() {
  const [profile, setProfile] = useState<ProfileContextType>({
    loading: true,
  });

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") return;
    axios
      .post<AuthenticateResponse>("/api/authenticate", {}, { headers: defaultHeader })
      .then(res => {
        if (res.data.code === "OK") {
          setProfile({
            capacity: res.data.capacity,
            account: res.data.user,
            loading: false,
          });
        } else {
          localStorage.removeItem("isLoggedIn");
          setProfile({ loading: false });
        }
      })
      .catch(() => {
        localStorage.removeItem("isLoggedIn");
        setProfile({ loading: false });
      });
  }, []);

  return (
    // <React.StrictMode>
    <ProfileContext.Provider value={profile}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/article/:id" element={<Article />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ProfileContext.Provider>
    // </React.StrictMode>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
