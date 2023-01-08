import Image from "next/image";
import Link from "next/link";

const FullUrlPreview = ({ url, metadata }) => {
  const imageURL = metadata.preview_image_url;

  if (imageURL) {
    return (
      <div className="bookmark-full-view-file-preview">
        <Link href={url} target="_blank">
          <Image
            src={imageURL}
            fill
            quality={75}
            sizes="(max-width: 480px) 100vw,
                   (max-width: 1024px) 100vw,
                   70vw"
            priority={true} 
          />
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

export default FullUrlPreview;
