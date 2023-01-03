import { useState } from "react";
import { m, LazyMotion, domAnimation } from "framer-motion";
import ReactTimeAgo from "react-time-ago";
import FilePreview from "./FilePreview";
import TextPreview from "./TextPreview";
import UrlPreview from "./UrlPreview";

const Bookmark = ({
  bookmark,
  index,
  communityView,
  showBookmarkFullView,
  deletedBookmarks,
}) => {
  const username = bookmark.username;
  const text = bookmark.text;
  const file = bookmark.file;
  const url = bookmark.url;
  const note = bookmark.note;
  const metadata = bookmark.metadata;
  const timestamp = bookmark.timestamp;

  const [hoverInfo, setHoverInfo] = useState(false);

  let delaySkipAmt = 36;

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className="bookmark-item"
        initial={{ y: "30px", opacity: 0 }}
        animate={{ y: "0px", opacity: 1 }}
        transition={{
          duration: 0.5,
          type: "spring",
          delay: ((index + deletedBookmarks) % delaySkipAmt) * 0.02,
        }}
        onMouseEnter={() => setHoverInfo(true)}
        onMouseLeave={() => setHoverInfo(false)}
      >
        <div onClick={() => showBookmarkFullView(bookmark)}>
          {file && <FilePreview file={file} metadata={metadata} />}
          {url  && <UrlPreview url={url} metadata={metadata} />}
          {text && <TextPreview text={text} />}
        </div>
        <div className="bookmark-info">
          {communityView && !hoverInfo && (
            <h4 className="bookmark-info-text">{`added by ${username}`}</h4>
          )}
          {file && (!communityView || (communityView && hoverInfo)) && (
            <h4 className="bookmark-info-text">
              {note ? note : metadata.fileName}
              <fade-info />
            </h4>
          )}
          {text && (!communityView || (communityView && hoverInfo)) && (
            <h4 className="bookmark-info-text">
              {note ? note : ""}
              <fade-info />
            </h4>
          )}
          {url && (!communityView || (communityView && hoverInfo)) && (
            <h4 className="bookmark-info-text">
              <a href={url} target="_blank" rel="noreferrer">
                ↗ {metadata.title ? metadata.title : url}
              </a>
              <fade-info />
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
      </m.div>
    </LazyMotion>
  );
};

export default Bookmark;
