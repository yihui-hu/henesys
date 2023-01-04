import Link from "next/link";
import FullFilePreview from "../components/FullFilePreview";
import FullUrlPreview from "../components/FullUrlPreview";
import FullTextPreview from "../components/FullTextPreview";
const dayjs = require("dayjs");

export default function BookmarkFullView({
  bookmarkFullViewData,
  setBookmarkFullView,
  deleteBookmark,
  homeView,
}) {
  const username = bookmarkFullViewData.username;
  const text = bookmarkFullViewData.text;
  const file = bookmarkFullViewData.file;
  const url = bookmarkFullViewData.url;
  const note = bookmarkFullViewData.note;
  const tags = bookmarkFullViewData.tags;
  const metadata = bookmarkFullViewData.metadata;
  const timestamp = bookmarkFullViewData.timestamp;

  return (
    <div className="bookmark-full-view-container">
      <div className="bookmark-full-view">
        <div>
          {file && <FullFilePreview file={file} metadata={metadata} />}
          {url && <FullUrlPreview url={url} metadata={metadata} />}
          {text && <FullTextPreview text={text} />}
        </div>
        <div className="bookmark-full-view-info">
          <div className="bookmark-full-view-info-header">
            <div>
              {homeView && <h4>•••</h4>}
              {/* <h4>Edit</h4>
              <h4>Delete</h4> */}
            </div>
            <div
              className="bookmark-full-view-close-button"
              onClick={() => setBookmarkFullView(false)}
            >
              ✕
            </div>
          </div>
          <div className="bookmark-full-view-info-content">
            {file && <h4>{metadata.fileName}</h4>}
            {url && (
              <Link href={url} target="_blank">
                <h4>{metadata.title ? metadata.title : url} ↗</h4>
              </Link>
            )}
            <h4 className="bookmark-full-view-info-small-header">
              <h4>added by {username}</h4>
              <h4>{dayjs(Number(timestamp)).format("MMM DD, YYYY • HH:mm")}</h4>
            </h4>
            <br></br>
            {note && <h4 className="bookmark-full-view-info-note">{note}</h4>}
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
            {homeView && (
              <button
                type="button"
                className="bookmark-full-view-delete-button"
                onClick={() => deleteBookmark(bookmarkFullViewData)}
              >
                Delete bookmark
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
