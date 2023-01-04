import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

const FilePreview = ({ file, metadata }) => {
  const mimeImageTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"];

  if (mimeImageTypes.includes(metadata.fileType)) {
    return (
      <div className="bookmark-modal-image">
          <LazyLoadImage src={file} effect={blur} />
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
