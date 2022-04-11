import { format } from "date-fns";
import { Link } from "react-router-dom";
// import IconButton from "@mui/material/IconButton";
// import EditIcon from "@mui/icons-material/Edit";

interface Props {
  article: Article;
}
export default function ArticlePeek({ article }: Props) {
  return (
    <div>
      {/* top */}
      <div className="mb-6">
        {/* title and actions */}
        <div className="inline-flex items-center justify-between w-full mb-2">
          <Link to={`/article/${article.id}`}>
            <span className="text-2xl cursor-pointer text-[#333333] inline-block truncate">
              {article.title}
            </span>
          </Link>
          {/* {currentUserId && currentUserId === article.user?.id && (
            <Link to={`/article/${article.id}/edit`}>
              <IconButton color="primary" size="small" aria-label="edit article">
                <EditIcon />
              </IconButton>
            </Link>
          )} */}
        </div>
        {/* description */}
        <p
          className={`text-xs ${
            typeof article.description !== "string" || article.description === ""
              ? "text-gray-300"
              : "text-gray-700"
          }`}
        >
          {typeof article.description !== "string" || article.description === ""
            ? "无详情"
            : article.description}
        </p>
      </div>
      {/* bottom */}
      <div className="flex gap-y-1 flex-col">
        <p className="text-xs text-gray-500 inline-flex items-center gap-x-1">
          {article.user && (
            <Link to={`/${article.user.name}`}>
              <span className="cursor-pointer">{article.user.name}</span>
            </Link>
          )}
          <span>
            {article.createdTime === article.updatedTime
              ? `创建于 ${format(new Date(article.createdTime), "yyyy-MM-dd HH:mm")}`
              : `更新于 ${format(new Date(article.updatedTime), "yyyy-MM-dd HH:mm")}`}
          </span>
        </p>
      </div>
    </div>
  );
}
