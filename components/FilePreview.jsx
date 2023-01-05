import Image from "next/image";

const FilePreview = ({ file, metadata }) => {
  const mimeImageTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"];

  if (mimeImageTypes.includes(metadata.fileType)) {
    return (
      <div className="bookmark-modal-image">
        <Image src={file} fill quality={50}/>
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
