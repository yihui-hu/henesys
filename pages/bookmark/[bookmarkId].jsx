import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getServerSideProps } from "../../lib/authBookmark";
import Link from "next/link";
import Head from "next/head";
import useMediaQuery from "../../hooks/useMediaQuery";
import FullFilePreview from "../../components/FullFilePreview";
import FullUrlPreview from "../../components/FullUrlPreview";
import FullTextPreview from "../../components/FullTextPreview";
const dayjs = require("dayjs");

export default function BookmarkPage({ isLoggedIn }) {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const { bookmarkId } = router.query;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getBookmark();
  }, []);

  async function getBookmark() {
    const res = await fetch(`/api/get-bookmark-from-id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: bookmarkId,
      }),
    });

    const data = await res.json();

    if (data.status == "ok") {
      setId(data.bookmark._id);
      setUsername(data.bookmark.username);
      setText(data.bookmark.text);
      setFile(data.bookmark.file);
      setUrl(data.bookmark.url);
      setMetadata(data.bookmark.metadata);
      setTimestamp(data.bookmark.timestamp);
      setTitle(data.bookmark.title ? data.bookmark.title : "");
      setNote(data.bookmark.note);
      setTags(data.bookmark.tags);
    } else {
      router.push("/404");
    }

    setIsLoading(false);
  }

  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState("");
  const [url, setUrl] = useState("");
  const [metadata, setMetadata] = useState({});
  const [timestamp, setTimestamp] = useState("");

  const [title, setTitle] = useState(null);
  const [note, setNote] = useState("");
  const [tags, setTags] = useState([]);

  const [linkCopied, setLinkCopied] = useState(false);

  const paramsObj = {
    username: username,
    title: title ? title : "null",
    previewImg: file ? file : "null",
    previewText: text ? text : "null",
  };
  const searchParams = new URLSearchParams(paramsObj);

  return (
    <>
      {!isLoading && (
        <>
          <Head>
            <title>{title ? `${title} — henesys` : "henesys"}</title>
            <description>henesys bookmark added by {username}</description>
            <meta
              property="og:image"
              content={`https://henesys.online/api/og/?${searchParams.toString()}?`}
            />
          </Head>
          <div className="bookmark-full-view-container">
            <div className="bookmark-full-view">
              {isMobile && (
                <div className="bookmark-full-view-info-header">
                  {!isLoggedIn && (
                    <>
                      <div></div>
                      <Link
                        href="/"
                        className="bookmark-full-view-join-henesys"
                      >
                        join henesys{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="bookmark-full-view-join-henesys-icon"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                            clipRule="evenodd"
                          />
                          <path
                            fillRule="evenodd"
                            d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    </>
                  )}
                  {isLoggedIn && (
                    <>
                      <div></div>
                      <div
                        className="bookmark-full-view-close-button"
                        onClick={() => {
                          router.push(`/home`, null, {
                            scroll: false,
                          });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="bookmark-full-view-close-icon"
                        >
                          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
                      </div>
                    </>
                  )}
                </div>
              )}
              <div>
                {file && <FullFilePreview file={file} metadata={metadata} />}
                {url && <FullUrlPreview url={url} metadata={metadata} />}
                {text && <FullTextPreview text={text} />}
              </div>
              <div className="bookmark-full-view-info">
                {!isMobile && (
                  <div className="bookmark-full-view-info-header">
                    {!isLoggedIn && (
                      <>
                        <div></div>
                        <Link
                          href="/"
                          className="bookmark-full-view-join-henesys"
                        >
                          join henesys{" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="bookmark-full-view-join-henesys-icon"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                              clipRule="evenodd"
                            />
                            <path
                              fillRule="evenodd"
                              d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </Link>
                      </>
                    )}
                    {isLoggedIn && (
                      <>
                        <div></div>
                        <div
                          className="bookmark-full-view-close-button"
                          onClick={() => {
                            router.push(`/home`, null, {
                              scroll: false,
                            });
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="bookmark-full-view-close-icon"
                          >
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                          </svg>
                        </div>
                      </>
                    )}
                  </div>
                )}
                <div className="bookmark-full-view-info-content">
                  <div className="bookmark-full-view-info-title">
                    {file && <h4>{title ? title : metadata.fileName}</h4>}
                    {text && <h4>{title ? title : ""}</h4>}
                    {url && (
                      <Link href={url} target="_blank">
                        <h4>
                          {title
                            ? title
                            : metadata.title
                            ? metadata.title
                            : url}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="bookmark-full-view-link-icon"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                              clipRule="evenodd"
                            />
                          </svg>{" "}
                        </h4>
                      </Link>
                    )}
                  </div>
                  <div className="bookmark-full-view-info-small-header">
                    <div>
                      <h4>added by {username}</h4>
                      <h4
                        className="copy-link"
                        onClick={() => {
                          setLinkCopied(true);
                          navigator.clipboard.writeText(
                            `https://henesys.online/bookmark/${id}`
                          );
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="copy-link-icon"
                        >
                          <path
                            fillRule="evenodd"
                            d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z"
                            clipRule="evenodd"
                          />
                        </svg>{" "}
                        {!linkCopied ? "Copy link" : "Copied!"}
                      </h4>
                    </div>
                    <h4>
                      {dayjs(Number(timestamp)).format("MMM DD, YYYY • HH:mm")}
                    </h4>
                  </div>
                  <br></br>
                  {note && (
                    <h4 className="bookmark-full-view-info-note">{note}</h4>
                  )}
                  {tags.length != 0 && (
                    <div className="bookmark-full-view-info-tags-container">
                      {tags.map(function (tag, i) {
                        return (
                          <div className="bookmark-full-view-info-tags" key={i}>
                            {tag}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export { getServerSideProps };
