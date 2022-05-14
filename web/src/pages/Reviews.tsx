import ArticlePeek from "_/components/ArticlePeek";
import { defaultHeader } from "_/config/request";
import { POSITIVE_INTEGER_REGEX } from "_/config/validates";
import { Pagination } from "@mui/material";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

export default function Reviews() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [finalResponse, setFinalResponse] = useState<GetArticlesResponse>();
  const [pageStatus, setPageStatus] = useState<PageStatus>("loading");
  const [pageMessage, setPageMessage] = useState("loading");
  const defaultPageSize = 10;

  document.title = t("NavArticles");

  useEffect(() => {
    const rawPage = searchParams.get("page") || "1";
    const rawPageSize = searchParams.get("pageSize") || `${defaultPageSize}`;
    if (!POSITIVE_INTEGER_REGEX.test(rawPage) || !POSITIVE_INTEGER_REGEX.test(rawPageSize)) {
      setPageStatus("error");
      setPageMessage(t("errorMessage.BadRequest"));
      return;
    }

    const requestData: GetArticlesRequest = {
      page: parseInt(`${searchParams.get("page") || "1"}`, 10),
      pageSize: parseInt(`${searchParams.get("pageSize") || `${defaultPageSize}`}`, 10),
      search: "",
      userId: 0,
      userName: "",
      since: 0,
      till: 0,
      status: "",
      sort: "",
    };

    axios
      .post<GetArticlesResponse>("/api/reviews/get", requestData, { headers: defaultHeader })
      .then((response) => {
        if (response.data.code !== "OK") throw new Error(t("errorMessage.BadRequest"));
        setFinalResponse(response.data);
        setPageStatus("ready");
        setPageMessage("all data has been loaded");
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((error: AxiosError) => {
        setPageStatus("error");
        setPageMessage(error.response?.data.message || t("errorMessage.UnknownError"));
      });
  }, [searchParams]);

  function onPageChange(page: number) {
    if (page === 1) {
      searchParams.delete("page");
      return setSearchParams(searchParams);
    }
    return setSearchParams({
      ...searchParams,
      page: `${page}`,
    });
  }

  return (
    <div className="px-12 py-28">
      <div className="max-w-[1200px] mx-auto">
        {(pageStatus !== "ready" || !finalResponse) && (
          <div className="mb-6">
            <h3
              className={`text-sm mb-2 text-center 
        ${pageStatus === "error" && " text-red-500"}
        ${pageStatus === "loading" && " text-gray-500"}
        `}
            >
              {pageMessage}
            </h3>
          </div>
        )}
        {pageStatus === "ready" && finalResponse && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-12">
            {finalResponse.articles.map((article) => (
              <ArticlePeek article={article} key={article.id} review />
            ))}
          </div>
        )}
        {/* will use previous final response when it's not initial fetch */}
        {/* which will only set after fetch success and will not reset before it */}
        {finalResponse && (
          <div className="pb-16 pt-24">
            <div className="w-full">
              <Pagination
                className="w-fit mx-auto"
                count={Math.ceil(finalResponse.total / finalResponse.pageSize)}
                page={finalResponse.current}
                onChange={(event, page) => onPageChange(page)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
