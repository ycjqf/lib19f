import Head from "next/head";
import Link from "next/link";
import Mlink from "@mui/material/Link";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>不存在的页面</title>
      </Head>
      <div className="px-4 py-6">
        <div className="flex flex-col gap-y-1 mb-6">
          <h1 className="text-stone-900">我们找不到这个页面</h1>
          <p className="text-stone-600">但或许你可以访问下面的链接</p>
        </div>
        <div className="flex gap-x-2">
          {[
            {
              name: "主页",
              href: "/",
            },
            {
              name: "文章",
              href: "/articles",
            },
          ].map(item => (
            <Link key={item.href} href={item.href} passHref>
              <Mlink underline="hover">{item.name}</Mlink>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
