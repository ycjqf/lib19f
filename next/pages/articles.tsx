import { Pagination, Button, Container, Box } from "@mui/material";
import { ApiGetArticlesRequest, ApiGetArticlesResponse, AuthenticateRes } from "tps/api";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { Add, Error } from "@mui/icons-material";
import Link from "next/link";
import ArticlePeek from "nxt/components/ArticlePeek";
import { getProfileSSR } from "nxt/utils/req";
import HeaderBar from "nxt/components/HeaderBar";

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
  const props: Props = { data, profile: profileResult };
  return { props };
};

export default function Articles({ data, profile }: Props) {
  const router = useRouter();
  const { articles, code, current, pageSize, message, total } = data;

  return (
    <>
      <Head>
        <title>页面</title>
      </Head>
      <HeaderBar authenticateRes={profile} />
      <div className="flex flex-col w-screen relative">
        <div className="bg-gray-300 h-64 w-full">
          <Container maxWidth="lg" className="relative" sx={{ height: "100%" }}>
            {/* add article icon */}
            <Box sx={{}} />
            <div
              className="md:absolute z-10 md:bottom-0 md:right-10
            transform translate-y-1/2 fixed bottom-16 right-10"
            >
              <Link href="/upload" passHref>
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
                  <Add />
                </Button>
              </Link>
            </div>
          </Container>
        </div>
        <Container maxWidth="lg">
          <div className="flex flex-col">
            {code !== "OK" && (
              <div className=" w-full h-80 flex items-center justify-center">
                <p className="text-sm text-gray-500">
                  <Error sx={{ width: "16px", height: "16px", mr: "4px" }} />
                  {message}
                </p>
              </div>
            )}
            {code === "OK" &&
              (articles.length === 0 ? (
                <div className="w-full h-80 flex items-center justify-center">
                  <p className="text-sm text-gray-500">无数据</p>
                </div>
              ) : (
                <>
                  <div
                    className="px-2 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2
                 xl:grid-cols-3 gap-x-2 gap-y-2 py-12"
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
                  <div className="w-fit mx-auto pb-24">
                    <Pagination
                      count={total > pageSize ? Math.ceil(total / pageSize) : 1}
                      page={current}
                      onChange={(event, page) => {
                        if (page === 1) return router.push({ query: {} });
                        return router.push({ query: { page, pageSize } });
                      }}
                    />
                  </div>
                </>
              ))}
          </div>
        </Container>
      </div>
    </>
  );
}
