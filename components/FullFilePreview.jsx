import Link from "next/link";

const FilePreview = ({ file, metadata }) => {
  const mimeImageTypes = [
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/webp",
    "image/jpg",
  ];
  const mimeDocTypes = ["application/pdf"];

  // "application/epub+zip",
  // "text/html",
  // "text/javascript",
  // "text/css",
  // "text/plain",
  // "text/markdown",

  if (mimeImageTypes.includes(metadata.fileType)) {
    return (
      <div className="bookmark-full-view-file-preview">
        <Link href={file} target="_blank">
          <img src={file} />
        </Link>
      </div>
    );
  } else if (mimeDocTypes.includes(metadata.fileType)) {
    return (
      <div className="bookmark-full-view-file-preview">
        <embed src={file} />
      </div>
    );
  } else {
    return (
      <div className="bookmark-full-view-file-nopreview">
        <Link href={file} target="_blank">
          <h4 className="bookmark-full-view-file-nopreview-text">
            No preview available ↗
          </h4>
        </Link>
      </div>
    );
  }
};

export default FilePreview;