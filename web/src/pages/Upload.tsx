import axios, { AxiosError } from "axios";
import { useState } from "react";
import { defaultHeader } from "src/config/request";

export default function Upload() {
  const [uploadForm, setUploadForm] = useState<AddArticleRequest>({
    title: "",
    description: "",
    body: "",
  });

  const upload = () => {
    axios
      .post<AddArticleRequest>("/api/add/article", uploadForm, {
        headers: defaultHeader,
      })
      .then(response => {
        console.log("response");
        console.log(response.data);
      })
      .catch((error: AxiosError<AddArticleResponse>) => {
        console.log("error");
        if (error.response?.status === 400) {
          // wrong format request
          // usually validations need to be done in front end
          alert(error.response.data.message);
          return;
        }
        console.log(error);
      });
  };

  return (
    <div>
      <input
        type="text"
        value={uploadForm.title}
        placeholder="title"
        onChange={event =>
          setUploadForm(prev => ({
            ...prev,
            title: event.target.value,
          }))
        }
      />
      <input
        type="text"
        value={uploadForm.description}
        placeholder="description"
        onChange={event =>
          setUploadForm(prev => ({
            ...prev,
            description: event.target.value,
          }))
        }
      />
      <input
        type="text"
        value={uploadForm.body}
        placeholder="body"
        onChange={event =>
          setUploadForm(prev => ({
            ...prev,
            body: event.target.value,
          }))
        }
      />
      <button onClick={upload}>upload</button>
    </div>
  );
}
