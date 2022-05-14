import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();
  document.title = `${t("NavAbout")} - ${t("global.title")}`;
  return (
    <div>
      <div className="w-full py-32">
        <div className="px-10 max-w-xl mx-auto mb-12">
          <h4 className="text-5xl text-center font-bold mb-4">{t("global.title")}</h4>
          <p className="text-center text-base text-slate-600">{t("global.brief")}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 px-10 max-w-3xl mx-auto">
          <div>
            <div className="w-full h-0 pt-[100%] relative mb-2">
              <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                <SecurityIcon className="text-blue-600" style={{ width: 64, height: 64 }} />
              </div>
            </div>
            <div className="w-full text-center">权限分离</div>
          </div>

          <div>
            <div className="w-full h-0 pt-[100%] relative mb-2">
              <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                <SpeedIcon className=" text-orange-600" style={{ width: 64, height: 64 }} />
              </div>
            </div>
            <div className="w-full text-center">速度优异</div>
          </div>
        </div>
      </div>
    </div>
  );
}
