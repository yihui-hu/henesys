import { useState } from "react";
import { filesize } from "filesize";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { WithContext as ReactTags } from "react-tag-input";
import useMediaQuery from "../hooks/useMediaQuery";
import Textarea from "react-textarea-autosize";
import isUrl from "is-url";

// import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// import FilePond plugins and styles
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileEncode,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType
);

const AddBookmarkModal = ({
  setShown,
  communityView,
  bookmarks,
  updateBookmarks,
  token,
}) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [files, setFiles] = useState([]);
  const [text, setText] = useState("");
  const [note, setNote] = useState("");
  const [tags, setTags] = useState([]);

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [filesUploaded, setFilesUploaded] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [addingBookmark, setAddingBookmark] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  async function submitBookmark(event) {
    event.preventDefault();

    if (text == "" && files.length == 0) {
      displayErrorMsg("Upload a file or text/url.");
      return;
    } else if (files[0] != undefined && files[0].status != 2) {
      displayErrorMsg("Only files under 3MB are allowed.");
      return;
    }

    setAddingBookmark(true);
    const tags_array = tags.map((tag) => tag.text.toLowerCase());
    let response;

    // adding file bookmark
    if (text == "") {
      const file = {
        fileName: files[0].filename,
        fileType: files[0].fileType,
        fileSize: filesize(files[0].fileSize),
        fileBuffer: files[0].getFileEncodeBase64String(),
      };

      response = await fetch("api/add-file-bookmark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({
          file: file,
          note: note,
          tags: tags_array
        })
      });
      // adding text bookmark
    } else {
      // parse as URL
      if (isUrl(text)) {
        let s3_response = await fetch("api/upload-url-preview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: text,
          }),
        });

        const s3_data = await s3_response.json();

        response = await fetch("api/add-url-bookmark", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            url: text,
            metadata: s3_data.metadata,
            note: note,
            tags: tags_array,
          })
        });

        // parse as normal body of text
      } else {
        response = await fetch("api/add-text-bookmark", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            text: text,
            note,
            tags: tags_array,
          }),
        });
      }
    }

    const data = await response.json();

    if (data.status == "ok") {
      if (!communityView) {
        updateBookmarks([data.bookmark, ...bookmarks]);
      }
      displaySuccessMsg("Successfully added bookmark.");
      resetDefault();
    } else {
      displayErrorMsg(data.error);
      resetDefault();
    }

    setAddingBookmark(false);
  }

  function displayErrorMsg(message) {
    setErrorMsg(message);
    setError(true);
    setSuccess(false);
  }

  function displaySuccessMsg(message) {
    setSuccessMsg(message);
    setSuccess(true);
    setError(false);
  }

  function resetDefault() {
    setText("");
    setNote("");
    setTags([]);
    setFiles([]);
    setFilesUploaded(false);
    setInputFocused(false);
    setSubmitDisabled(false);
  }

  function handleFileStart() {
    setSubmitDisabled(true);
    setFilesUploaded(true);
  }

  function handleFileProcessed() {
    setSubmitDisabled(false);
  }

  const delimiters = [188, 13];

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag) => {
    setTags([...tags, tag]);
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className="add-bookmark-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={() => (isDesktop ? setShown(false) : undefined)}
      >
        <m.div
          className="add-bookmark-modal"
          initial={{ y: "15px", opacity: 0 }}
          animate={{ y: "0px", opacity: 1 }}
          exit={{ y: "15px", opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          {addingBookmark && <h4>Adding bookmark... </h4>}
          {!addingBookmark && (
            <form onSubmit={submitBookmark}>
              {!inputFocused && (
                <h4 className="add-bookmark-input-header">Upload a file</h4>
              )}
              {!inputFocused && (
                <FilePond
                  files={files}
                  onupdatefiles={setFiles}
                  onaddfilestart={handleFileStart}
                  onremovefile={() => {
                    setFilesUploaded(false);
                  }}
                  onaddfile={handleFileProcessed}
                  allowMultiple={false}
                  allowFileEncode={true}
                  acceptedFileTypes={[
                    "image/jpeg",
                    "image/png",
                    "image/jpg",
                    "image/gif",
                    "image/webp",
                    "application/pdf",
                    "application/epub+zip",
                    "text/html",
                    "text/javascript",
                    "text/css",
                    "text/plain",
                    "text/markdown",
                  ]}
                  maxFiles={1}
                  maxFileSize={"3MB"}
                  name="files"
                  labelIdle='Drag & drop or <span class="filepond--label-action">choose</span> file to upload'
                  credits={false}
                />
              )}
              {!filesUploaded && (
                <h4 className="add-bookmark-input-header">
                  {inputFocused ? "Add text or URL" : "Add text or URL instead"}
                </h4>
              )}
              {!filesUploaded && (
                <Textarea
                  type="textarea"
                  placeholder="Text or URL (article, image, etc.)"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  className="add-bookmark-input"
                  minRows={1}
                  maxRows={4}
                />
              )}
              {(filesUploaded || inputFocused) && (
                <h4 className="add-bookmark-input-header">Add note</h4>
              )}
              {(filesUploaded || inputFocused) && (
                <Textarea
                  type="textarea"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="add-bookmark-input"
                  minRows={2}
                  maxRows={3}
                />
              )}
              {(filesUploaded || inputFocused) && (
                <h4 className="add-bookmark-input-header">Add tags</h4>
              )}
              {(filesUploaded || inputFocused) && (
                <ReactTags
                  classNames={{
                    tag: "add-bookmark-tag",
                    selected: "add-bookmark-tag-container",
                    remove: "add-bookmark-remove-tag",
                    tagInputField: "add-bookmark-input",
                  }}
                  tags={tags}
                  allowDragDrop={false}
                  autofocus={false}
                  delimiters={delimiters}
                  handleDelete={handleDelete}
                  handleAddition={handleAddition}
                  inputFieldPosition="bottom"
                />
              )}
              {error && <p className="auth-error-message">{errorMsg}</p>}
              {success && <p className="auth-success-message">{successMsg}</p>}
              <div className="add-bookmark-button-container">
                {!filesUploaded && !inputFocused && (
                  <button
                    type="button"
                    onClick={() => setShown(false)}
                    className="add-bookmark-secondary-button"
                  >
                    Cancel
                  </button>
                )}
                {(filesUploaded || inputFocused) && (
                  <button
                    type="button"
                    onClick={() => {
                      setError(false);
                      setSuccess(false);
                      resetDefault();
                    }}
                    className="add-bookmark-secondary-button"
                  >
                    Back
                  </button>
                )}
                {!submitDisabled && (
                  <input
                    type="submit"
                    value="Add bookmark"
                    className="add-bookmark-primary-button"
                  />
                )}
              </div>
            </form>
          )}
        </m.div>
      </m.div>
    </LazyMotion>
  );
};

export default AddBookmarkModal;
