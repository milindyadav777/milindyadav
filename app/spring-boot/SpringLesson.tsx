import type { ReactNode } from "react";
import Link from "next/link";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";

type LessonLink = {
  href: string;
  label: string;
};

type SpringLessonProps = {
  number: string;
  title: ReactNode;
  summary: string;
  outcomes: string[];
  previous?: LessonLink;
  next?: LessonLink;
  children: ReactNode;
};

const lessons = [
  { number: "01", href: "/spring-boot/01-why-spring/", label: "Why Spring exists" },
  { number: "02", href: "/spring-boot/02-first-application/", label: "First Boot application" },
  { number: "03", href: "/spring-boot/03-beans-and-injection/", label: "Beans and injection" },
  { number: "04", href: "/spring-boot/04-component-scanning-and-bean-creation/", label: "Bean creation" },
  { number: "05", href: "/spring-boot/05-auto-configuration/", label: "Auto-configuration" },
];

export function CodeBlock({ children, label }: { children: string; label?: string }) {
  return (
    <div className="spring-code-block">
      {label ? <span>{label}</span> : null}
      <pre><code>{children}</code></pre>
    </div>
  );
}

export function Practice({
  time,
  children,
  hints,
  solution,
}: {
  time: string;
  children: ReactNode;
  hints: ReactNode;
  solution: ReactNode;
}) {
  return (
    <section className="spring-practice" aria-labelledby="practice-title">
      <div className="spring-practice-heading">
        <div>
          <p className="section-index">Practice checkpoint</p>
          <h2 id="practice-title">Write it before reading the solution.</h2>
        </div>
        <span>{time}</span>
      </div>
      <div className="spring-practice-task">{children}</div>
      <details>
        <summary>Hints, in increasing order</summary>
        <div className="spring-details-body">{hints}</div>
      </details>
      <details>
        <summary>Working solution</summary>
        <div className="spring-details-body">{solution}</div>
      </details>
      <div className="spring-practice-score">
        <strong>Record after the attempt</strong>
        <p>
          Elapsed time · hint level (H0 means no hint; H1–Hn is the last hint used) ·
          conceptual errors · mechanical errors · explanation confidence from 0–2.
        </p>
      </div>
    </section>
  );
}

export default function SpringLesson({
  number,
  title,
  summary,
  outcomes,
  previous,
  next,
  children,
}: SpringLessonProps) {
  return (
    <main>
      <SiteHeader activePage="blog" />

      <section className="spring-lesson-hero" id="top">
        <Link className="article-back-link" href="/spring-boot/">← Series overview</Link>
        <p className="kicker">Spring Boot from first principles · Module {number} of 05</p>
        <h1>{title}</h1>
        <p>{summary}</p>
        <div className="spring-outcomes">
          <strong>After this module, you should be able to:</strong>
          <ul>{outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
        </div>
      </section>

      <div className="spring-lesson-shell">
        <aside className="spring-series-nav" aria-label="Spring Boot series modules">
          <p>Series modules</p>
          <ol>
            {lessons.map((lesson) => (
              <li key={lesson.href} className={lesson.number === number ? "active" : ""}>
                <Link href={lesson.href} aria-current={lesson.number === number ? "page" : undefined}>
                  <span>{lesson.number}</span>{lesson.label}
                </Link>
              </li>
            ))}
          </ol>
        </aside>

        <article className="spring-lesson-content">{children}</article>
      </div>

      <nav className="spring-lesson-pager" aria-label="Lesson navigation">
        {previous ? <Link href={previous.href}>← {previous.label}</Link> : <span />}
        {next ? <Link href={next.href}>{next.label} →</Link> : <Link href="/spring-boot/">Series overview →</Link>}
      </nav>

      <SiteFooter />
    </main>
  );
}
