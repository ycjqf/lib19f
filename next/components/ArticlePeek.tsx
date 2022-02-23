import Link from "next/link";
import { ArticlePreview } from "@typings/api";

interface ArticlePeekProps {
  preview: ArticlePreview;
}
export default function ArticlePeek(props: ArticlePeekProps) {
  return (
    <div
      className="shadow-sm bg-slate-200 hover:shadow-md transition-shadow h-36
     hover:transition-none ease-out rounded px-4 py-6"
    >
      <Link href={`/article/${props.preview.id}`} passHref>
        <h4 className="text-2xl text-[#333333]">{props.preview.title}</h4>
      </Link>

      <div className="mb-6">
        <p
          className={`${
            props.preview.description === "" ? "text-[#7e7e7e]" : "text-[#131419]"
          }`}
        >
          {props.preview.description === "" ? props.preview.description : "无详情"}
        </p>
      </div>
    </div>
  );
}
