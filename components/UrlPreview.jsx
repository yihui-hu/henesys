import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const UrlPreview = ({ url, metadata }) => {
  const imageURL = metadata.preview_image_url;

  if (imageURL) {
    return (
      <div className="bookmark-modal-image">
        <LazyLoadImage src={imageURL} effect="blur" />
      </div>
    );
  } else {
    return (
      <div className="bookmark-modal-text">
        <div className="bookmark-modal-text-box">
          <h4>{url}</h4>
        </div>
        <fade-text />
      </div>
    );
  }
};

export default UrlPreview;
