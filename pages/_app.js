import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import Navbar from "../components/Navbar";
import Head from "next/head";

import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.min.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Versus</title>
        <meta name="application-name" content="Versus" />
        <meta name="description" content="Create simple comparisons" />
        <meta name="rating" content="General" />
      </Head>
      <header>
        <Navbar />
      </header>
      <Component {...pageProps} />
      <ToastContainer />
    </SessionProvider>
  );
}

export default MyApp;
