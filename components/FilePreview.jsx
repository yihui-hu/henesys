import Image from "next/image";

const FilePreview = ({ file, metadata }) => {
  const mimeImageTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"];

  if (mimeImageTypes.includes(metadata.fileType)) {
    return (
      <div className="bookmark-modal-image">
        <img
          src={file}
          // fill
          // quality={50}
          // sizes="(max-width: 480px) calc(100vw - 1.6rem),
          //        (max-width: 1024px) calc((100vw - 4rem) / 3),
          //        calc((100vw - 7.5rem) / 4)"
          // priority={true}
        />
      </div>
    );
  } else {
    return (
      <div className="bookmark-modal-file">
        <h4 className="bookmark-modal-file-text">
          {metadata.fileType.split("/")[1]}
        </h4>
      </div>
    );
  }
};

export default FilePreview;
