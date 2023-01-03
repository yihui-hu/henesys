const UrlPreview = ({ url, metadata }) => {
  const imageURL = metadata.preview_image_url;

  if (imageURL) {
    return (
      <div className="bookmark-modal-image">
        <img src={imageURL} />
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
