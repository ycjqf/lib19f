import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ApiAddArticleRequest, ApiAddArticleResponse } from "@typings/api";
import { Alert, AlertTitle, Button, Collapse, Container, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  MAX_ARTICLE_CHARS,
  MAX_DESCRIPTION_LENGTH,
  MAX_TITLE_LENGTH,
  MIN_ARTICLE_CHARS,
  MIN_TITLE_LENGTH,
} from "@typings/constants";
import Head from "next/head";
import { getProfileSSR } from "@/utils/req";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const profileResult = await getProfileSSR(context.req, context.res);
  console.log(profileResult);
  if (!profileResult.isLogged)
    return {
      redirect: {
        statusCode: 307,
        destination: "/login?from=/upload",
      },
      props: {},
    };
  return {
    props: {},
  };
};

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });
const Upload: NextPage = () => {
  const router = useRouter();
  const [isEmpty, setIsEmpty] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submittable, setSubmittable] = useState(false);
  const [result, setResult] = useState<ApiAddArticleResponse | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");

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
    const response = await fetch("/api/upload", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        body,
      } as ApiAddArticleRequest),
    });
    const result = (await response.json()) as ApiAddArticleResponse;
    if (result.code === "OK") return router.reload();
    setResult(result);
    setUploading(false);
  }

  return (
    <>
      <Head>
        <title>发布新的文章</title>
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

export default Upload;
