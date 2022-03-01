import Link from "next/link";
import { ArticlePreview } from "@typings/api";
import { zhCN } from "date-fns/locale";
import { format } from "date-fns";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

interface ArticlePeekProps {
  preview: ArticlePreview;
  currentUserId: ArticlePreview["profile"]["id"] | undefined;
}
export default function ArticlePeek({ preview, currentUserId }: ArticlePeekProps) {
  return (
    <div className="px-4 py-2">
      {/* top */}
      <div className="mb-6">
        {/* title and actions */}
        <div className="inline-flex items-center justify-between w-full mb-2">
          <Link href={`/article/${preview.id}`} passHref>
            <span className="text-2xl cursor-pointer text-[#333333] inline-block truncate">
              {preview.title}
              <span className="text-gray-400 text-sm">#{preview.id}</span>
            </span>
          </Link>
          {currentUserId && currentUserId === preview.profile?.id && (
            <Link href={`/article/${preview.id}/edit`} passHref>
              <IconButton color="primary" size="small" aria-label="edit article">
                <EditIcon />
              </IconButton>
            </Link>
          )}
        </div>
        {/* description */}
        <p
          className={`text-xs ${
            preview.description === "" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {preview.description === "" ? "无详情" : preview.description}
        </p>
      </div>
      {/* bottom */}
      <div className="mb-6 flex gap-y-1 flex-col">
        <p className="text-xs text-gray-500 inline-flex items-center gap-x-1">
          {preview.profile && (
            <Link href={`/${preview.profile.name}`} passHref>
              <span className="cursor-pointer">{preview.profile.name}</span>
            </Link>
          )}
          <span>
            {preview.createdTime === preview.updatedTime
              ? `创建于 ${format(new Date(preview.createdTime), "yyyy-MM-dd HH:mm", {
                  locale: zhCN,
                })}`
              : `更新于 ${format(new Date(preview.updatedTime), "yyyy-MM-dd HH:mm", {
                  locale: zhCN,
                })}`}
          </span>
        </p>
      </div>
    </div>
  );
}
