import Head from "next/head";
import "../styles/globals.css";
import "../styles/landing.css";
import "../styles/authentication.css";
import "../styles/home.css";
import "../styles/bookmark.css";
import "../styles/bookmark-full-view.css";
import "../styles/navbar.css";
import "../styles/add-bookmark.css";
import "../styles/404.css";

// import { Work_Sans } from "@next/font/google";
// const work_sans = Work_Sans({
//   subsets: ["latin"],
// });

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>field-observer</title>
        <meta
          name="description"
          content="barebones bookmarking / note-taking site"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="field-observer" />
        <meta name="apple-mobile-web-app-status-bar" content="#ffffff" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" sizes="512x512" href="logo-512x512.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <main className={work_sans.className}> */}
        <Component {...pageProps} />
      {/* </main> */}
    </>
  );
}
