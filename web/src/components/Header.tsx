import { hideHeaderFooterPaths } from "_/config/ui";
import { ProfileContext } from "_/contexts";
import Logout from "@mui/icons-material/Logout";
import { Button } from "@mui/material";
import MuiLink from "@mui/material/Link";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

async function logout() {
  const response = await fetch("/api/account/logout", { method: "post" });
  const result = await response.json();
  if (result.code === "OK") {
    window.location.href = "/";
  }
}

export default function Header() {
  const { t } = useTranslation();
  const profile = useContext(ProfileContext);
  const location = useLocation();
  return (
    <div
      className={`flex items-center justify-between px-12 py-2 z-20 w-full 
      ${hideHeaderFooterPaths.includes(location.pathname) ? "hidden" : ""}
    `}
    >
      <div className="flex items-center gap-x-2">
        {[
          { title: t("NavHome"), link: "/" },
          { title: t("NavAbout"), link: "/about" },
          { title: t("NavArticles"), link: "/articles" },
        ]
          .concat(
            profile.capacity === "reviewer"
              ? [{ title: t("NavReviews"), link: "/reviews" }]
              : []
          )
          .concat(
            profile.capacity === "admin"
              ? [{ title: t("NavDashboard"), link: "/dashboard" }]
              : []
          )
          .concat(
            profile.capacity === "user" ? [{ title: t("NavUpload"), link: "/upload" }] : []
          )
          .map((item) => (
            <MuiLink
              underline="hover"
              key={item.link}
              component="div"
              color="HighlightText"
              fontSize={14}
            >
              <Link to={item.link}>{item.title}</Link>
            </MuiLink>
          ))}
      </div>
      <div className="inline-flex items-center gap-x-2">
        {profile.account && profile.capacity ? (
          <>
            <span className="text-sm mr-1">
              {profile.account.name}(
              {t(
                // @ts-ignore
                `Capacity.${profile.capacity.slice(0, 1).toUpperCase()}${profile.capacity.slice(
                  1
                )}`
              )}
              )
            </span>
            <Logout
              onClick={logout}
              className=" text-slate-400 hover:text-slate-700"
              style={{ width: 16, height: 16 }}
            />
          </>
        ) : (
          !profile.loading && (
            <Link to="/login">
              <Button variant="contained" size="small" disableElevation>
                {t("NavLogin")}
              </Button>
            </Link>
          )
        )}
      </div>
    </div>
  );
}
