import Head from 'next/head'
import "../styles/globals.css";
import "../styles/landing.css";
import "../styles/authentication.css";
import "../styles/home.css";
import "../styles/bookmark.css";
import "../styles/navbar.css";
import "../styles/add-bookmark.css";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
TimeAgo.setDefaultLocale(en.locale)
TimeAgo.addLocale(en)

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>field-observer</title>
        <meta name="description" content="barebones bookmarking / note-taking site" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
