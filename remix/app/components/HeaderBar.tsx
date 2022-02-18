import { useContext, useEffect } from "react";
import { logout, ProfileContext } from "~/contexts";
import { Button } from "@mui/material";
import { Link, useFetcher } from "remix";
import { ApiGetProfileRequest } from "~typings/api";

export default function HeaderBar() {
  const profile = useContext(ProfileContext);
  const fetcher = useFetcher();
  useEffect(() => {
    fetcher.submit(
      {
        id: `1`,
      },
      {
        method: "post",
        action: "http://localhost:1337/api/account/profile",
        encType: "application/x-www-form-urlencoded",
      }
    );
  }, []);

  useEffect(() => {
    if (fetcher.type === "init") {
      fetcher.load("http://localhost:1337/api/account/profile");
      console.log(fetcher.state, fetcher.type, fetcher.submission, fetcher.data);
    }
  }, [fetcher]);

  return (
    <div className=" w-full py-4 px-2 flex items-center justify-between">
      <div className="flex items-center">
        <p>{`${profile.id} ${profile.capacity}`}</p>
        <Link to={"/"}>主页</Link>
        <Link to={"/articles"}>文章</Link>
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
