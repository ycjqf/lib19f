import BrokenImageIcon from "@mui/icons-material/BrokenImage";
import { useTranslation } from "react-i18next";

export default function NotFount() {
  const { t } = useTranslation();
  document.title = t("errorMessage.NotFound");
  return (
    <div className="px-10 py-48 mx-auto max-w-xl flex flex-col items-center">
      <BrokenImageIcon
        className="mb-8 text-gray-300"
        style={{
          width: 128,
          height: 128,
        }}
      />
      <h3 className="text-2xl font-medium text-center text-gray-400">
        {t("errorMessage.NotFound")}
      </h3>
    </div>
  );
}
