import Image from "next/image";
import Link from "next/link";

const FullFilePreview = ({ file, metadata }) => {
  const mimeImageTypes = [
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/webp",
    "image/jpg",
  ];
  const mimeDocTypes = ["application/pdf"];

  if (mimeImageTypes.includes(metadata.fileType)) {
    return (
      <div className="bookmark-full-view-file-preview">
        <Link href={file} target="_blank">
          <Image
            src={file}
            fill
            placeholder="blur"
            blurDataURL={metadata.blurPreview ? metadata.blurPreview : "//"}
          />
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

export default FullFilePreview;
