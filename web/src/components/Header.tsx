import { hideHeaderFooterPaths } from "_/config/ui";
import { ProfileContext } from "_/contexts";
import Logout from "@mui/icons-material/Logout";
import { Avatar, Button, IconButton } from "@mui/material";
import MuiLink from "@mui/material/Link";
import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";

async function logout() {
  const response = await fetch("/api/logout", { method: "get" });
  const result = await response.json();
  if (result.code === "OK") return window.location.reload();
}

export default function Header() {
  const profile = useContext(ProfileContext);
  const location = useLocation();
  return (
    <div
      className={`flex items-center justify-between px-4 py-2 z-20 w-full bg-gray-300
      ${hideHeaderFooterPaths.includes(location.pathname) ? "hidden" : ""}
    `}
    >
      <div className="flex items-center gap-x-4">
        {[
          {
            name: "主页",
            href: "/",
          },
          {
            name: "文章",
            href: "/articles",
          },
        ].map((item) => (
          <MuiLink underline="hover" key={item.href} component="div">
            <Link to={item.href}>{item.name}</Link>
          </MuiLink>
        ))}
      </div>
      <div className="flex items-center gap-x-2">
        {profile.account && profile.capacity && !profile.loading ? (
          <>
            <IconButton aria-label="log out" size="small" onClick={logout}>
              <Logout />
            </IconButton>
            <Avatar sx={{ width: 36, height: 36 }}>
              {profile.account.name.substring(0, 1)}
            </Avatar>
          </>
        ) : (
          <Link to="/login">
            <Button variant="contained" disableElevation>
              登陆
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
