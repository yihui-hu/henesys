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

const AddBookmarkModal = ({ setShown, communityView, bookmarks, updateBookmarks, token }) => {
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
      setErrorMsg("Upload a file or text/url.");
      setError(true);
      setSuccessMsg("");
      setSuccess(false);
      return;
    } else if (files[0] != undefined && files[0].status != 2) {
      setErrorMsg("Invalid file.");
      setError(true);
      setSuccessMsg("");
      setSuccess(false);
      return;
    }

    const tags_array = tags.map((tag) => tag.text.toLowerCase());

    // adding file bookmark
    if (text == "") {
      setAddingBookmark(true);

      let fileData = files[0];

      let file = {
        fileName: fileData.filename,
        fileType: fileData.fileType,
        fileBuffer: fileData.getFileEncodeBase64String(),
      };

      let metadata = {
        fileName: fileData.filename,
        fileType: fileData.fileType,
        fileSize: filesize(fileData.fileSize),
      };

      const response = await fetch("api/add-bookmark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({
          file: file,
          text: null,
          url: null,
          metadata,
          note,
          tags: tags_array,
        }),
      });

      const data = await response.json();

      if (data.status == "ok") {
        updateBookmarks([data.bookmark, ...bookmarks]);
        setSuccessMsg("Successfully added bookmark.");
        setSuccess(true);
        setErrorMsg("");
        setError(false);
        resetDefault();
      } else {
        setErrorMsg(data.error);
        setError(true);
        setSuccessMsg("");
        setSuccess(false);
        resetDefault();
      }

      // adding text bookmark
    } else {
      const isURL = isUrl(text);
      let response = null;

      // parse as URL
      if (isURL) {
        setAddingBookmark(true);

        let s3_response = await fetch("api/upload-url-preview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: text
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
            file: null,
            text: null,
            url: text,
            metadata: s3_data.metadata,
            note,
            tags: tags_array,
          })
        })

        // parse as normal body of text
      } else {
        response = await fetch("api/add-bookmark", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            file: null,
            text: text,
            url: null,
            metadata: null,
            note,
            tags: tags_array,
          }),
        });
      }

      const data = await response.json();

      if (data.status == "ok") {
        if (!communityView) {
          updateBookmarks([data.bookmark, ...bookmarks]);
        }
        setSuccessMsg("Successfully added bookmark.");
        setSuccess(true);
        setErrorMsg("");
        setError(false);
        resetDefault();
      } else {
        setErrorMsg(data.error);
        setError(true);
        setSuccessMsg("");
        setSuccess(false);
        resetDefault();
      }
    }

    setAddingBookmark(false);
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
                  maxFileSize={"5MB"}
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
                    onClick={resetDefault}
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
