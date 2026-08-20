import Link from "next/link";

type SiteFooterProps = {
  backToTopHref?: string;
};

export default function SiteFooter({ backToTopHref = "#top" }: SiteFooterProps) {
  return (
    <footer>
      <Link className="brand" href="/#top">
        <span className="brand-mark" aria-hidden="true">my</span>
        <span>milindyadav</span>
      </Link>
      <p>Platform · DevOps · Software Engineering</p>
      <a href={backToTopHref}>Back to top ↑</a>
    </footer>
  );
}
