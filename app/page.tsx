import BookCarousel from "./BookCarousel";
import ThemeToggle from "./ThemeToggle";

const capabilities = [
  "Platform engineering",
  "DevOps automation",
  "Observability",
  "Backend systems",
  "Cloud infrastructure",
  "Developer experience",
];

const caseStudies = [
  {
    number: "01",
    eyebrow: "Observability platform",
    title: "Making failed builds explain themselves",
    description:
      "Designed a unified observability ecosystem for Jenkins jobs, controllers, agents, Kubernetes workloads and bare-metal machines—correlating metrics, logs and traces around a single failed build.",
    outcome:
      "A foundation for faster incident investigation and an AI-assisted debugging workflow.",
    tags: ["Grafana", "Prometheus", "Loki", "Tempo", "Alloy", "OpenTelemetry"],
  },
  {
    number: "02",
    eyebrow: "Engineering productivity",
    title: "Replacing a costly quality workflow",
    description:
      "Built an internal quality framework that automated repeatable validation, integrated with existing delivery pipelines and removed dependence on a costly third-party tool.",
    outcome:
      "Reduced recurring tooling cost while giving the engineering team more control over its workflow.",
    tags: ["Python", "Jenkins", "Automation", "CI/CD"],
  },
  {
    number: "03",
    eyebrow: "Data & application platform",
    title: "Turning pipeline data into decisions",
    description:
      "Implemented calculation logic with Spark data pipelines, shaped data-lake schemas and exposed operational insights through OpenSearch dashboards and a Looker proof of concept.",
    outcome:
      "Connected data processing, durable storage and decision-ready visualisation in one system.",
    tags: ["Spark", "Data lake", "OpenSearch", "LookML"],
  },
];

const stack = [
  { label: "Build & delivery", value: "Jenkins · Groovy · Docker · Helm · Kubernetes" },
  { label: "Cloud & platform", value: "AWS · EKS · S3 · IAM · Redis · MySQL" },
  { label: "Observability", value: "OpenTelemetry · Grafana · Prometheus · Loki · Tempo" },
  { label: "Software", value: "Python · Java · Spring · Kotlin · C++" },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="milindyadav, home">
          <span className="brand-mark" aria-hidden="true">my</span>
          <span>milindyadav</span>
        </a>
        <div className="header-actions">
          <nav aria-label="Main navigation">
            <a href="#work">Work</a>
            <a href="#about">About</a>
            <a href="#reading">Reading</a>
            <a href="#contact">Contact</a>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="kicker"><span className="status-dot" /> Open to senior engineering opportunities</p>
          <h1>I build systems that help engineers <em>move with confidence.</em></h1>
          <p className="hero-summary">
            Platform and DevOps engineer with 5+ years across software, infrastructure and semiconductor engineering—focused on observable systems, dependable delivery and elegant automation.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">Explore selected work <span aria-hidden="true">↘</span></a>
            <a className="button button-secondary" href="https://www.linkedin.com/in/milind-y-27b8a5b6" target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
          </div>
        </div>

        <div className="system-card" aria-label="A simplified view of Milind's engineering focus">
          <div className="system-card-header">
            <span>system / engineering-impact</span>
            <span className="live-label">LIVE</span>
          </div>
          <div className="system-flow">
            <div className="flow-node"><span>01</span><strong>Signals</strong><small>logs · metrics · traces</small></div>
            <div className="flow-line"><i /></div>
            <div className="flow-node active"><span>02</span><strong>Understanding</strong><small>context · correlation · cause</small></div>
            <div className="flow-line"><i /></div>
            <div className="flow-node"><span>03</span><strong>Action</strong><small>automate · recover · improve</small></div>
          </div>
          <p className="system-note"><span>→</span> The goal is not more telemetry. It is better engineering decisions.</p>
        </div>
      </section>

      <section className="capability-strip" aria-label="Areas of expertise">
        {capabilities.map((item) => <span key={item}>{item}</span>)}
      </section>

      <section className="section" id="work">
        <div className="section-heading">
          <div>
            <p className="section-index">01 / Selected work</p>
            <h2>Systems with a measurable reason to exist.</h2>
          </div>
          <p>Representative work, described without proprietary implementation details.</p>
        </div>

        <div className="case-list">
          {caseStudies.map((item) => (
            <article className="case-study" key={item.number}>
              <div className="case-number">{item.number}</div>
              <div className="case-main">
                <p className="case-eyebrow">{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <div className="case-result">
                <p className="case-eyebrow">Why it matters</p>
                <p>{item.outcome}</p>
                <div className="tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about section" id="about">
        <div className="about-copy">
          <p className="section-index">02 / How I work</p>
          <h2>I like hard problems at the boundary between software and infrastructure.</h2>
          <p>
            My path through digital design, system validation, backend development and DevOps gives me a broad view of how complex systems fail—and how teams experience those failures. I turn that perspective into platforms that are easier to operate, debug and evolve.
          </p>
          <p>
            I care about strong fundamentals, direct communication and solving the real constraint instead of polishing the nearest symptom.
          </p>
        </div>
        <div className="principles">
          <div><span>01</span><strong>Start with the failure mode</strong><p>Design from operational reality, not just the happy path.</p></div>
          <div><span>02</span><strong>Automate understanding</strong><p>Reduce the time between a signal and a confident decision.</p></div>
          <div><span>03</span><strong>Leave a clearer system</strong><p>Good engineering improves both the platform and its mental model.</p></div>
        </div>
      </section>

      <section className="reading section" id="reading">
        <div className="reading-intro">
          <p className="section-index">03 / Notes from the margin</p>
          <h2>Books I argue with, underline and return to.</h2>
          <p>
            I learn best when an idea survives contact with a real system. These are
            paraphrased notes from books on my shelf—not quotations, and definitely
            not a list of rules I follow blindly.
          </p>
          <aside className="desk-note">
            <span>off-screen interests</span>
            Board games, unusually good stationery, and asking one more “why?”
          </aside>
        </div>
        <BookCarousel />
      </section>

      <section className="section stack-section">
        <div>
          <p className="section-index">04 / Working toolkit</p>
          <h2>Tools are choices.<br />Outcomes are the work.</h2>
        </div>
        <div className="stack-list">
          {stack.map((group) => (
            <div key={group.label}>
              <span>{group.label}</span>
              <p>{group.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="contact section" id="contact">
        <p className="section-index">05 / Start a conversation</p>
        <h2>Building a platform, improving reliability or untangling a difficult system?</h2>
        <p>Let&apos;s compare notes.</p>
        <a className="contact-link" href="https://www.linkedin.com/in/milind-y-27b8a5b6" target="_blank" rel="noreferrer">
          Connect on LinkedIn <span aria-hidden="true">↗</span>
        </a>
      </section>

      <footer>
        <a className="brand" href="#top"><span className="brand-mark">my</span><span>milindyadav</span></a>
        <p>Platform · DevOps · Software Engineering</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
