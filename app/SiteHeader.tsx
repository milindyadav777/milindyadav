import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

type SiteHeaderProps = {
  activePage?: "home" | "java-memory";
};

export default function SiteHeader({ activePage = "home" }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <Link className="brand" href="/#top" aria-label="milindyadav, home">
        <span className="brand-mark" aria-hidden="true">my</span>
        <span>milindyadav</span>
      </Link>
      <div className="header-actions">
        <nav aria-label="Main navigation">
          <Link
            className="nav-lab"
            href="/java-memory/"
            aria-current={activePage === "java-memory" ? "page" : undefined}
          >
            Java memory
          </Link>
          <Link href="/#work">Work</Link>
          <Link href="/#about">About</Link>
          <Link href="/#reading">Reading</Link>
          <Link href="/#contact">Contact</Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
