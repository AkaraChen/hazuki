import xIcon from "../../assets/x.svg";

export function Header() {
  return (
    <header className="site-header">
      <h1>反田叶月 collection！</h1>
      <a
        href="https://x.com/tanda_hazuki"
        target="_blank"
        rel="noopener noreferrer"
        className="social-link"
      >
        <img src={xIcon} alt="X (Twitter)" className="x-icon" />
      </a>
    </header>
  );
}
