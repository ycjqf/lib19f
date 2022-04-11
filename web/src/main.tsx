import "_/generated/output.css";

import Footer from "_/components/Footer";
import Header from "_/components/Header";
import { defaultHeader } from "_/config/request";
import { ProfileContext, ProfileContextType } from "_/contexts";
import Article from "_/pages/Article";
import Articles from "_/pages/Articles";
import Home from "_/pages/Home";
import Login from "_/pages/Login";
import Register from "_/pages/Register";
import Upload from "_/pages/Upload";
import translations from "_/translations";
import axios from "axios";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { initReactI18next } from "react-i18next";
import { BrowserRouter, Route, Routes } from "react-router-dom";

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
      .then((res) => {
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
