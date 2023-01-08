import { useRouter } from "next/router";

const BookmarkPage = () => {
  const router = useRouter();
  const { bookmarkId } = router.query;

  return (
    <>
      <h4>My bookmarkid is {bookmarkId}</h4>
    </>
  );
};

export default BookmarkPage;
