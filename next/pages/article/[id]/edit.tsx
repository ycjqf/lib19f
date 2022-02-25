import {
  ApiAddArticleRequest,
  ApiAddArticleResponse,
  ApiGetArticleResponse,
  ApiUpdateArticleRequest,
  ApiUpdateArticleResponse,
  AuthenticateRes,
} from "@typings/api";
import { getProfileSSR } from "@/utils/req";
import { GetServerSideProps, NextPageContext } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  MAX_ARTICLE_CHARS,
  MAX_DESCRIPTION_LENGTH,
  MAX_TITLE_LENGTH,
  MIN_ARTICLE_CHARS,
  MIN_TITLE_LENGTH,
} from "@typings/constants";
import { Container, Collapse, Alert, AlertTitle, TextField, Button } from "@mui/material";
import Head from "next/head";
const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

type Props = { articleProp: ApiGetArticleResponse; profileProp: AuthenticateRes };
export const getServerSideProps: GetServerSideProps = async context => {
  const { id } = context.query;
  const result = await fetch("http://localhost:1337/api/get/article", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(typeof id === "string" ? { id: id } : {}),
  });
  const profileResult = await getProfileSSR(context.req, context.res);
  const articleResult = (await result.json()) as ApiGetArticleResponse;

  if (
    !profileResult.data ||
    !profileResult.profile ||
    !articleResult.article ||
    !articleResult.profile
  )
    return { props: articleResult, notFound: true, redirect: { destination: "/404" } };

  if (articleResult.profile.id !== profileResult.data.id)
    return { props: {}, notFound: true, redirect: { destination: "/404" } };
  if (articleResult.code !== "OK")
    return { props: {}, notFound: true, redirect: { destination: "/404" } };

  const props: Props = { articleProp: articleResult, profileProp: profileResult };
  return { props: props };
};

const Reviews = ({ articleProp, profileProp }: NextPageContext & Props) => {
  const router = useRouter();
  const [isEmpty, setIsEmpty] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submittable, setSubmittable] = useState(false);
  const [result, setResult] = useState<ApiAddArticleResponse | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    setTitle(articleProp.article?.title || "");
    setDescription(articleProp.article?.description || "");
    setBody(articleProp.article?.body || "");
  }, [articleProp]);

  useEffect(() => {
    setIsEmpty(title === "" && description === "" && body === "");
    setSubmittable(
      title.length >= MIN_TITLE_LENGTH &&
        title.length <= MAX_TITLE_LENGTH &&
        description.length >= 0 &&
        description.length <= MAX_DESCRIPTION_LENGTH &&
        body.length >= MIN_ARTICLE_CHARS &&
        body.length <= MAX_ARTICLE_CHARS
    );
  }, [title, description, body]);
  const onMarkdownUpdated = (newMarkdown: string) => {
    setBody(newMarkdown);
  };

  async function submit() {
    setResult(undefined);
    setUploading(true);
    const response = await fetch("/api/update-article", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        body,
        id: `${articleProp.article?.id}`,
      } as ApiUpdateArticleRequest),
    });
    const result = (await response.json()) as ApiUpdateArticleResponse;
    console.log(result);
    if (result.code === "OK") return router.push(`/article/${articleProp.article?.id}`);
    setResult(result);
    setUploading(false);
  }

  return (
    <>
      <Head>
        <title>修改文章</title>
      </Head>
      <Container maxWidth="md">
        <div className="flex flex-col mt-8 mb-12 w-full">
          <Collapse in={result && result.code !== "OK"}>
            <Alert severity="error" className="w-full mb-2">
              <AlertTitle>{result?.message}</AlertTitle>
            </Alert>
          </Collapse>

          <div className="w-fit min-w-[360px] flex flex-col gap-y-4">
            <div></div>
            <TextField
              className="w-1/2"
              error={
                title.length > 0 &&
                (title.length < MIN_TITLE_LENGTH || title.length > MAX_TITLE_LENGTH)
              }
              label="标题"
              variant="standard"
              helperText={`输入${MIN_TITLE_LENGTH}到${MAX_TITLE_LENGTH} 字符`}
              value={title}
              onChange={event => {
                setTitle(event.target.value);
              }}
            />
            <TextField
              className="w-full"
              error={description.length > MAX_DESCRIPTION_LENGTH}
              label="简介"
              variant="standard"
              helperText={`最大长度${MAX_DESCRIPTION_LENGTH}字符`}
              value={description}
              onChange={event => {
                setDescription(event.target.value);
              }}
            />
          </div>
        </div>
        <div className="min-h-[184px] bg-[#2e3440]">
          <Editor editable defaultText={body} onMarkdownUpdated={onMarkdownUpdated} />
        </div>
        <div className="flex items-center justify-end py-4 gap-x-2">
          <Button
            variant="contained"
            disabled={isEmpty}
            disableElevation
            color="info"
            startIcon={<DeleteIcon />}
            onClick={e => {
              router.reload();
            }}
          >
            清空
          </Button>
          <Button
            variant="contained"
            onClick={submit}
            disableElevation
            color={result ? (result.code !== "OK" ? "error" : "success") : "primary"}
            disabled={!submittable || (result && result.code === "OK")}
            startIcon={<SendIcon />}
          >
            {uploading ? "提交中" : "提交"}
          </Button>
        </div>
      </Container>
    </>
  );
};

export default Reviews;
