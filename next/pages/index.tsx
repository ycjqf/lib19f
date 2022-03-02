import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { LIBRARY_NAME, LIBRARY_SLOGAN } from "tps/constants";
import HeaderBar from "nxt/components/HeaderBar";
import { getProfileSSR } from "nxt/utils/req";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const profileResult = await getProfileSSR(context.req, context.res);
  console.log(profileResult);
  return { props: { profileResult } };
};

const Home = ({ profileResult }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>{`${LIBRARY_NAME} | ${LIBRARY_SLOGAN}`}</title>
        <meta name="description" content={`${LIBRARY_NAME} | ${LIBRARY_SLOGAN}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col relative">
        <HeaderBar authenticateRes={profileResult}></HeaderBar>
      </div>
    </>
  );
};

export default Home;
