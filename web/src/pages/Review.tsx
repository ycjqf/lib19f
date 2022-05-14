import { defaultHeader } from "_/config/request";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import ReactHtmlParser from "react-html-parser";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

export default function Review() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [finalResponse, setFinalResponse] = useState<GetArticleResponse>();
  const [pageStatus, setPageStatus] = useState<PageStatus>("loading");
  const [pageMessage, setPageMessage] = useState<string>(t("errorMessage.Loading"));
  const [updating, setUpdating] = useState(false);

  function setStatus(status: string) {
    if (updating || !id) return;
    setUpdating(true);
    axios
      .post(
        "/api/review/set",
        { id: parseInt(id, 10), status },
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
        navigate("/reviews");
      })
      .catch((error) => {
        document.title =
          error instanceof Error ? error.message : t("errorMessage.UnknownError");
        setPageStatus("error");
        setPageMessage(error instanceof Error ? error.message : t("errorMessage.UnknownError"));
      });
  }

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
        "/api/review/get",
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
          <div>
            测试状态
            <button
              type="button"
              className="bg-green-400 text-white"
              onClick={() => setStatus("published")}
            >
              通过
            </button>
            <button
              type="button"
              className="bg-red-400 text-white"
              onClick={() => setStatus("rejected")}
            >
              未通过
            </button>
          </div>
          <h3>{finalResponse.article.title}</h3>
          <p>{finalResponse.article.description}</p>
          <p>{ReactHtmlParser(finalResponse.article.body)}</p>
        </div>
      )}
    </div>
  );
}
