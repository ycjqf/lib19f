/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { defaultHeader } from "_/config/request";
import SendIcon from "@mui/icons-material/Send";
import LoadingButton from "@mui/lab/LoadingButton";
import { Alert, TextField } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

export default function Upload() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<undefined | string>(undefined);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const onUpload = async () => {
    if (!editorRef.current) return;

    // @ts-ignore
    const inputed: string = editorRef.current.getContent();
    setLoading(true);

    try {
      const response = await axios.post<AddArticleResponse>(
        "/api/article/add",
        {
          title,
          description,
          body: inputed,
        } as AddArticleRequest,
        {
          headers: defaultHeader,
          validateStatus: () => true,
        }
      );
      if (response.status === 401) {
        navigate(`/login?redirect=${location.pathname}`);
        return;
      }
      if (response.status === 400) {
        setAlertMessage(response.data.message);
        return;
      }
      if (response.status === 200 && response.data.code === "OK") {
        navigate(`/articles/${response.data.id}`);
        return;
      }
    } catch (error) {
      setAlertMessage(error instanceof Error ? error.message : t("errorMessage.UnknownError"));
    } finally {
      setLoading(false);
    }
  };

  document.title = t("NavUpload");

  return (
    <div className="container mx-auto mt-4 mb-12">
      {alertMessage && <Alert severity="error">{alertMessage}</Alert>}

      <div className="flex flex-col gap-y-2 mb-6">
        <TextField
          label={t("Upload.Key.Title")}
          variant="standard"
          className="w-fit text-xl"
          size="medium"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label={t("Upload.Key.Description")}
          variant="standard"
          multiline
          size="small"
          className="w-1/2"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <Editor
        onInit={(evt, editor) => {
          // @ts-ignore
          editorRef.current = editor;
        }}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "preview",
            "help",
            "wordcount",
          ],
          placeholder: t("Upload.InitialText"),
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />

      <div className="flex justify-end mt-8">
        <LoadingButton
          onClick={onUpload}
          endIcon={<SendIcon />}
          loading={loading}
          loadingPosition="end"
          variant="contained"
        >
          {t("NavUpload")}
        </LoadingButton>
      </div>
    </div>
  );
}
