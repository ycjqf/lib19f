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
export default function ArticlePeek(props: ArticlePeekProps) {
  return (
    <div className="px-4 py-2">
      {/* top */}
      <div className="mb-6">
        {/* title and actions */}
        <div className="inline-flex items-center justify-between w-full mb-2">
          <Link href={`/article/${props.preview.id}`} passHref>
            <a className="text-2xl cursor-pointer text-[#333333] inline-block truncate">
              {props.preview.title}
              <span className="text-gray-400 text-sm">#{props.preview.id}</span>
            </a>
          </Link>
          {props.currentUserId && props.currentUserId === props.preview.profile?.id && (
            <Link href={`/article/${props.preview.id}/edit`} passHref>
              <IconButton color="primary" size="small" aria-label="edit article">
                <EditIcon />
              </IconButton>
            </Link>
          )}
        </div>
        {/* description */}
        <p
          className={`text-xs ${
            props.preview.description === "" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {props.preview.description === "" ? "无详情" : props.preview.description}
        </p>
      </div>
      {/* bottom */}
      <div className="mb-6 flex gap-y-1 flex-col">
        <p className="text-xs text-gray-500 inline-flex items-center gap-x-1">
          {props.preview.profile && (
            <Link href={`/${props.preview.profile.name}`} passHref>
              <span className="cursor-pointer">{props.preview.profile.name}</span>
            </Link>
          )}
          <span>
            {props.preview.createdTime === props.preview.updatedTime
              ? `创建于 ${format(new Date(props.preview.createdTime), "yyyy-MM-dd HH:mm", {
                  locale: zhCN,
                })}`
              : `更新于 ${format(new Date(props.preview.updatedTime), "yyyy-MM-dd HH:mm", {
                  locale: zhCN,
                })}`}
          </span>
        </p>
      </div>
    </div>
  );
}
