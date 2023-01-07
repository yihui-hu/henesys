import Link from "next/link";

const Navbar = ({ homeView, communityView, profilePic }) => {
  return (
    <div className="navbar-container">
      <div className="navbar-navigation">
        <Link href="/home">
          <h4
            className={
              homeView ? "navbar-nav-selected" : "navbar-nav-deselected"
            }
          >
            home
          </h4>
        </Link>
        <Link href="/community">
          <h4
            className={
              communityView ? "navbar-nav-selected" : "navbar-nav-deselected"
            }
          >
            community
          </h4>
        </Link>
      </div>
      <Link href="/profile">
        <div
          className="navbar-profile-icon"
          style={{ backgroundImage: `url(${profilePic})` }}
        />
      </Link>
    </div>
  );
};

export default Navbar;
