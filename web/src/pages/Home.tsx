import {} from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  document.title = `${t("global.title")} - ${t("global.introduction")}`;
  return (
    <div>
      <div className="w-full py-16">
        <div className="max-w-[1200px] mx-10">
          <h4 className="text-2xl font-bold mb-4">{t("global.title")}</h4>
          <p>{t("global.introduction")}</p>
        </div>
      </div>
    </div>
  );
}
