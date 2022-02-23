import { ApiGetArticleResponse, ApiGetArticleRequest } from "@/../typings/api";
import { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
const DynamicComponentWithNoSSR = dynamic(() => import("@/components/Editor"), { ssr: false });

type Props = { data: ApiGetArticleResponse };
export const getServerSideProps: GetServerSideProps = async context => {
  const result = await fetch("http://localhost:1337/api/get/article", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      // @ts-ignore
      id: `${context.params.id}`,
    } as ApiGetArticleRequest),
  });
  const data = (await result.json()) as ApiGetArticleResponse;
  const props: Props = { data: data };
  return { props: props };
};

const Article = ({ data }: Props) => {
  console.log(data.article?.body);
  return (
    <div>
      <DynamicComponentWithNoSSR defaultText={`${data.article?.body}`} editable={false} />
    </div>
  );
};

export default Article;
