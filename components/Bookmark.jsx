import { useState } from "react";
import useMediaQuery from "../hooks/useMediaQuery";
import ReactTimeAgo from "react-time-ago";
import FilePreview from "./FilePreview";
import UrlPreview from "./UrlPreview";
import TextPreview from "./TextPreview";

const Bookmark = ({
  bookmark,
  communityView,
  showBookmarkFullView,
}) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const username = bookmark.username;
  const text = bookmark.text;
  const file = bookmark.file;
  const url = bookmark.url;
  const title = bookmark.title;
  const note = bookmark.note;
  const metadata = bookmark.metadata;
  const timestamp = bookmark.timestamp;

  const [hoverInfo, setHoverInfo] = useState(false);

  return (
    <div
      className="bookmark-item"
      onMouseEnter={() => (isDesktop ? setHoverInfo(true) : undefined)}
      onMouseLeave={() => (isDesktop ? setHoverInfo(false) : undefined)}
    >
      <div onClick={() => showBookmarkFullView(bookmark)}>
        {file && <FilePreview file={file} metadata={metadata} />}
        {url && <UrlPreview url={url} metadata={metadata} />}
        {text && <TextPreview text={text} />}
      </div>
      <div className="bookmark-info">
        {communityView && !hoverInfo && (
          <h4 className="bookmark-info-text">{`added by ${username}`}</h4>
        )}
        {file && (!communityView || (communityView && hoverInfo)) && (
          <h4 className="bookmark-info-text">
            {title ? title : metadata.fileName}
          </h4>
        )}
        {text && (!communityView || (communityView && hoverInfo)) && (
          <h4 className="bookmark-info-text">{title ? title : note}</h4>
        )}
        {url && (!communityView || (communityView && hoverInfo)) && (
          <h4 className="bookmark-info-text">
            <a href={url} target="_blank" rel="noreferrer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="bookmark-info-link-icon"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                  clipRule="evenodd"
                />
              </svg>{" "}
              {title ? title : metadata.title ? metadata.title : url}
            </a>
          </h4>
        )}
        <h4 className="bookmark-info-timestamp">
          {
            <ReactTimeAgo
              date={parseInt(timestamp)}
              locale="en-US"
              timeStyle="twitter"
            />
          }
        </h4>
      </div>
    </div>
  );
};

export default Bookmark;
