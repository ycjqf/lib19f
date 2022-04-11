import { hideHeaderFooterPaths } from "_/config/ui";
import { Listbox } from "@headlessui/react";
import { ExternalLinkIcon, TranslateIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const languageOptions = [
    { id: "en", name: "English" },
    { id: "zh-CN", name: "简体中文" },
  ];
  const localLanguage = i18n.language;
  const [language, setLanguage] = useState<typeof languageOptions[number]>(
    languageOptions.find((i) => i.id === localLanguage) || languageOptions[0]
  );

  useEffect(() => {
    i18n.changeLanguage(language.id).finally(() => {});
  }, [language, i18n]);

  const staticSections = [
    {
      key: "entries",
      title: t("NavSectionEntries"),
      child: [
        { title: t("NavHome"), link: "/", outside: false },
        { title: t("NavArticles"), link: "/articles", outside: false },
        { title: t("NavAbout"), link: "/about", outside: false },
        { title: t("NavSearch"), link: "/search", outside: false },
        { title: t("NavUpload"), link: "/upload", outside: false },
        { title: t("NavRegister"), link: "/register", outside: false },
        { title: t("NavLogin"), link: "/login", outside: false },
      ],
    },
    {
      key: "externals",
      title: t("NavSectionAbout"),
      child: [
        { title: t("NavRepository"), link: "https://github.com/ycjqf/lib19f", outside: true },
        { title: "ycjqf", link: "https://github.com/ycjqf", outside: true },
      ],
    },
  ];
  return (
    <div
      className={`min-h-[300px] bg-[#131419] px-12 pt-12 pb-10 
    ${hideHeaderFooterPaths.includes(location.pathname) ? "hidden" : ""}
`}
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="flex gap-x-60 flex-wrap gap-y-12 mb-24">
          {staticSections.map((section) => (
            <div key={section.key}>
              <div className="text-[#999999] mb-6 text-base">{section.title}</div>
              <div className="flex flex-col gap-y-3">
                {section.child.map((child) =>
                  child.outside ? (
                    <a
                      key={child.link}
                      className="text-white text-base cursor-pointer hover:text-[#61dafb]
                    inline-flex items-center gap-x-2"
                      href={child.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {child.title}
                      <ExternalLinkIcon className="h-4 w-4 text-gray-500" />
                    </a>
                  ) : (
                    <Link
                      key={child.link}
                      className="text-white text-base cursor-pointer hover:text-[#61dafb]
                      flex items-center"
                      to={child.link}
                    >
                      {child.title}
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}
          <div className="">
            <Listbox value={language} onChange={setLanguage}>
              <Listbox.Button className="text-[#999999] mb-6 text-base inline-flex gap-x-2 items-center">
                <TranslateIcon className="h-4 w-4 text-gray-500" />
                {language.name}
              </Listbox.Button>
              <Listbox.Options className="text-white text-base flex flex-col gap-y-2">
                {languageOptions.map((languageItem) => (
                  <Listbox.Option
                    className="text-white text-base cursor-pointer hover:text-[#61dafb]
                    flex items-center"
                    key={languageItem.id}
                    value={languageItem}
                  >
                    {languageItem.name}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
          </div>
        </div>
        <div className="text-[#999999] text-xs w-full">
          2022
          <a
            className="hover:underline mx-1"
            target="_blank"
            href="https://github.com/ycjqf"
            rel="noreferrer"
          >
            ycjqf
          </a>
        </div>
      </div>
    </div>
  );
}
