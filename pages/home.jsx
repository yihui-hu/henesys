import { React, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { CircularProgress } from "react-loading-indicators";
import { WithContext as ReactTags } from "react-tag-input";
import { getServerSideProps } from "../lib/authHomeCommunity"
import AddBookmarkModal from "../components/AddBookmarkModal";
import Bookmark from "../components/Bookmark";
import Navbar from "../components/Navbar";

export default function Home({ token, profile_pic }) {
  
  const [showAddBookmark, setShowAddBookmark] = useState(false);

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [endOfBookmarks, setEndOfBookmarks] = useState(false);

  const [deletedBookmarksCount, setDeletedBookmarksCount] = useState(0);
  const [bookmarkFullView, setBookmarkFullView] = useState(false);
  const [bookmarkFullViewData, setBookmarkFullViewData] = useState(null);

  const [tags, setTags] = useState([]);
  const [searchTagsMode, setSearchTagsMode] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState(9999);

  useEffect(() => {
    getYourBookmarks(lastTimestamp);

    function handleKeyDown(e) {
      if (e.keyCode == 27) {
        setBookmarkFullView(false);
        setShowAddBookmark(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (showAddBookmark) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showAddBookmark]);

  async function getYourBookmarks(lastTimestamp) {
    const res = await fetch(`api/your-bookmarks`, {
      method: "POST",
      headers: {
        "x-access-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lastTimestamp,
      }),
    });

    const data = await res.json();

    if (data.status == "ok") {
      if (lastTimestamp == 9999) {
        setBookmarks(data.bookmarks);
      } else {
        setBookmarks([...bookmarks, ...data.bookmarks]);
      }

      if (data.bookmarks.length < 35) {
        setEndOfBookmarks(true);
      }

      if (data.bookmarks.length != 0) {
        setLastTimestamp(data.bookmarks.at(-1).timestamp);
      }

      if (data.bookmarks.length == 0 && lastTimestamp != 9999) {
        alert("No more bookmarks to load.");
      }
    } else {
      console.log(data.error);
    }

    setLoading(false);
    setSearchTagsMode(false);
  }

  async function deleteBookmark(bookmark) {
    const res = await fetch("api/delete-bookmark", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify({
        bookmark,
      }),
    });

    const data = await res.json();

    if (data.status == "ok") {
      let new_bookmarks = bookmarks.filter((item) => item !== bookmark);
      setBookmarks(new_bookmarks);
      setBookmarkFullView(false);
      setDeletedBookmarksCount(deletedBookmarksCount + 1);
    } else {
      alert("Error deleting bookmark, please try again later.");
    }
  }

  function showBookmarkFullView(bookmarkFullViewData) {
    setBookmarkFullView(true);
    setBookmarkFullViewData(bookmarkFullViewData);
  }

  async function getTaggedBookmarks(lastTimestamp, tags) {
    const tags_array = tags.map((tag) => tag.text.toLowerCase());

    const res = await fetch(`api/your-bookmarks-tags`, {
      method: "POST",
      headers: {
        "x-access-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lastTimestamp,
        tags: tags_array,
      }),
    });

    const data = await res.json();

    if (data.status == "ok") {
      if (data.bookmarks.length != 0) {
        if (lastTimestamp != 9999) {
          setBookmarks([...bookmarks, ...data.bookmarks]);
        } else {
          setBookmarks(data.bookmarks);
        }

        if (data.bookmarks.length < 35) {
          setEndOfBookmarks(true);
        }

        if (data.bookmarks.length != 0) {
          setLastTimestamp(data.bookmarks.at(-1).timestamp);
        }
      } else {
        if (lastTimestamp == 9999) {
          setBookmarks([]);
        } else {
          setEndOfBookmarks(true);
        }
      }
    } else {
      console.log(data.error);
    }

    setLoading(false);
    setSearchTagsMode(true);
  }

  const delimiters = [188, 13];

  const handleDelete = (i) => {
    let new_tags = tags.filter((tag, index) => index !== i);
    setTags(new_tags);
    let new_timestamp = 9999;
    setLastTimestamp(new_timestamp);

    if (new_tags.length != 0) {
      getTaggedBookmarks(new_timestamp, new_tags);
    } else {
      setEndOfBookmarks(false);
      getYourBookmarks(new_timestamp);
    }
  };

  const handleAddition = (tag) => {
    let new_tags = [...tags, tag];
    setTags(new_tags);
    let new_timestamp = 9999;
    setLastTimestamp(new_timestamp);

    setEndOfBookmarks(false);
    getTaggedBookmarks(new_timestamp, new_tags);
  };

  return (
    <>
      <Navbar 
        homeView={true} 
        communityView={false} 
        profilePic={profile_pic} 
      />
      <div className="home-container">
        <div className="home-search-tags-container">
          <svg
            className="search-logo"
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.695312 10.3359C0.695312 11.625 0.9375 12.8359 1.42188 13.9688C1.90625 15.0938 2.57812 16.0859 3.4375 16.9453C4.29688 17.8047 5.28906 18.4766 6.41406 18.9609C7.54688 19.4453 8.75781 19.6875 10.0469 19.6875C11.0625 19.6875 12.0312 19.5312 12.9531 19.2188C13.875 18.9062 14.7188 18.4766 15.4844 17.9297L21.25 23.707C21.3906 23.8398 21.543 23.9375 21.707 24C21.8789 24.0703 22.0586 24.1055 22.2461 24.1055C22.5117 24.1055 22.7461 24.043 22.9492 23.918C23.1523 23.8008 23.3086 23.6367 23.418 23.4258C23.5352 23.2148 23.5938 22.9805 23.5938 22.7227C23.5938 22.5352 23.5586 22.3594 23.4883 22.1953C23.4258 22.0312 23.332 21.8867 23.207 21.7617L17.4766 15.9961C18.0781 15.2148 18.5469 14.3438 18.8828 13.3828C19.2266 12.4219 19.3984 11.4062 19.3984 10.3359C19.3984 9.04688 19.1562 7.83984 18.6719 6.71484C18.1875 5.58203 17.5156 4.58594 16.6562 3.72656C15.7969 2.86719 14.8008 2.19531 13.668 1.71094C12.543 1.22656 11.3359 0.984375 10.0469 0.984375C8.75781 0.984375 7.54688 1.22656 6.41406 1.71094C5.28906 2.19531 4.29688 2.86719 3.4375 3.72656C2.57812 4.58594 1.90625 5.58203 1.42188 6.71484C0.9375 7.83984 0.695312 9.04688 0.695312 10.3359ZM2.69922 10.3359C2.69922 9.32031 2.88672 8.37109 3.26172 7.48828C3.64453 6.59766 4.17188 5.81641 4.84375 5.14453C5.52344 4.46484 6.30469 3.9375 7.1875 3.5625C8.07812 3.17969 9.03125 2.98828 10.0469 2.98828C11.0625 2.98828 12.0117 3.17969 12.8945 3.5625C13.7852 3.9375 14.5664 4.46484 15.2383 5.14453C15.9102 5.81641 16.4375 6.59766 16.8203 7.48828C17.2031 8.37109 17.3945 9.32031 17.3945 10.3359C17.3945 11.3516 17.2031 12.3047 16.8203 13.1953C16.4375 14.0781 15.9102 14.8555 15.2383 15.5273C14.5664 16.1992 13.7852 16.7266 12.8945 17.1094C12.0117 17.4922 11.0625 17.6836 10.0469 17.6836C9.03125 17.6836 8.07812 17.4922 7.1875 17.1094C6.30469 16.7266 5.52344 16.1992 4.84375 15.5273C4.17188 14.8555 3.64453 14.0781 3.26172 13.1953C2.88672 12.3047 2.69922 11.3516 2.69922 10.3359Z"
              fill="#AFAFAF"
            />
          </svg>
          <ReactTags
            classNames={{
              tag: "home-tag",
              selected: "home-tag-container",
              remove: "home-remove-tag",
              tagInputField: "home-search-input",
            }}
            tags={tags}
            inputFieldPosition="inline"
            placeholder="Search tags..."
            allowDragDrop={false}
            autofocus={false}
            delimiters={delimiters}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
          />
        </div>
        <div className="bookmarks-container">
          {!searchTagsMode && (
            <div
              onClick={() => setShowAddBookmark(true)}
              className="add-bookmark-button"
            >
              +
            </div>
          )}
          {loading && (
            <CircularProgress color="black" size="small" variant="dotted" />
          )}
          {!loading &&
            bookmarks.map(function (item, i) {
              return (
                <Bookmark
                  bookmark={item}
                  key={i}
                  index={i}
                  communityView={false}
                  showBookmarkFullView={showBookmarkFullView}
                  deletedBookmarks={deletedBookmarksCount}
                />
              );
            })}
        </div>
        {!loading && bookmarks.length == 0 && !searchTagsMode && (
          <div className="add-first-bookmark-message">
            <h4>Add your first bookmark using the lower right button!</h4>
          </div>
        )}
        {!loading && bookmarks.length == 0 && searchTagsMode && (
          <h4 className="add-first-bookmark-message">
            No bookmarks found.
          </h4>
        )}
        {!loading &&
          bookmarks.length + deletedBookmarksCount >= 35 &&
          !endOfBookmarks && (
            <div className="show-more-button-container">
              <button
                type="button"
                className="show-more-button"
                onClick={() => {
                  searchTagsMode
                    ? getTaggedBookmarks(lastTimestamp, tags)
                    : getYourBookmarks(lastTimestamp);
                }}
              >
                Load more bookmarks ⭣
              </button>
            </div>
          )}
      </div>

      <AnimatePresence>
        {bookmarkFullView && (
          <div className="bookmark-full-view">
            <h2>{bookmarkFullViewData.username}</h2>
            <h4>{bookmarkFullViewData.timestamp}</h4>
            <button
              type="button"
              onClick={() => deleteBookmark(bookmarkFullViewData)}
            >
              Delete bookmark
            </button>
            <button type="button" onClick={() => setBookmarkFullView(false)}>
              Close
            </button>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddBookmark && (
          <AddBookmarkModal
            setShown={setShowAddBookmark}
            bookmarks={bookmarks}
            updateBookmarks={setBookmarks}
            token={token}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export { getServerSideProps }