import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Article() {
  const { id } = useParams();
  const [response, setResponse] = useState<GetArticleResponse>();

  useEffect(() => {
    const requestData: GetArticleRequest = {
      id: parseInt(id || "0", 10),
    };

    axios
      .post<GetArticleResponse>("/api/get/article", requestData, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((response) => {
        setResponse(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);
  return (
    <div>
      <p>articles</p>
      <p>{JSON.stringify(response)}</p>
    </div>
  );
}
