import { useState } from "react";
import { WithContext as ReactTags } from "react-tag-input";
import useMediaQuery from "../hooks/useMediaQuery";
import Link from "next/link";
import Textarea from "react-textarea-autosize";
import FullFilePreview from "../components/FullFilePreview";
import FullUrlPreview from "../components/FullUrlPreview";
import FullTextPreview from "../components/FullTextPreview";
const dayjs = require("dayjs");

export default function BookmarkFullView({
  bookmarkFullViewData,
  setBookmarkFullView,
  bookmarks,
  setBookmarks,
  deleteBookmark,
  homeView,
  token,
}) {
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const username = bookmarkFullViewData.username;
  const text = bookmarkFullViewData.text;
  const file = bookmarkFullViewData.file;
  const url = bookmarkFullViewData.url;

  const id = bookmarkFullViewData._id;
  const original_title = bookmarkFullViewData.title
    ? bookmarkFullViewData.title
    : "";
  const original_note = bookmarkFullViewData.note;
  const original_tags = bookmarkFullViewData.tags.map((tag, i) => {
    return { id: tag, text: tag };
  });
  const metadata = bookmarkFullViewData.metadata;
  const timestamp = bookmarkFullViewData.timestamp;
  const [tags, setTags] = useState(bookmarkFullViewData.tags);

  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(original_title);
  const [note, setNote] = useState(original_note);
  const [editableTags, setEditableTags] = useState(original_tags);

  async function updateBookmark(event) {
    event.preventDefault();

    let sameTitle = title == original_title;
    let sameNote = note == original_note;
    let sameTags =
      editableTags.length === original_tags.length &&
      editableTags.every(function (element) {
        return original_tags.includes(element);
      });

    if (sameTitle && sameNote && sameTags) {
      setMenuOpen(false);
      setEditing(false);
      return;
    }

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
      alert("Something went wrong.");
    }
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
                    onClick={() => {
                      setEditing(false);
                      setMenuOpen(!menuOpen);
                    }}
                  >
                    •••
                  </h4>
                  {menuOpen && (
                    <div className="bookmark-full-view-menu-container">
                      <h4
                        className="bookmark-full-view-edit-button"
                        onClick={() => {
                          if (editing) {
                            setEditableTags(original_tags);
                          }
                          setEditing(!editing);
                        }}
                      >
                        {editing ? "Cancel edit" : "Edit"}
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
              onClick={() => setBookmarkFullView(false)}
            >
              ✕
            </div>
          </div>
        )}
        <div>
          {file && <FullFilePreview file={file} metadata={metadata} />}
          {url  && <FullUrlPreview  url={url}   metadata={metadata} />}
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
                      onClick={() => {
                        setEditing(false);
                        setMenuOpen(!menuOpen);
                      }}
                    >
                      •••
                    </h4>
                    {menuOpen && (
                      <div className="bookmark-full-view-menu-container">
                        <h4
                          className="bookmark-full-view-edit-button"
                          onClick={() => {
                            if (editing) {
                              setEditableTags(original_tags);
                            }
                            setEditing(!editing);
                          }}
                        >
                          {editing ? "Cancel edit" : "Edit"}
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
                onClick={() => setBookmarkFullView(false)}
              >
                ✕
              </div>
            </div>
          )}
          {!editing && (
            <div className="bookmark-full-view-info-content">
              <div className="bookmark-full-view-info-title">
                { file && <h4>{title ? title : metadata.fileName}</h4>}
                { text && <h4>{title ? title : ""}</h4>}
                {url && (
                  <Link href={url} target="_blank">
                    <h4>
                      ↗ {title ? title : metadata.title ? metadata.title : url}
                    </h4>
                  </Link>
                )}
              </div>
              <div className="bookmark-full-view-info-small-header">
                <h4>added by {username}</h4>
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
                    onClick={() => {
                      setEditableTags(original_tags);
                      setEditing(!editing);
                      setMenuOpen(false);
                    }}
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
