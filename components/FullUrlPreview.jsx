import Link from "next/link"

const UrlPreview = ({ url, metadata }) => {
  const imageURL = metadata.preview_image_url;

  if (imageURL) {
    return (
      <div className="bookmark-full-view-file-preview">
        <Link href={url} target="_blank">
          <img src={imageURL} />
        </Link>
      </div>
    );
  } else {
    return (
      <div className="bookmark-full-view-file-nopreview">
        <Link href={url} target="_blank">
          <h4 className="bookmark-full-view-file-nopreview-text">
            No preview available ↗
          </h4>
        </Link>
      </div>
    );
  }
};

export default UrlPreview;