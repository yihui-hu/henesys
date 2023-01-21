import { useState } from "react";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import { getServerSideProps } from "../lib/authStaticPages";
import useMediaQuery from "../hooks/useMediaQuery";
import Link from "next/link";

export default function Landing() {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 1025px)");

  const [isShown, setIsShown] = useState(true);
  const [modalShown, setModalShown] = useState(false);

  return (
    <LazyMotion features={domAnimation}>
      <div className="landing-container">
        <div className="landing-navbar">
          <div className="landing-navbar-header">
            <svg
              width="60"
              height="15"
              viewBox="0 0 60 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="navbar-logo"
            >
              <rect y="1" width="12" height="12" rx="1" fill="black" />
              <path
                d="M1 11.6V2.4C1 2.17909 1.17909 2 1.4 2H3.1C3.32091 2 3.5 2.17909 3.5 2.4V10C3.83333 8.33333 5.2 4.9 8 4.5C10.7304 4.10994 8.61114 9.07676 7.1132 11.7966C7.04348 11.9232 6.91057 12 6.76606 12H4.82361C4.67493 12 4.57772 11.8443 4.6432 11.7108C5.49918 9.96606 6.87807 6.87807 6.5 6.5C6.11577 6.11577 4.47047 9.69925 3.60275 11.755C3.53995 11.9038 3.39481 12 3.23333 12H1.4C1.17909 12 1 11.8209 1 11.6Z"
                fill="white"
              />
              <path
                d="M15.5265 12H18.24C18.3615 12 18.456 11.919 18.4425 11.7975L18.4155 11.5815C18.402 11.4465 18.3345 11.379 18.1995 11.3925L17.511 11.46C17.376 11.4735 17.295 11.4195 17.295 11.2845V7.383C17.295 7.1535 17.349 7.059 17.4165 6.9645C17.754 6.492 18.4155 5.952 19.1985 5.952C20.157 5.952 20.5215 6.6 20.5215 7.41V10.677C20.5215 11.2035 20.2515 11.4195 19.6305 11.5005C19.509 11.514 19.4415 11.595 19.4415 11.7165V11.7975C19.4415 11.919 19.5225 12 19.644 12H22.3575C22.479 12 22.5735 11.919 22.56 11.7975L22.533 11.5815C22.5195 11.4465 22.452 11.379 22.317 11.3925L21.7635 11.46C21.6285 11.4735 21.5475 11.4195 21.5475 11.2845V7.113C21.5475 5.8575 20.778 5.088 19.725 5.088C18.7395 5.088 17.997 5.6685 17.43 6.249C17.3625 6.3165 17.295 6.303 17.295 6.195V1.902C17.295 1.8075 17.3085 1.7265 17.214 1.659C17.133 1.5915 17.0655 1.578 16.971 1.6185C16.647 1.7535 16.3095 1.983 15.4185 2.0775C15.297 2.091 15.243 2.1855 15.243 2.307V2.3475C15.243 2.469 15.3105 2.5635 15.4455 2.5635C15.999 2.5635 16.296 2.739 16.296 3.387V10.677C16.296 11.2035 16.134 11.4195 15.513 11.5005C15.3915 11.514 15.324 11.595 15.324 11.7165V11.7975C15.324 11.919 15.405 12 15.5265 12ZM25.4944 12.189C26.6419 12.189 27.7759 11.406 28.2754 10.38C28.3429 10.245 28.3159 10.1505 28.2079 10.0965C28.0999 10.029 28.0054 10.056 27.9109 10.164C27.5869 10.5555 27.0064 11.19 25.9669 11.2035C24.6169 11.217 23.6854 10.002 23.6449 8.3415C23.6449 8.2605 23.6989 8.2065 23.7799 8.2065H26.2099C27.7219 8.2065 28.1539 7.707 28.1539 7.005C28.1539 6.0735 27.2764 5.061 25.8319 5.061C23.9689 5.061 22.6054 6.8835 22.6054 8.814C22.6054 10.812 23.8744 12.189 25.4944 12.189ZM23.6719 7.5585C23.8339 6.4785 24.6574 5.6415 25.5889 5.6415C26.3854 5.6415 26.8714 6.249 26.8714 6.9375C26.8714 7.329 26.6824 7.707 25.8589 7.707H23.8069C23.7259 7.707 23.6584 7.653 23.6719 7.5585ZM28.8794 12H31.5929C31.7144 12 31.8089 11.919 31.7954 11.7975L31.7684 11.5815C31.7549 11.4465 31.6874 11.379 31.5524 11.3925L30.8639 11.433C30.7289 11.4465 30.6479 11.3925 30.6479 11.2575V7.383C30.6479 7.1535 30.7019 7.059 30.7694 6.9645C31.1069 6.492 31.7684 5.952 32.5514 5.952C33.5099 5.952 33.8744 6.6 33.8744 7.41V10.677C33.8744 11.2035 33.6044 11.4195 32.9834 11.5005C32.8619 11.514 32.7944 11.595 32.7944 11.7165V11.7975C32.7944 11.919 32.8754 12 32.9969 12H35.7104C35.8319 12 35.9264 11.919 35.9129 11.7975L35.8859 11.5815C35.8724 11.4465 35.8049 11.379 35.6699 11.3925L35.1164 11.433C34.9814 11.4465 34.9004 11.3925 34.9004 11.2575V7.113C34.9004 5.8575 34.1309 5.088 33.0779 5.088C32.0114 5.088 31.2554 5.763 30.7424 6.303C30.7019 6.357 30.6614 6.3705 30.6209 6.3705C30.5534 6.3705 30.5264 6.33 30.5399 6.2355L30.6749 5.4795C30.6884 5.385 30.7154 5.304 30.6209 5.2095C30.5399 5.1285 30.4859 5.1015 30.3779 5.142C30.0404 5.2635 29.6624 5.52 28.7714 5.6145C28.6499 5.628 28.5959 5.709 28.5959 5.8575C28.5959 6.0195 28.6634 6.1005 28.7984 6.1005C29.3519 6.1005 29.6489 6.276 29.6489 6.924V10.677C29.6489 11.2035 29.4869 11.4195 28.8659 11.5005C28.7444 11.514 28.6769 11.595 28.6769 11.7165V11.7975C28.6769 11.919 28.7579 12 28.8794 12ZM38.8472 12.189C39.9947 12.189 41.1287 11.406 41.6282 10.38C41.6957 10.245 41.6687 10.1505 41.5607 10.0965C41.4527 10.029 41.3582 10.056 41.2637 10.164C40.9397 10.5555 40.3592 11.19 39.3197 11.2035C37.9697 11.217 37.0382 10.002 36.9977 8.3415C36.9977 8.2605 37.0517 8.2065 37.1327 8.2065H39.5627C41.0747 8.2065 41.5067 7.707 41.5067 7.005C41.5067 6.0735 40.6292 5.061 39.1847 5.061C37.3217 5.061 35.9582 6.8835 35.9582 8.814C35.9582 10.812 37.2272 12.189 38.8472 12.189ZM37.0247 7.5585C37.1867 6.4785 38.0102 5.6415 38.9417 5.6415C39.7382 5.6415 40.2242 6.249 40.2242 6.9375C40.2242 7.329 40.0352 7.707 39.2117 7.707H37.1597C37.0787 7.707 37.0112 7.653 37.0247 7.5585ZM44.3009 12.189C45.3944 12.189 46.6634 11.7165 46.6634 10.3125C46.6634 9.381 46.1369 8.841 45.2864 8.409L44.1929 7.8555C43.4639 7.491 43.2479 7.14 43.2479 6.6405C43.2479 5.9385 43.7609 5.5065 44.4224 5.5065C45.1784 5.5065 45.6104 6.087 45.8129 6.789C45.8534 6.9105 45.9209 6.978 46.0559 6.978C46.2179 6.978 46.2719 6.897 46.2854 6.762L46.4204 5.277C46.4474 5.0205 46.3394 4.9395 46.2179 4.9395H46.1234C46.0019 4.9395 45.9614 4.9935 45.8939 5.1285C45.8534 5.223 45.8399 5.2905 45.7319 5.2905C45.5699 5.2905 45.0299 5.061 44.5034 5.061C43.2884 5.061 42.3299 5.8035 42.3299 6.951C42.3299 7.6665 42.7754 8.382 43.6394 8.8275L44.6924 9.3675C45.2459 9.651 45.6104 10.0425 45.6104 10.569C45.6104 11.2575 45.0569 11.7165 44.3954 11.7165C43.4369 11.7165 43.0589 11.19 42.8564 10.461C42.8159 10.3395 42.7484 10.272 42.6134 10.272C42.4514 10.272 42.3974 10.353 42.3839 10.488L42.2489 11.973C42.2219 12.2295 42.3299 12.3105 42.4514 12.3105H42.5459C42.6674 12.3105 42.7079 12.2565 42.7754 12.1215C42.8159 12.027 42.8429 11.9595 42.9644 11.9595C43.1669 11.9595 43.5449 12.189 44.3009 12.189ZM47.7973 14.754C48.8773 14.7405 49.7008 14.0385 50.7943 11.4195L52.7923 6.6C52.9813 6.141 53.0488 5.898 53.9263 5.817C54.0478 5.8035 54.1153 5.7225 54.1153 5.601V5.4525C54.1153 5.331 54.0343 5.25 53.9128 5.25H51.3478C51.2263 5.25 51.1318 5.331 51.1453 5.4525L51.1723 5.6685C51.1858 5.8035 51.2533 5.8575 51.3883 5.8575H51.8338C52.1983 5.8575 52.2658 6.0195 52.1443 6.3435L50.7403 10.0965C50.6863 10.2315 50.6053 10.218 50.5378 10.0695L48.9988 6.3435C48.8098 5.898 49.0663 5.817 49.6468 5.817C49.7953 5.817 49.8628 5.7225 49.8628 5.601V5.4525C49.8628 5.331 49.7818 5.25 49.6603 5.25H46.9333C46.8118 5.25 46.7173 5.331 46.7308 5.4525L46.7578 5.6685C46.7713 5.8035 46.8388 5.871 46.9738 5.8575L47.3923 5.817C47.5273 5.8035 47.6353 5.8305 47.7028 5.979L49.9438 11.2305C50.2408 11.919 49.3228 13.593 48.4588 13.593C48.0403 13.593 47.7703 13.3635 47.4193 13.3635C47.0683 13.3635 46.7983 13.6605 46.7983 13.971C46.7983 14.3625 47.1898 14.754 47.7973 14.754ZM56.375 12.189C57.4685 12.189 58.7375 11.7165 58.7375 10.3125C58.7375 9.381 58.211 8.841 57.3605 8.409L56.267 7.8555C55.538 7.491 55.322 7.14 55.322 6.6405C55.322 5.9385 55.835 5.5065 56.4965 5.5065C57.2525 5.5065 57.6845 6.087 57.887 6.789C57.9275 6.9105 57.995 6.978 58.13 6.978C58.292 6.978 58.346 6.897 58.3595 6.762L58.4945 5.277C58.5215 5.0205 58.4135 4.9395 58.292 4.9395H58.1975C58.076 4.9395 58.0355 4.9935 57.968 5.1285C57.9275 5.223 57.914 5.2905 57.806 5.2905C57.644 5.2905 57.104 5.061 56.5775 5.061C55.3625 5.061 54.404 5.8035 54.404 6.951C54.404 7.6665 54.8495 8.382 55.7135 8.8275L56.7665 9.3675C57.32 9.651 57.6845 10.0425 57.6845 10.569C57.6845 11.2575 57.131 11.7165 56.4695 11.7165C55.511 11.7165 55.133 11.19 54.9305 10.461C54.89 10.3395 54.8225 10.272 54.6875 10.272C54.5255 10.272 54.4715 10.353 54.458 10.488L54.323 11.973C54.296 12.2295 54.404 12.3105 54.5255 12.3105H54.62C54.7415 12.3105 54.782 12.2565 54.8495 12.1215C54.89 12.027 54.917 11.9595 55.0385 11.9595C55.241 11.9595 55.619 12.189 56.375 12.189Z"
                fill="black"
              />
              <rect y="1" width="12" height="12" rx="1" fill="black" />
              <path
                d="M2 10.6V3.4C2 3.17909 2.17909 3 2.4 3H4.00406C4.22497 3 4.40406 3.17909 4.40406 3.4V9.4C4.7246 8.06667 6.03882 5.32 8.73137 5C11.3517 4.68858 9.32732 8.64528 7.88738 10.824C7.81415 10.9348 7.69016 11 7.55735 11H5.71923C5.5637 11 5.46708 10.8307 5.54577 10.6966C6.37108 9.28953 7.64632 6.89732 7.28893 6.6C6.9212 6.29408 5.35236 9.13212 4.51485 10.7804C4.44627 10.9154 4.30844 11 4.15703 11H2.4C2.17909 11 2 10.8209 2 10.6Z"
                fill="white"
              />
            </svg>
            <m.h2
              className="landing-navbar-text"
              initial={{ y: "60px", opacity: 0 }}
              animate={{ y: "0px", opacity: 1 }}
              transition={{ duration: 0.7, type: "spring" }}
            >
              is a barebones bookmarking / <br></br> capture-anything site
            </m.h2>
          </div>
          <m.div
            className="landing-auth-button-container"
            initial={{ y: "60px", opacity: 0 }}
            animate={{ y: "0px", opacity: 1 }}
            transition={{ duration: 0.7, type: "spring", delay: 0.07 }}
          >
            <button
              className="landing-auth-secondary-button"
              type="button"
              onClick={() => router.push("/register")}
            >
              Register
            </button>
            <button
              className="landing-auth-primary-button"
              type="button"
              onClick={() => router.push("/login")}
            >
              Login
            </button>
          </m.div>
        </div>
        <div className="landing-modal-container">
          <m.div
            initial={{ y: "100px", opacity: 0 }}
            animate={{ y: "0px", opacity: 1 }}
            transition={{ duration: 0.7, type: "spring", delay: 0.14 }}
          >
            <m.div className="landing-modal">
              A simple and streamlined bookmarking application. Save files,
              images, URLs or plaintext for future reference. Add notes or tags
              if you&apos;d like to. That&apos;s it.
            </m.div>
            <h4 className="landing-modal-caption">what</h4>
          </m.div>
          <m.div
            initial={{ y: "100px", opacity: 0 }}
            animate={{ y: "0px", opacity: 1 }}
            transition={{ duration: 0.7, type: "spring", delay: 0.21 }}
          >
            <div className="landing-modal">
              Tag bookmarks for fast lookups or create your own system(s) of
              organization with them. And with the community tab, keep up to
              date on what your friends and others are bookmarking.
            </div>
            <h4 className="landing-modal-caption">features</h4>
          </m.div>
          <m.div
            initial={{ y: "100px", opacity: 0 }}
            animate={{ y: "0px", opacity: 1 }}
            transition={{ duration: 0.7, type: "spring", delay: 0.28 }}
          >
            <div className="landing-modal">
              You can use it however you like honestly. There is an upcoming
              option to keep your bookmarks private, but joining our small
              community of bookmarking fiends and sharing interesting articles
              is recommended.
            </div>
            <h4 className="landing-modal-caption">how</h4>
          </m.div>
          <m.div
            initial={{ y: "100px", opacity: 0 }}
            animate={{ y: "0px", opacity: 1 }}
            transition={{ duration: 0.7, type: "spring", delay: 0.35 }}
          >
            <div className="landing-modal">
              I love{" "}
              <Link
                href="https://are.na"
                target="_blank"
                referrer="noreferrer"
                style={{
                  textDecoration: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                ✶✶ Are.na
              </Link>
              , and wanted to build a simpler, less feature-full but also less
              complex version of it. More than anything, it&apos;s a small
              experiment and exploration of mine, and I hope you enjoy using it
              nonetheless.
            </div>
            <h4 className="landing-modal-caption">why</h4>
          </m.div>
        </div>
        <m.div
          className="landing-demo-reels"
          style={{
            textAlign: "center",
            display: "grid",
            placeItems: "center",
            margin: "auto",
            boxShadow: "rgba(0, 0, 0, 0.15) 0px 18px 50px -10px",
          }}
          initial={{ y: "100px", opacity: 0 }}
          animate={{ y: "0px", opacity: 1 }}
          transition={{ duration: 0.7, type: "spring", delay: 0.42 }}
        >
          Demo reels below
        </m.div>
        <m.div
          className="landing-reel-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, type: "spring", delay: 0.49 }}
        >
          <h4 className="landing-reel-header">
            Bookmark text, URLs, images and more
          </h4>
          <div className="landing-reel-video-div">
            <video
              autoPlay
              muted
              loop
              playsInline
              src={"/reels/henesys_1.mp4"}
            />
          </div>
          <h4 className="landing-reel-header">
            Fast, combinable lookup with tags
          </h4>
          <div className="landing-reel-video-div">
            <video
              autoPlay
              muted
              loop
              playsInline
              src={"/reels/henesys_2.mp4"}
            />
          </div>
          <h4 className="landing-reel-header">
            Edit, modify and reorganise your bookmarks quickly
          </h4>
          <div className="landing-reel-video-div">
            <video
              autoPlay
              muted
              loop
              playsInline
              src={"/reels/henesys_3.mp4"}
            />
          </div>
          {/* <h4 className="landing-reel-header">
            View what others are bookmarking in the community
          </h4>
          <div className="landing-reel-video-div">
            <video
              autoPlay
              muted
              loop
              playsInline
              src={"/reels/henesys_3.mp4"}
            />
          </div> */}
        </m.div>
        {!isDesktop && isShown && (
          <div className="landing-add-to-homescreen">
            <h4 onClick={() => setModalShown(true)}>
              Add to homescreen{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="landing-arrow-up"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </h4>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="landing-cross"
              onClick={() => setIsShown(false)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        )}
        {!isDesktop && modalShown && (
          <div className="landing-add-to-homescreen-modal-container">
            <div className="landing-add-to-homescreen-modal">
              <div className="landing-add-to-homescreen-modal-header">
                <h4>Add to homescreen!</h4>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="landing-cross"
                  onClick={() => setModalShown(false)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <hr style={{ border: "0.5px solid #f6f6f6" }}></hr>
              <div className="landing-add-to-homescreen-instruction">
                <h4>For iOS devices</h4>
                <ul>
                  <li>Visit henesys on Safari</li>
                  <li>
                    Tap the share &nbsp;
                    <svg width="13.0005" height="17.6147">
                      <g>
                        <rect
                          height="17.6147"
                          opacity="0"
                          width="13.0005"
                          x="0"
                          y="0"
                        />
                        <path
                          d="M2.2998 16.5308L10.7007 16.5308C12.2314 16.5308 13.0005 15.769 13.0005 14.2603L13.0005 6.95068C13.0005 5.44189 12.2314 4.68018 10.7007 4.68018L8.65723 4.68018L8.65723 5.85938L10.6787 5.85938C11.4038 5.85938 11.8213 6.25488 11.8213 7.0166L11.8213 14.1943C11.8213 14.9561 11.4038 15.3516 10.6787 15.3516L2.31445 15.3516C1.58203 15.3516 1.1792 14.9561 1.1792 14.1943L1.1792 7.0166C1.1792 6.25488 1.58203 5.85938 2.31445 5.85938L4.34326 5.85938L4.34326 4.68018L2.2998 4.68018C0.769043 4.68018 0 5.44189 0 6.95068L0 14.2603C0 15.769 0.769043 16.5308 2.2998 16.5308ZM6.49658 10.7959C6.81152 10.7959 7.08252 10.5322 7.08252 10.2246L7.08252 2.70264L7.03857 1.604L7.5293 2.12402L8.64258 3.31055C8.74512 3.42773 8.8916 3.48633 9.03809 3.48633C9.33838 3.48633 9.57275 3.2666 9.57275 2.96631C9.57275 2.8125 9.50684 2.69531 9.39697 2.58545L6.92139 0.197754C6.7749 0.0512695 6.65039 0 6.49658 0C6.3501 0 6.22559 0.0512695 6.07178 0.197754L3.59619 2.58545C3.48633 2.69531 3.42773 2.8125 3.42773 2.96631C3.42773 3.2666 3.64746 3.48633 3.95508 3.48633C4.09424 3.48633 4.25537 3.42773 4.35791 3.31055L5.46387 2.12402L5.96191 1.604L5.91797 2.70264L5.91797 10.2246C5.91797 10.5322 6.18164 10.7959 6.49658 10.7959Z"
                          fill="#000000"
                          fill-opacity="0.85"
                        />
                      </g>
                    </svg>
                    &nbsp; icon
                  </li>
                  <li>Scroll and tap &quot;Add to Home Screen&quot;</li>
                </ul>
              </div>
              <hr style={{ border: "0.5px solid #f6f6f6" }}></hr>
              <div className="landing-add-to-homescreen-instruction">
                <h4>For Android devices</h4>
                <ul>
                  <li>Visit henesys on Chrome</li>
                  <li>
                    Tap the menu
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="landing-ellipse-menu"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                      />
                    </svg>
                    icon
                  </li>
                  <li>Tap &quot;Add to Home Screen&quot;</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </LazyMotion>
  );
}

export { getServerSideProps };
