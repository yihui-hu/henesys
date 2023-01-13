import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { WithContext as ReactTags } from "react-tag-input";
import useMediaQuery from "../hooks/useMediaQuery";
import Link from "next/link";
import Textarea from "react-textarea-autosize";
import FullFilePreview from "../components/FullFilePreview";
import FullUrlPreview from "../components/FullUrlPreview";
import FullTextPreview from "../components/FullTextPreview";
const dayjs = require("dayjs");

export default function BookmarkFullView({
  bookmarkId,
  bookmarkFullViewData,
  setBookmarkFullViewData,
  bookmarks,
  setBookmarks,
  deleteBookmark,
  homeView,
  token,
}) {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    getBookmark();
  }, []);

  useEffect(() => {
    router.beforePopState(({ as }) => {
      if (as !== router.asPath) {
        setBookmarkFullViewData(null);
      }
      return true;
    });

    return () => {
      router.beforePopState(() => true);
    };
  }, [router]);

  async function getBookmark() {
    const res = await fetch(`/api/get-bookmark-from-id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: bookmarkId,
      }),
    });

    const data = await res.json();

    if (data.status == "ok") {
      setId(data.bookmark._id);
      setUsername(data.bookmark.username);
      setText(data.bookmark.text);
      setFile(data.bookmark.file);
      setUrl(data.bookmark.url);
      setMetadata(data.bookmark.metadata);
      setTimestamp(data.bookmark.timestamp);

      setOriginalTitle(data.bookmark.title ? data.bookmark.title : "");
      setOriginalNote(data.bookmark.note);
      setOriginalTags(data.bookmark.tags);

      setTitle(data.bookmark.title ? data.bookmark.title : "");
      setNote(data.bookmark.note);
      setTags(data.bookmark.tags);

      setEditableTags(
        data.bookmark.tags.map((tag, i) => {
          return { id: tag, text: tag };
        })
      );
    } else {
      console.log(data.error);
    }
  }

  const [id, setId] = useState(
    bookmarkFullViewData ? bookmarkFullViewData._id : ""
  );
  const [username, setUsername] = useState(
    bookmarkFullViewData ? bookmarkFullViewData.username : ""
  );
  const [text, setText] = useState(
    bookmarkFullViewData ? bookmarkFullViewData.text : ""
  );
  const [file, setFile] = useState(
    bookmarkFullViewData ? bookmarkFullViewData.file : ""
  );
  const [url, setUrl] = useState(
    bookmarkFullViewData ? bookmarkFullViewData.url : ""
  );
  const [metadata, setMetadata] = useState(
    bookmarkFullViewData ? bookmarkFullViewData.metadata : {}
  );
  const [timestamp, setTimestamp] = useState(
    bookmarkFullViewData ? bookmarkFullViewData.timestamp : ""
  );

  const [originalTitle, setOriginalTitle] = useState(
    bookmarkFullViewData
      ? bookmarkFullViewData.title
        ? bookmarkFullViewData.title
        : ""
      : ""
  );
  const [originalNote, setOriginalNote] = useState(
    bookmarkFullViewData ? bookmarkFullViewData.note : ""
  );
  const [originalTags, setOriginalTags] = useState(
    bookmarkFullViewData ? bookmarkFullViewData.tags : []
  );

  const [title, setTitle] = useState(originalTitle ? originalTitle : "");
  const [note, setNote] = useState(originalNote ? originalNote : "");
  const [tags, setTags] = useState(originalTags ? originalTags : []);
  const [editableTags, setEditableTags] = useState(
    originalTags.map((tag, i) => {
      return { id: tag, text: tag };
    })
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  async function updateBookmark(event) {
    event.preventDefault();

    const editableTags_array = editableTags.map((tag) =>
      tag.text.toLowerCase()
    );

    const response = await fetch("/api/update-bookmark", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify({
        id: id,
        title: title,
        note: note,
        tags: editableTags_array,
      }),
    });

    const data = await response.json();

    if (data.status == "ok") {
      setTags(editableTags_array);
      setOriginalTitle(title);
      setOriginalNote(note);
      setOriginalTags(editableTags_array);
      setMenuOpen(false);
      setEditing(false);

      var old_bookmark_index = bookmarks.findIndex(
        (bookmark) =>
          bookmark.username == username && bookmark.timestamp == timestamp
      );

      let updated_bookmarks = [...bookmarks];
      let updated_bookmark = {
        ...bookmarks[old_bookmark_index],
        title: title,
        note: note,
        tags: editableTags_array,
      };
      updated_bookmarks[old_bookmark_index] = updated_bookmark;

      setBookmarks(updated_bookmarks);
    } else {
      alert("Something went wrong. Please try again later.");
    }
  }

  function cancelEdit() {
    setTitle(originalTitle);
    setNote(originalNote);
    setEditableTags(
      originalTags.map((tag, i) => {
        return { id: tag, text: tag };
      })
    );
    setEditing(false);
    setMenuOpen(false);
  }

  return (
    <div className="bookmark-full-view-container">
      <div className="bookmark-full-view">
        {isMobile && (
          <div className="bookmark-full-view-info-header">
            <div>
              {homeView && (
                <>
                  <h4
                    style={{ cursor: "pointer" }}
                    className="bookmark-full-view-menu-button"
                    onClick={() => {
                      cancelEdit();
                      setEditing(!editing);
                      setMenuOpen(!menuOpen);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="bookmark-full-view-menu-icon"
                    >
                      <path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                    </svg>
                  </h4>
                  {menuOpen && (
                    <div className="bookmark-full-view-menu-container">
                      <h4
                        className="bookmark-full-view-edit-button"
                        onClick={() => {
                          cancelEdit();
                          setEditing(!editing);
                        }}
                      >
                        Cancel edit
                      </h4>
                      <h4
                        className="bookmark-full-view-delete-button"
                        onClick={() => deleteBookmark(bookmarkFullViewData)}
                      >
                        Delete
                      </h4>
                    </div>
                  )}
                </>
              )}
            </div>
            <div
              className="bookmark-full-view-close-button"
              onClick={() => {
                router.push(`${homeView ? "/home" : "/community"}`, null, {
                  scroll: false,
                });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="bookmark-full-view-close-icon"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </div>
          </div>
        )}
        <div>
          {file && <FullFilePreview file={file} metadata={metadata} />}
          {url && <FullUrlPreview url={url} metadata={metadata} />}
          {text && <FullTextPreview text={text} />}
        </div>
        <div className="bookmark-full-view-info">
          {!isMobile && (
            <div className="bookmark-full-view-info-header">
              <div>
                {homeView && (
                  <>
                    <h4
                      style={{ cursor: "pointer" }}
                      className="bookmark-full-view-menu-button"
                      onClick={() => {
                        cancelEdit();
                        setEditing(!editing);
                        setMenuOpen(!menuOpen);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="bookmark-full-view-menu-icon"
                      >
                        <path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                      </svg>
                    </h4>
                    {menuOpen && (
                      <div className="bookmark-full-view-menu-container">
                        <h4
                          className="bookmark-full-view-edit-button"
                          onClick={() => {
                            cancelEdit();
                            setEditing(!editing);
                          }}
                        >
                          Cancel edit
                        </h4>
                        <h4
                          className="bookmark-full-view-delete-button"
                          onClick={() => deleteBookmark(bookmarkFullViewData)}
                        >
                          Delete
                        </h4>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div
                className="bookmark-full-view-close-button"
                onClick={() => {
                  router.push(`${homeView ? "/home" : "/community"}`, null, {
                    scroll: false,
                  });
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="bookmark-full-view-close-icon"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </div>
            </div>
          )}
          {!editing && (
            <div className="bookmark-full-view-info-content">
              <div className="bookmark-full-view-info-title">
                {file && <h4>{title ? title : metadata.fileName}</h4>}
                {text && <h4>{title ? title : ""}</h4>}
                {url && (
                  <Link href={url} target="_blank">
                    <h4>
                      {title ? title : metadata.title ? metadata.title : url}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="bookmark-full-view-link-icon"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                          clipRule="evenodd"
                        />
                      </svg>{" "}
                    </h4>
                  </Link>
                )}
              </div>
              <div className="bookmark-full-view-info-small-header">
                <div>
                  <h4>added by {username}</h4>
                  <h4 className="copy-link" onClick={() => {
                    setLinkCopied(true);
                    navigator.clipboard.writeText(`https://henesys.online/bookmark/${id}`);
                  }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="copy-link-icon"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z"
                        clipRule="evenodd"
                      />
                    </svg>{" "}
                    { !linkCopied ? "Copy link" : "Copied!" }
                  </h4>
                </div>
                <h4>
                  {dayjs(Number(timestamp)).format("MMM DD, YYYY • HH:mm")}
                </h4>
              </div>
              <br></br>
              {note && <h4 className="bookmark-full-view-info-note">{note}</h4>}
              {tags.length != 0 && (
                <div className="bookmark-full-view-info-tags-container">
                  {tags.map(function (tag, i) {
                    return (
                      <div className="bookmark-full-view-info-tags" key={i}>
                        {tag}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {editing && (
            <div className="bookmark-full-view-info-edit">
              <form onSubmit={updateBookmark}>
                <h4 className="add-bookmark-input-header">Title</h4>
                <Textarea
                  type="textarea"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="add-bookmark-input"
                  maxRows={2}
                />
                <h4 className="add-bookmark-input-header">Note</h4>
                <Textarea
                  type="textarea"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="add-bookmark-input"
                  minRows={2}
                  maxRows={4}
                />
                <h4 className="add-bookmark-input-header">Tags</h4>
                <ReactTags
                  classNames={{
                    tag: "add-bookmark-tag",
                    selected: "add-bookmark-tag-container",
                    remove: "add-bookmark-remove-tag",
                    tagInputField: "add-bookmark-input",
                  }}
                  tags={editableTags}
                  allowDragDrop={false}
                  autofocus={false}
                  delimiters={[188, 13]}
                  handleDelete={(i) =>
                    setEditableTags(
                      editableTags.filter((tag, index) => index !== i)
                    )
                  }
                  handleAddition={(editableTag) =>
                    setEditableTags([...editableTags, editableTag])
                  }
                  inputFieldPosition="bottom"
                />
                <div className="edit-button-container">
                  <button
                    type="button"
                    className="cancel-edit-button"
                    onClick={() => cancelEdit()}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="edit-bookmark-button">
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
