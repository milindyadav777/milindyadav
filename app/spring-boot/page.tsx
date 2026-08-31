import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";

export const metadata: Metadata = {
  title: "Spring Boot from First Principles | milindyadav",
  description:
    "A simple, incremental Spring Boot series covering dependency injection, the first application, beans, component scanning, explicit bean creation and auto-configuration.",
};

const modules = [
  {
    number: "01",
    href: "/spring-boot/01-why-spring/",
    title: "Why Spring exists",
    summary: "Start with plain Java, tight coupling, dependency inversion, dependency injection and the composition root.",
    checkpoint: "Refactor an OrderService so it can use email or SMS without creating either implementation.",
  },
  {
    number: "02",
    href: "/spring-boot/02-first-application/",
    title: "Build the first Spring Boot application",
    summary: "Create a minimal non-web Maven application and unpack what @SpringBootApplication actually starts.",
    checkpoint: "Write the POM, application class and application.properties from an empty project.",
  },
  {
    number: "03",
    href: "/spring-boot/03-beans-and-injection/",
    title: "Beans and constructor injection",
    summary: "Let Spring create services, inject interfaces and resolve multiple implementations with @Primary and @Qualifier.",
    checkpoint: "Make email the default sender while an OTP service explicitly requests SMS.",
  },
  {
    number: "04",
    href: "/spring-boot/04-component-scanning-and-bean-creation/",
    title: "Component scanning and explicit bean creation",
    summary: "Understand the scan boundary, @Configuration, @Bean, managed versus ordinary objects and proxyBeanMethods.",
    checkpoint: "Inject a fixed java.time.Clock into a timestamp service for deterministic output.",
  },
  {
    number: "05",
    href: "/spring-boot/05-auto-configuration/",
    title: "Auto-configuration and back-off",
    summary: "See how classpath, bean and property conditions decide which infrastructure Spring Boot contributes.",
    checkpoint: "Evaluate three conditions and predict the exact beans left in the ApplicationContext.",
  },
];

export default function SpringBootSeriesPage() {
  return (
    <main>
      <SiteHeader activePage="blog" />

      <section className="blog-hero spring-series-hero" id="top">
        <Link className="article-back-link" href="/blog/">← All articles</Link>
        <p className="kicker">Guided learning series · 5 modules</p>
        <h1>Learn Spring Boot <em>one mechanism at a time.</em></h1>
        <p>
          Each module adds one idea to the same order-notification example. Read the
          explanation, attempt the timed checkpoint, use hints only when needed and
          then compare your code with the solution.
        </p>
      </section>

      <section className="spring-series-index" aria-labelledby="series-modules-title">
        <div className="spring-series-heading">
          <div>
            <p className="section-index">Current track</p>
            <h2 id="series-modules-title">From plain Java wiring to Boot auto-configuration</h2>
          </div>
          <p>
            The modules are deliberately separate. Complete them in order because each
            checkpoint assumes only the ideas introduced before it.
          </p>
        </div>

        <ol className="spring-module-list">
          {modules.map((module) => (
            <li key={module.href}>
              <span className="spring-module-number">{module.number}</span>
              <div>
                <h3><Link href={module.href}>{module.title}</Link></h3>
                <p>{module.summary}</p>
                <small><strong>Checkpoint:</strong> {module.checkpoint}</small>
              </div>
              <Link className="spring-module-link" href={module.href}>Open module →</Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="blog-next spring-series-rule">
        <p className="section-index">How to use the series</p>
        <h2>Read briefly. Write from memory. Review precisely.</h2>
        <p>
          Start the suggested timer only when your editor is ready. Record whether you
          needed a hint, separate conceptual mistakes from mechanical ones, and finish
          by explaining why the solution works without looking at it.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
