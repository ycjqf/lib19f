import "_/generated/output.css";

import Footer from "_/components/Footer";
import Header from "_/components/Header";
import { defaultHeader } from "_/config/request";
import { ProfileContext, ProfileContextType } from "_/contexts";
import About from "_/pages/About";
import Article from "_/pages/Article";
import Articles from "_/pages/Articles";
import Dashboard from "_/pages/Dashboard";
import Home from "_/pages/Home";
import Login from "_/pages/Login";
import NotFount from "_/pages/NotFound";
import Register from "_/pages/Register";
import Review from "_/pages/Review";
import Reviews from "_/pages/Reviews";
import Upload from "_/pages/Upload";
import translations from "_/translations";
import axios, { AxiosError } from "axios";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { StrictMode, useEffect, useState } from "react";
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
    if (localStorage.getItem("isLoggedIn") !== "true") {
      setProfile({ loading: false });
      return;
    }
    axios
      .post<AuthenticateResponse>("/api/profile/auth", {}, { headers: defaultHeader })
      .then((res) => {
        if (res.data.code === "OK") {
          setProfile({
            capacity: res.data.capacity,
            account: res.data.user,
            loading: false,
          });
        } else {
          setProfile({ loading: false });
        }
      })
      .catch((error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("isLoggedIn");
        }
        setProfile({ loading: false });
      });
  }, []);

  return (
    <StrictMode>
      <ProfileContext.Provider value={profile}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/review/:id" element={<Review />} />
            <Route path="/*" element={<NotFount />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </ProfileContext.Provider>
    </StrictMode>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
