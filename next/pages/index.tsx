import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { LIBRARY_NAME, LIBRARY_SLOGAN } from "@typings/constants";
import HeaderBar from "@/components/HeaderBar";
import { Container } from "@mui/material";
import { getProfileSSR } from "@/utils/req";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const profileResult = await getProfileSSR(context.req, context.res);
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
      <HeaderBar authenticateRes={profileResult}></HeaderBar>

      <div className="bg-red w-full h-96 bg-red-300 flex items-center justify-center">
        <div className="mx-6 my-3 border border-white border-solid">立刻进入</div>
      </div>
      <div className="bg-red w-full h-96 bg-red-400"></div>
      <Container maxWidth="xl" className="py-2">
        <footer>{`${JSON.stringify("")}`}</footer>
      </Container>
    </>
  );
};

export default Home;
