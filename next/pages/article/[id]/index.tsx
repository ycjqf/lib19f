import {
  ApiGetArticleResponse,
  AuthenticateRes,
  ApiDeleteArticleRequest,
  ApiDeleteArticleResponse,
} from "tps/api";
import { getProfileSSR } from "nxt/utils/req";
import { GetServerSideProps, NextPageContext } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Container, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
const Editor = dynamic(() => import("nxt/components/Editor"), { ssr: false });

type Props = { articleProp: ApiGetArticleResponse; profileProp: AuthenticateRes };
export const getServerSideProps: GetServerSideProps = async context => {
  const { id } = context.query;
  const result = await fetch("http://localhost:1337/api/get/article", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(typeof id === "string" ? { id: id } : {}),
  });
  const profileResult = await getProfileSSR(context.req, context.res);
  const data = (await result.json()) as ApiGetArticleResponse;
  const props: Props = { articleProp: data, profileProp: profileResult };
  if (data.code !== "OK") {
    context.res.statusCode = 404;
    return { props: data, notFound: true, redirect: { destination: "/404" } };
  }
  return { props: props };
};

const Article = ({ articleProp, profileProp }: NextPageContext & Props) => {
  const { article, profile } = articleProp;
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{article ? article.title : "找不到的页面"}</title>
      </Head>
      {article && profile && (
        <div>
          <Container maxWidth="md">
            {/* info */}
            <div className="my-12">
              {/* title bar */}
              <div className="inline-flex items-center justify-between w-full">
                <h4 className="w-1/2 text-2xl mb-2">
                  {article.title}
                  <span className="text-gray-400 text-sm font-normal">#{article.id}</span>
                </h4>
                {profileProp.data?.id === article.userId && (
                  <div className="inline-flex gap-x-2">
                    <Link href={`/article/${article.id}/edit`} passHref>
                      <IconButton color="primary" size="small" aria-label="edit article">
                        <EditIcon />
                      </IconButton>
                    </Link>
                    <IconButton
                      aria-label="delete"
                      onClick={async () => {
                        const response = await fetch("/api/delete-article", {
                          method: "post",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            id: `${article.id}`,
                          } as ApiDeleteArticleRequest),
                        });
                        const result = (await response.json()) as ApiDeleteArticleResponse;
                        if (result.code === "OK") return router.push("/articles");
                        alert(result.message);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                )}
              </div>
              {/* description */}
              <p
                className={`text-sm w-full mb-6 ${
                  article?.description === "" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {article?.description === "" ? "no description" : article?.description}
              </p>
              {/* date and user info */}
              <p className="text-xs ">
                {profile && (
                  <Link href={`/${profile.name}`} passHref>
                    <span className="cursor-pointer mr-2 text-gray-400 hover:text-gray-800">
                      {profile.name}
                    </span>
                  </Link>
                )}
                <span className="text-gray-400">
                  {article?.createdTime === article?.updatedTime
                    ? `创建于 ${format(new Date(article.createdTime), "yyyy-MM-dd HH:mm", {
                        locale: zhCN,
                      })}`
                    : `更新于 ${format(new Date(article.updatedTime), "yyyy-MM-dd HH:mm", {
                        locale: zhCN,
                      })}`}
                </span>
              </p>
            </div>
            <div className="min-h-[184px] bg-[#2e3440] transition-all">
              {article && <Editor defaultText={`${article.body}`} editable={false} />}
            </div>
          </Container>
        </div>
      )}
    </>
  );
};

export default Article;
