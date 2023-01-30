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
            sizes="(max-width: 480px) 100vw,
                   (max-width: 1024px) 100vw,
                   70vw"
            priority={true}
            alt={file}
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
            No preview available {" "}<svg
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
              </svg>
          </h4>
        </Link>
      </div>
    );
  }
};

export default FullFilePreview;
