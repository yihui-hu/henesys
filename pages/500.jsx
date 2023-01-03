import Link from "next/link";

export default function Custom404() {
  return (
    <div className="error-container">
      <div className="error-modal">
        <div>
          <h4 className="error-404">500</h4>
          <br></br>
          <Link href="/">
            ← return home
          </Link>
        </div>
      </div>
    </div>
  );
}
