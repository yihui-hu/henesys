import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { WithContext as ReactTags } from "react-tag-input";
import { FocusOn } from "react-focus-on";
import { useRouter } from "next/router";
import { getServerSideProps } from "../lib/authHomeCommunity";
import useSWRInfinite from "swr/infinite";
import AddBookmarkModal from "../components/AddBookmarkModal";
import Bookmark from "../components/Bookmark";
import Navbar from "../components/Navbar";
import BookmarkFullView from "../components/BookmarkFullView";

export default function Home({ token, profile_pic }) {
  const router = useRouter();

  const [showAddBookmark, setShowAddBookmark] = useState(false);
  const [bookmarkFullViewData, setBookmarkFullViewData] = useState(null);
  const [tags, setTags] = useState([]);
  const [searchTagsMode, setSearchTagsMode] = useState(false);

  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.bookmarks) return null;
    if (pageIndex === 0) return `/api/your-bookmarks?lastTimestamp=9999`;
    return `/api/your-bookmarks?lastTimestamp=${previousPageData.new_lastTimestamp}`;
  };

  const getTaggedKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.bookmarks) return null;
    if (pageIndex === 0) return `/api/your-bookmarks-tags?lastTimestamp=9999`;
    return `/api/your-bookmarks-tags?lastTimestamp=${previousPageData.new_lastTimestamp}`;
  };

  const { data, isLoading, size, setSize } = useSWRInfinite(
    !searchTagsMode ? getKey : null,
    fetchBookmarks,
    { refreshInterval: 1000 }
  );

  const {
    data: taggedData,
    isLoading: isTaggedLoading,
    mutate: taggedMutate,
    size: taggedSize,
    setSize: setTaggedSize,
  } = useSWRInfinite(
    searchTagsMode ? getTaggedKey : null,
    (url) => fetchTaggedBookmarks(url),
    { refreshInterval: 1000 }
  );

  async function fetchBookmarks(url) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "x-access-token": token,
        "Content-Type": "application/json",
      },
    });

    let fetchedData = await res.json();

    if (fetchedData.status == "ok") {
      return fetchedData;
    } else {
      console.log(fetchedData.error);
      return [];
    }
  }

  async function fetchTaggedBookmarks(url) {
    console.log("Fetching tagged bookmarks");
    const tags_array = tags.map((tag) => tag.text.toLowerCase());

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "x-access-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tags: tags_array,
      }),
    });

    let fetchedData = await res.json();
    if (fetchedData.status == "ok") {
      return fetchedData;
    } else {
      console.log(fetchedData.error);
      return [];
    }
  }

  let bookmarksArray = searchTagsMode
    ? taggedData
      ? [].concat(...taggedData)
      : []
    : data
    ? [].concat(...data)
    : [];

  async function deleteBookmark(bookmark) {
    const res = await fetch("/api/delete-bookmark", {
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
      router.push(`/home`, null, { scroll: false });
    } else {
      console.log(data.error);
    }
  }

  function showBookmarkFullView(bookmarkFullViewData) {
    setBookmarkFullViewData(bookmarkFullViewData);

    router.push(
      `/home/?bookmarkId=${bookmarkFullViewData._id}`,
      `/bookmark/${bookmarkFullViewData._id}`,
      { scroll: false }
    );
  }

  const handleDelete = (i) => {
    let new_tags = tags.filter((tag, index) => index !== i);
    setTags(new_tags);

    if (new_tags.length == 0) {
      setSearchTagsMode(false);
    }
  };

  const handleAddition = (tag) => {
    let new_tags = [...tags, tag];
    setTags(new_tags);
    setSearchTagsMode(true);
  };

  return (
    <>
      <Navbar homeView={true} communityView={false} profilePic={profile_pic} />
      <div className="home-container">
        <div className="home-search-tags-container">
          {tags.length == 0 && (
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
          )}
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
            delimiters={[188, 13]}
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="add-bookmark-icon"
              >
                <path d="M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" />
              </svg>
            </div>
          )}
          {(isLoading || isTaggedLoading) && (
            <div className="loading-indicator-container">
              <h4>Loading...</h4>
            </div>
          )}
          {!isLoading &&
            !isTaggedLoading &&
            bookmarksArray.map((entries) => {
              return entries?.bookmarks.map((item, i) => {
                return (
                  <Bookmark
                    bookmark={item}
                    key={i}
                    index={i}
                    communityView={false}
                    showBookmarkFullView={showBookmarkFullView}
                  />
                );
              });
            })}
        </div>
        {!isLoading && bookmarksArray.length === 0 && !searchTagsMode && (
          <div className="empty-state-message">
            <h4>
              Add your first bookmark <br className="empty-state-br"></br>using
              the{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="empty-state-icon"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
                  clipRule="evenodd"
                />
              </svg>{" "}
              button!
            </h4>
          </div>
        )}
        {!isTaggedLoading &&
          bookmarksArray[bookmarksArray.length - 1]?.bookmarks.length == 0 &&
          searchTagsMode && (
            <h4 className="empty-state-message">No bookmarks found.</h4>
          )}
        {!isLoading &&
          bookmarksArray[bookmarksArray.length - 1]?.bookmarks.length >= 35 && (
            <div className="show-more-button-container">
              <button
                type="button"
                className="show-more-button"
                onClick={() => {
                  searchTagsMode
                    ? setTaggedSize(taggedSize + 1)
                    : setSize(size + 1);
                }}
              >
                Load more bookmarks
              </button>
            </div>
          )}
      </div>

      <AnimatePresence>
        {router.query.bookmarkId && (
          <FocusOn
            autoFocus={false}
            onEscapeKey={() => {
              router.push("/home", null, { scroll: false });
            }}
          >
            <BookmarkFullView
              bookmarkId={router.query.bookmarkId}
              bookmarkFullViewData={bookmarkFullViewData}
              setBookmarkFullViewData={setBookmarkFullViewData}
              deleteBookmark={deleteBookmark}
              homeView={true}
              token={token}
            />
          </FocusOn>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddBookmark && (
          <AddBookmarkModal
            setShown={setShowAddBookmark}
            token={token}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export { getServerSideProps };
