import Image from "next/image";

const UrlPreview = ({ url, metadata }) => {
  const imageURL = metadata.preview_image_url;

  if (imageURL) {
    return (
      <div className="bookmark-modal-image">
        <Image
          src={imageURL}
          fill
          sizes="(max-width: 480px) calc(100vw - 1.6rem),
                 (max-width: 1024px) calc((100vw - 4rem) / 3),
                 calc((100vw - 7.5rem) / 4)"
          priority={true}
          alt={imageURL}
        />
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
