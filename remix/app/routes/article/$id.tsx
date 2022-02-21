import { LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { ApiGetArticleRequest, ApiGetArticleResponse, ApiGetProfileResponse } from "~typings/api";
import { LIBRARY_NAME } from "~typings/constants";

export let loader: LoaderFunction = async ({ params }) => {
  const result = await fetch("http://localhost:1337/api/get/article", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: `${params.id}`,
    } as ApiGetArticleRequest),
  });
  console.log(result);
  return result;
};

export const meta: MetaFunction = ({ data }) => {
  const result = data as ApiGetArticleResponse;
  return {
    title: `${result.article?.userId} ${result.article?.title}`,
  };
};

export default function Update() {
  const result = useLoaderData() as ApiGetProfileResponse;
  console.log(result);
  return (
    <div>
      <h1>Article {`${result}`}</h1>
    </div>
  );
}
