import { Avatar, Pagination, Button } from "@mui/material";
import { ApiGetArticlesRequest, ApiGetArticlesResponse, AuthenticateRes } from "@typings/api";
import { useRouter } from "next/router";
import ArticlePeek from "@/components/ArticlePeek";
import { GetServerSideProps } from "next";
import Head from "next/head";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { KeyboardArrowDown, People, PermMedia, Dns, Public, Add } from "@mui/icons-material";
import { useState } from "react";
import { LIBRARY_NAME, LIBRARY_SLOGAN } from "@typings/constants";
import Link from "next/link";
import Mlink from "@mui/material/Link";
import { getProfileSSR } from "@/utils/req";

type Props = { data: ApiGetArticlesResponse; profile: AuthenticateRes };
export const getServerSideProps: GetServerSideProps = async context => {
  const result = await fetch("http://localhost:1337/api/get/articles", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      page: context.query.page,
      pageSize: context.query.pageSize,
    } as ApiGetArticlesRequest),
  });
  const profileResult = await getProfileSSR(context.req, context.res);
  const data = (await result.json()) as ApiGetArticlesResponse;
  const props: Props = { data: data, profile: profileResult };
  return { props: props };
};

export default function Articles({ data, profile }: Props) {
  const router = useRouter();
  const { articles, code, current, pageSize, message, total } = data;

  return (
    <>
      <Head>
        <title>页面</title>
      </Head>
      <div className="flex w-screen h-screen overflow-hidden relative">
        <CustomizedList profile={profile} />
        <div className="flex flex-col overflow-hidden flex-1">
          <div className="flex-1 overflow-y-scroll">
            <div className="container mx-auto my-6 overflow-y-scroll">
              {code === "OK" && articles.length === 0 && <p>空</p>}
              {code === "OK" && (
                <div
                  className="px-2 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2
                 xl:grid-cols-4 gap-x-2 gap-y-2 py-6"
                >
                  {articles.map(art => (
                    <ArticlePeek
                      key={art.id}
                      preview={art}
                      currentUserId={
                        profile.data && profile.data.capacity === "user"
                          ? profile.data.id
                          : undefined
                      }
                    />
                  ))}
                </div>
              )}
              {code === "WRONG_QUERY" && <p>{message}</p>}
              {code === "INTERNAL_ERROR" && <p>{message}</p>}
            </div>
          </div>
          <div className="w-fit mx-auto py-4">
            <Pagination
              count={total > pageSize ? Math.ceil(total / pageSize) : 1}
              page={current}
              onChange={(event, page) => {
                if (page === 1) return router.push({ query: {} });
                return router.push({ query: { page: page, pageSize: pageSize } });
              }}
            />
          </div>
        </div>
        <div className="absolute bottom-10 right-10">
          <Link href={"/upload"} passHref>
            <Button
              variant="contained"
              sx={{
                width: 20,
                minWidth: "unset",
                height: 20,
                borderRadius: 20,
                p: "24px",
                fontSize: "30px",
              }}
            >
              <Add></Add>
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}

const FireNav = styled(List)<{ component?: React.ElementType }>({
  height: "100%",
  paddingTop: 0,
  paddingBottom: 0,
  "& .MuiListItemButton-root": {
    paddingLeft: 24,
    paddingRight: 24,
  },
  "& .MuiListItemIcon-root": {
    minWidth: 0,
    marginRight: 16,
  },
  "& .MuiSvgIcon-root": {
    fontSize: 20,
  },
});

function CustomizedList(props: { profile: Props["profile"] }) {
  const data = [
    { icon: <People />, label: "Authentication" },
    { icon: <Dns />, label: "Database" },
    { icon: <PermMedia />, label: "Storage" },
    { icon: <Public />, label: "Hosting" },
  ];
  const [open, setOpen] = useState(true);
  return (
    <Box className="hidden sm:flex">
      <ThemeProvider
        theme={createTheme({
          components: {
            MuiListItemButton: {
              defaultProps: {
                disableTouchRipple: true,
              },
            },
          },
          palette: {
            mode: "dark",
            primary: { main: "rgb(102, 157, 246)" },
            background: { paper: "rgb(5, 30, 52)" },
          },
        })}
      >
        <Paper elevation={0} sx={{ maxWidth: 256, borderRadius: 0 }}>
          <FireNav component="nav" className="flex flex-col">
            <Box>
              {/* nav title */}
              <Link href={"/"} passHref>
                <a className="text-white">
                  <ListItemButton>
                    <ListItemIcon sx={{ fontSize: 20 }}>📖</ListItemIcon>
                    <ListItemText
                      sx={{ my: 1 }}
                      primary={`${LIBRARY_NAME} 所有页面`}
                      secondary={LIBRARY_SLOGAN}
                      primaryTypographyProps={{
                        fontSize: 16,
                        fontWeight: "medium",
                        letterSpacing: 0,
                      }}
                      secondaryTypographyProps={{
                        fontSize: 10,
                      }}
                    />
                  </ListItemButton>
                </a>
              </Link>

              <Divider />
            </Box>
            <Box
              sx={{
                bgcolor: open ? "rgba(71, 98, 130, 0.2)" : null,
                pb: open ? 2 : 0,
                flex: 1,
                overflowY: "scroll",
              }}
            >
              <ListItemButton
                alignItems="flex-start"
                onClick={() => setOpen(!open)}
                sx={{
                  px: 3,
                  pt: 2.5,
                  pb: open ? 0 : 2.5,
                  "&:hover, &:focus": { "& svg": { opacity: open ? 1 : 0 } },
                }}
              >
                <ListItemText
                  primary="标签"
                  primaryTypographyProps={{
                    fontSize: 15,
                    fontWeight: "medium",
                    lineHeight: "20px",
                    mb: "2px",
                  }}
                  secondary="Vue React Typescript Next.js Dart Flutter Rust Actix-Web"
                  secondaryTypographyProps={{
                    noWrap: true,
                    fontSize: 12,
                    lineHeight: "16px",
                    color: open ? "rgba(0,0,0,0)" : "rgba(255,255,255,0.5)",
                  }}
                  sx={{ my: 0 }}
                />
                <KeyboardArrowDown
                  sx={{
                    mr: -1,
                    opacity: 0,
                    transform: open ? "rotate(-180deg)" : "rotate(0)",
                    transition: "0.2s",
                  }}
                />
              </ListItemButton>
              {open &&
                data.map(item => (
                  <ListItemButton
                    key={item.label}
                    sx={{ py: 0.8, minHeight: 32, color: "rgba(255,255,255,.8)" }}
                  >
                    <ListItemIcon sx={{ color: "inherit", fontSize: 12 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontSize: 14, fontWeight: "normal" }}
                    />
                  </ListItemButton>
                ))}
            </Box>
            <Box
              sx={{
                px: "24px",
                py: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", columnGap: "4px" }}>
                <Avatar className="mr-2"></Avatar>
                {props.profile.profile && (
                  <Link href={`/${props.profile.profile.name}`} passHref>
                    <Mlink className="text-sm font-semibold" underline="hover">
                      {props.profile.profile.name}
                    </Mlink>
                  </Link>
                )}
              </Box>

              {props.profile.isLogged ? (
                <Button disableElevation>登出</Button>
              ) : (
                <Link href={"/login"} passHref>
                  <Button disableElevation>登陆</Button>
                </Link>
              )}
            </Box>
          </FireNav>
        </Paper>
      </ThemeProvider>
    </Box>
  );
}
