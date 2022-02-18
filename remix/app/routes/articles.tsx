import { useLoaderData, useSearchParams } from "remix";
import type { LoaderFunction } from "remix";
import { Pagination } from "@mui/material";
import { ApiGetArticlesRequest, ApiGetArticlesResponse } from "~typings/api";
import { LIBRARY_NAME, LIBRARY_SLOGAN } from "~typings/constants";
import ArticlePeek from "~/components/ArticlePeek";

export let loader: LoaderFunction = async ({ request }) => {
  const params = new URL(request.url).searchParams;
  const result = await fetch("http://localhost:1337/api/get/articles", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      page: params.get("page"),
      pageSize: params.get("pageSize"),
    } as ApiGetArticlesRequest),
  });
  return result;
};

export default function Articles() {
  const { articles, code, current, pageSize, message, total } = useLoaderData() as ApiGetArticlesResponse;
  const [params, setParams] = useSearchParams();

  return (
    <div>
      <div className="w-full bg-slate-900 px-48 py-24 hidden">
        <h1 className="text-7xl font-bolder mb-10 whitespace-nowrap text-white">{LIBRARY_NAME}</h1>
        <p className="text-gray-300 text-lg">{LIBRARY_SLOGAN}</p>
      </div>
      <div className="container mx-auto">
        <div className="flex flex-col gap-y-10 my-10">
          <div className="w-fit mx-auto">
            <Pagination
              count={total > pageSize ? Math.ceil(total / pageSize) : 1}
              page={current}
              onChange={(event, page) => {
                if (page === 1) return setParams({});
                setParams({ page: `${page}` });
              }}
            />
          </div>
          {code === "OK" && articles.length === 0 && <p>空</p>}
          {code === "OK" && articles.map(art => <ArticlePeek key={art.id} preview={art} />)}
          {code === "WRONG_QUERY" && <p>{message}</p>}
          {code === "INTERNAL_ERROR" && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
}
