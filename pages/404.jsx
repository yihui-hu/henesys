import Link from "next/link";

export default function Custom404() {
  return (
    <div className="error-container">
      <Link href="/">
        <div className="error-modal">
          <img src={"/buddha-bless.png"} />
        </div>
      </Link>
    </div>
  );
}
