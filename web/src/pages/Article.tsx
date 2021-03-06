import { defaultHeader } from "_/config/request";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import ReactHtmlParser from "react-html-parser";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export default function Article() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [finalResponse, setFinalResponse] = useState<GetArticleResponse>();
  const [pageStatus, setPageStatus] = useState<PageStatus>("loading");
  const [pageMessage, setPageMessage] = useState<string>(t("errorMessage.Loading"));

  useEffect(() => {
    document.title = t("errorMessage.Loading");
    setPageStatus("loading");
    setPageMessage(t("errorMessage.Loading"));
    const idInQuery = parseInt(id || "", 10);
    if (Number.isNaN(idInQuery) || idInQuery <= 0) {
      setPageStatus("error");
      setPageMessage(t("errorMessage.BadRequest"));
      return;
    }

    axios
      .post<GetArticleResponse, AxiosResponse<GetArticleResponse>, GetArticleRequest>(
        "/api/article/get",
        { id: idInQuery },
        {
          headers: defaultHeader,
          validateStatus: () => true,
        }
      )
      .then((response) => {
        if (response.data.code === "BAD_REQUEST") throw new Error(t("errorMessage.BadRequest"));
        if (response.data.code === "INTERNAL_ERROR")
          throw new Error(t("errorMessage.InternalServerError"));
        if (response.data.code === "NOT_FOUND") throw new Error(t("errorMessage.NotFound"));
        if (response.data.code !== "OK") throw new Error(t("errorMessage.UnknownError"));
        setFinalResponse(response.data);
        setPageStatus("ready");
        setPageMessage(t("errorMessage.OK"));
        document.title = response.data.article.title;
      })
      .catch((error) => {
        document.title =
          error instanceof Error ? error.message : t("errorMessage.UnknownError");
        setPageStatus("error");
        setPageMessage(error instanceof Error ? error.message : t("errorMessage.UnknownError"));
      });
  }, [id]);

  return (
    <div>
      {pageStatus !== "ready" && (
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

      {pageStatus === "ready" && finalResponse && finalResponse.code === "OK" && (
        <div className="container mx-auto">
          <h3>{finalResponse.article.title}</h3>
          <p>{finalResponse.article.description}</p>
          <p>{ReactHtmlParser(finalResponse.article.body)}</p>{" "}
        </div>
      )}
    </div>
  );
}
