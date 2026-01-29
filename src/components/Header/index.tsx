import xIcon from '../../assets/x.svg'

export function Header() {
  return (
    <header className="flex items-center mb-8">
      <h1 className="text-[28px] font-bold m-0 text-text">反田叶月 collection！</h1>
      <a
        href="https://x.com/tanda_hazuki"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center no-underline transition-transform hover:scale-110"
      >
        <img src={xIcon} alt="X (Twitter)" className="w-6 h-6 ml-3 dark:invert" />
      </a>
    </header>
  )
}
