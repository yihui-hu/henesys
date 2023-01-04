import { useState, useEffect } from "react";
import { WithContext as ReactTags } from "react-tag-input";
import Link from "next/link";
import Textarea from "react-textarea-autosize";
import FullFilePreview from "../components/FullFilePreview";
import FullUrlPreview from "../components/FullUrlPreview";
import FullTextPreview from "../components/FullTextPreview";
const dayjs = require("dayjs");

export default function BookmarkFullView({
  bookmarkFullViewData,
  setBookmarkFullView,
  deleteBookmark,
  homeView,
}) {

  const username = bookmarkFullViewData.username;
  const text = bookmarkFullViewData.text;
  const file = bookmarkFullViewData.file;
  const url = bookmarkFullViewData.url;
  const original_title = "original title";
  const original_note = bookmarkFullViewData.note;
  const original_tags = bookmarkFullViewData.tags.map((tag, i) => {
    return { id: tag, text: tag };
  });
  const metadata = bookmarkFullViewData.metadata;
  const timestamp = bookmarkFullViewData.timestamp;
  const tags = bookmarkFullViewData.tags;

  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  // replace with metadata title or smth
  const [title, setTitle] = useState(original_title);
  const [note, setNote] = useState(original_note);
  const [editableTags, setEditableTags] = useState(original_tags);

  return (
    <div className="bookmark-full-view-container">
      <div className="bookmark-full-view">
        <div>
          {file && <FullFilePreview file={file} metadata={metadata} />}
          {url && <FullUrlPreview url={url} metadata={metadata} />}
          {text && <FullTextPreview text={text} />}
        </div>
        <div className="bookmark-full-view-info">
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
                          setTitle(original_title);
                          setNote(original_note);
                          setEditableTags(original_tags);
                          setEditing(!editing);
                        }}
                      >
                        {editing ? "Cancel edit" : "Edit"}
                      </h4>
                      {!editing && (
                        <h4
                          className="bookmark-full-view-delete-button"
                          onClick={() => deleteBookmark(bookmarkFullViewData)}
                        >
                          Delete
                        </h4>
                      )}
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
          {!editing && (
            <div className="bookmark-full-view-info-content">
              {file && <h4>{metadata.fileName}</h4>}
              {url && (
                <Link href={url} target="_blank">
                  <h4>{metadata.title ? metadata.title : url} ↗</h4>
                </Link>
              )}
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
              <form>
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
                <button type="submit" className="edit-bookmark-primary-button">
                  Submit
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
