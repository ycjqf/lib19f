import { useFetcher, Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "remix";
import type { MetaFunction, LinksFunction } from "remix";
import { LIBRARY_NAME, LIBRARY_SLOGAN } from "~typings/constants";
import styles from "~dist/output.css";
import Progress from "~/components/Progress";
import NotFound from "~/404";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { logout, ProfileContext, ProfileContextType } from "~/contexts";

export const meta: MetaFunction = () => {
  return {
    title: `${LIBRARY_NAME} | ${LIBRARY_SLOGAN}`,
    describe: "markdown社区的在线资料库",
    keywords: "markdown,react,expressjs,vue,vue3,typescript,mongodb",
  };
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
};

export function CatchBoundary() {
  return <NotFound />;
}

export default function App() {
  const [profile, setProfile] = useState<ProfileContextType>({ id: undefined, capacity: "user" });

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    if (!accessToken || !refreshToken) return logout();
    try {
      const decoded = jwt_decode(accessToken) as any;
      setProfile({
        id: decoded.id as number,
        capacity: "user",
      });
    } catch (error) {
      logout();
    }
  }, []);

  // if (!parsedPayload.id) return;

  // fetcher.submit();

  // const result = await axios.post<ApiGetProfileResponse>("/api/get/profile", {
  //   id: parsedPayload.id,
  // });
  // if (result.data.code !== "OK") {
  //   localStorage.removeItem("access_token");
  //   localStorage.removeItem("refresh_token");
  //   router.push({ name: "login" });
  //   messager.error("登陆ID无效，请重新登陆");
  //   return;
  // }
  // USER_PROFILE.value = result.data.profile;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={styles} />
        <Meta />
        <Links />
      </head>
      <body>
        <Progress />
        <ProfileContext.Provider value={profile}>
          <Outlet />
        </ProfileContext.Provider>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
