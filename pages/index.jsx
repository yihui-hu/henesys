import { React } from "react";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import { getServerSideProps } from "../lib/authStaticPages";

export default function Landing() {
  const router = useRouter();

  return (
    <LazyMotion features={domAnimation}>
      <div className="landing-container">
        <div className="landing-navbar">
          <div className="landing-navbar-header">
            <h4 className="landing-navbar-logo">field-observer</h4>
            <m.h2
              className="landing-navbar-text"
              initial={{ y: "30px", opacity: 0 }}
              animate={{ y: "0px", opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              is a barebones bookmarking / <br></br> capture-anything site
            </m.h2>
          </div>
          <m.div
            className="landing-auth-button-container"
            initial={{ y: "30px", opacity: 0 }}
            animate={{ y: "0px", opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", delay: 0.05 }}
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
            initial={{ y: "30px", opacity: 0 }}
            animate={{ y: "0px", opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", delay: 0.1 }}
          >
            <m.div className="landing-modal">
              this site is basically an are.na lite / mymind lite. you can use
              it however you like honestly. whether to jot down quick notes, or
              bookmark something interesting you came across
            </m.div>
            <h4 className="landing-modal-caption">what</h4>
          </m.div>
          <m.div
            initial={{ y: "30px", opacity: 0 }}
            animate={{ y: "0px", opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", delay: 0.13 }}
          >
            <div className="landing-modal">
              save / add either files (images, pdfs, etc), urls or plaintext.
              tag them for easy search-up / grouping. community view allows you
              to view unprivated blocks of peers and friends. (you can get
              pretty far with tags tbh to create your own systems of
              organization)
            </div>
            <h4 className="landing-modal-caption">features.gif</h4>
          </m.div>
          <m.div
            initial={{ y: "30px", opacity: 0 }}
            animate={{ y: "0px", opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", delay: 0.16 }}
          >
            <div className="landing-modal">dk, dc</div>
            <h4 className="landing-modal-caption">how.jpg</h4>
          </m.div>
          <m.div
            initial={{ y: "30px", opacity: 0 }}
            animate={{ y: "0px", opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", delay: 0.19 }}
          >
            <div className="landing-modal">
              i love are.na, and wanted to try building a simpler, less
              feature-full but also less complex version of it.
            </div>
            <h4 className="landing-modal-caption">why.pdf</h4>
          </m.div>
        </div>
      </div>
    </LazyMotion>
  );
}

export { getServerSideProps };
