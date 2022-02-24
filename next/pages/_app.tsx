import "@/styles/output.css";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextNProgress
        color="#1f6feb"
        startPosition={0.3}
        stopDelayMs={200}
        height={2.5}
        showOnShallow={true}
        options={{ easing: "ease", speed: 500, showSpinner: false }}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
