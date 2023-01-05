import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = ({ homeView, communityView, profilePic }) => {
  const router = useRouter();

  return (
    <div className="navbar-container">
      <div className="navbar-navigation">
        <svg
          className="navbar-logo"
          onClick={() => router.push("/home")}
          viewBox="0 0 27 27"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.30859 23.6992H8.85156C9.08594 23.6992 9.28125 23.7812 9.4375 23.9453L11.2422 25.7383C11.9844 26.4805 12.707 26.8477 13.4102 26.8398C14.1133 26.8398 14.832 26.4727 15.5664 25.7383L17.3711 23.9453C17.5352 23.7812 17.7344 23.6992 17.9688 23.6992H20.5C21.5469 23.6992 22.3203 23.4492 22.8203 22.9492C23.3203 22.457 23.5703 21.6836 23.5703 20.6289V18.0977C23.5703 17.8633 23.6523 17.6641 23.8164 17.5L25.6094 15.6953C26.3516 14.9609 26.7188 14.2422 26.7109 13.5391C26.7109 12.8359 26.3438 12.1133 25.6094 11.3711L23.8164 9.56641C23.6523 9.40234 23.5703 9.20703 23.5703 8.98047V6.4375C23.5703 5.39844 23.3203 4.62891 22.8203 4.12891C22.3281 3.62109 21.5547 3.36719 20.5 3.36719H17.9688C17.7344 3.36719 17.5352 3.28906 17.3711 3.13281L15.5664 1.33984C14.832 0.589844 14.1133 0.21875 13.4102 0.226562C12.707 0.226562 11.9844 0.597656 11.2422 1.33984L9.4375 3.13281C9.28125 3.28906 9.08594 3.36719 8.85156 3.36719H6.30859C5.26172 3.36719 4.48828 3.61719 3.98828 4.11719C3.48828 4.60938 3.23828 5.38281 3.23828 6.4375V8.98047C3.23828 9.20703 3.16016 9.40234 3.00391 9.56641L1.21094 11.3711C0.46875 12.1133 0.0976562 12.8359 0.0976562 13.5391C0.0976562 14.2422 0.46875 14.9609 1.21094 15.6953L3.00391 17.5C3.16016 17.6641 3.23828 17.8633 3.23828 18.0977V20.6289C3.23828 21.6758 3.48828 22.4492 3.98828 22.9492C4.48828 23.4492 5.26172 23.6992 6.30859 23.6992Z"
            fill="black"
          />
        </svg>
        <Link href="/home">
          <h4
            className={
              homeView ? "navbar-nav-selected" : "navbar-nav-deselected"
            }
            // onClick={homeView ? undefined : () => {
            //   router.push("/home")
            // }}
          >
            your bookmarks
          </h4>
        </Link>
        <Link href="/community">
          <h4
            className={
              communityView ? "navbar-nav-selected" : "navbar-nav-deselected"
            }
            // onClick={communityView ? undefined : () => {
            //   router.push("/community")
            // }}
          >
            community
          </h4>
        </Link>
      </div>
      <div
        className="navbar-profile-icon"
        style={{ backgroundImage: `url(${profilePic})` }}
        onClick={() => router.push("/profile")}
      />
    </div>
  );
};

export default Navbar;
