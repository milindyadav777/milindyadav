import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";

export const metadata: Metadata = {
  title: "Blog | milindyadav",
  description:
    "Technical notes by Milind Yadav on Java, systems, platform engineering, DevOps and observability.",
};

const posts = [
  {
    number: "01",
    href: "/java-memory/",
    category: "Java runtime field guide",
    title: "Java Memory Architecture",
    summary:
      "Follow executable Java 17 code through JVM stacks, heap objects, runtime constant pools, HotSpot Metaspace, the JIT code cache and direct memory.",
    topics: ["Java", "JVM", "HotSpot", "G1", "Memory"],
    format: "Interactive explainer",
  },
];

export default function BlogPage() {
  return (
    <main>
      <SiteHeader activePage="blog" />

      <section className="blog-hero" id="top">
        <p className="kicker">Technical notes</p>
        <h1>Ideas become clearer when I <em>trace them to the mechanism.</em></h1>
        <p>
          Detailed notes on Java, systems, platform engineering and observability.
          Some are conventional articles; others are interactive explanations built
          around executable examples.
        </p>
      </section>

      <section className="blog-index" aria-labelledby="articles-title">
        <div className="blog-index-heading">
          <div>
            <p className="section-index">Published</p>
            <h2 id="articles-title">Articles and field guides</h2>
          </div>
          <p>
            This index will grow as I turn study notes and practical investigations
            into material worth returning to.
          </p>
        </div>

        <div className="blog-list">
          {posts.map((post) => (
            <article className="blog-entry" key={post.href}>
              <span className="blog-entry-number">{post.number}</span>
              <div className="blog-entry-main">
                <p className="case-eyebrow">{post.category}</p>
                <h3><Link href={post.href}>{post.title}</Link></h3>
                <p>{post.summary}</p>
                <div className="tags" aria-label={`Topics: ${post.topics.join(", ")}`}>
                  {post.topics.map((topic) => <span key={topic}>{topic}</span>)}
                </div>
              </div>
              <div className="blog-entry-action">
                <span>{post.format}</span>
                <Link href={post.href}>Read article <span aria-hidden="true">↗</span></Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="blog-next">
        <p className="section-index">Next notes</p>
        <h2>More explanations will join this index as they are ready.</h2>
        <p>
          The structure is now reusable, so each future article can have its own page
          while remaining discoverable from one place.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
