const TextPreview = ({ text }) => {
  return (
    <div className="bookmark-modal-text">
      <div className="bookmark-modal-text-box">
        <h4>{text}</h4>
      </div>
      <fade-text />
    </div>
  );
};

export default TextPreview;
