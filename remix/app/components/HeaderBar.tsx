import { useContext, useEffect } from "react";
import { logout, ProfileContext } from "~/contexts";
import { Button } from "@mui/material";
import { Link } from "remix";

export default function HeaderBar() {
  const profile = useContext(ProfileContext);
  return (
    <div className=" w-full py-4 px-4 flex items-center justify-between">
      <div className="flex items-center gap-x-4">
        <Link className="hover:underline" to={"/"}>
          主页
        </Link>
        <Link className="hover:underline" to={"/articles"}>
          文章
        </Link>
      </div>
      <div className="flex items-center">
        {profile.id ? (
          <Button
            variant="contained"
            disableElevation
            className="w-fit"
            type="submit"
            onClick={() => {
              logout();
              window.location.reload();
            }}
          >
            登出
          </Button>
        ) : (
          <Link to={"/login"}>
            <Button variant="contained" disableElevation className="w-fit" type="submit">
              登陆
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
