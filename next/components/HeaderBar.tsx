import { Avatar, Button, IconButton } from "@mui/material";
import { useContext } from "react";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import SettingsIcon from "@mui/icons-material/Settings";
import Link from "next/link";
import Mlink from "@mui/material/Link";
import { AuthenticateRes } from "@typings/api";
import { profile } from "console";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

export default function HeaderBar(props: { authenticateRes: AuthenticateRes }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 z-20 relative bg-white">
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
        ].map(item => (
          <Link key={item.href} href={item.href} passHref>
            <Mlink underline="hover">{item.name}</Mlink>
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-x-2">
        {props.authenticateRes.isLogged &&
        props.authenticateRes.data &&
        props.authenticateRes.profile ? (
          <>
            <IconButton aria-label="delete">
              <SettingsIcon />
            </IconButton>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar sx={{ width: 36, height: 36 }}>
                {props.authenticateRes.profile.name.substring(0, 1)}
              </Avatar>
            </StyledBadge>
          </>
        ) : (
          <Link href={"/login"} passHref>
            <Button variant="contained" disableElevation>
              登陆
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
