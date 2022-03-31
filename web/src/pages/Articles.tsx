import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { defaultHeader } from "src/config/request";
import ArticlePeek from "src/components/ArticlePeek";
import axios from "axios";
import { Pagination } from "@mui/material";

export default function Articles() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [finalResponse, setFinalResponse] = useState<GetArticleResponse>();

  document.title = t("NavArticles");

  useEffect(() => {
    const requestData: GetArticlesRequest = {
      page: parseInt(searchParams.get("page") || "1", 10),
      pageSize: parseInt(searchParams.get("pageSize") || "10", 10),
      search: searchParams.get("search") || "",
      userId: parseInt(searchParams.get("user-id") || "0", 10),
      userName: searchParams.get("user-name") || "",
      since: parseInt(searchParams.get("since") || "0", 10),
      till: parseInt(searchParams.get("till") || "0", 10),
      status: searchParams.get("status") || "",
      sort: searchParams.get("sort") || "",
    };

    axios
      .post<GetArticleResponse>("/api/get/articles", requestData, { headers: defaultHeader })
      .then(response => {
        setFinalResponse(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [searchParams]);
  return (
    <div className="px-12 py-28">
      <div className="max-w-[1200px] mx-auto ">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-12">
          {finalResponse?.articles?.map(article => (
            <ArticlePeek article={article} key={article.id} />
          ))}
        </div>
        <div className="pb-16 pt-48">
          <div className="w-full">
            <Pagination
              className="w-fit mx-auto"
              count={
                (finalResponse?.total || 0) > (finalResponse?.pageSize || 10)
                  ? Math.ceil((finalResponse?.total || 0) / (finalResponse?.pageSize || 10))
                  : 1
              }
              page={finalResponse?.current || 1}
              onChange={(event, page) => {
                if (page === 1) return setSearchParams({});
                return setSearchParams({
                  page: `${page}`,
                  pageSize: `${finalResponse?.pageSize || 10}`,
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
