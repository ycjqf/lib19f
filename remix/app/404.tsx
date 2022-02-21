import { Links, LiveReload, Meta, Link } from "remix";
import { default as notFoundIllustration } from "~/assets/not-found.svg";

export default function NotFound() {
  return (
    <div>
      <Meta />
      <Links />
      <div className="bg-gray-400 h-screen w-screen overflow-hidden">
        <div className="container mx-auto">
          <div className="h-fit my-auto mt-[180px] relative z-20">
            <div className="mb-16 text-white">
              <h4 className="text-6xl font-bold mb-6">我们找不到这个页面</h4>
              <p className="text-lg text-gray-50">或许你可以访问下面的这些网址</p>
            </div>
            <div className="flex gap-x-8">
              {[
                {
                  name: "主页",
                  link: "/",
                },
                {
                  name: "资料库",
                  link: "/articles",
                },
              ].map(i => (
                <Link to={i.link}>
                  <span className="border border-black px-6 py-2 bg-slate-100 hover:bg-white transition-colors">{i.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div
          className="g-404-img-center absolute top-0 right-0 h-full min-w-[640px] max-w-screen z-10 bg-cover bg-no-repeat"
          style={{ backgroundImage: `url('${notFoundIllustration}')` }}
        ></div>
      </div>
      {process.env.NODE_ENV === "development" && <LiveReload />}
    </div>
  );
}
