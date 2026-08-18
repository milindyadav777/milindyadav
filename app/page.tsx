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
    eyebrow: "Current observability project",
    title: "Bringing Jenkins and machine telemetry into one view",
    description:
      "I am building an observability setup for Jenkins controllers, agents, jobs, Kubernetes workloads and bare-metal machines. The stack uses Prometheus, Loki, Tempo, Grafana, Alloy and OpenTelemetry.",
    outcome:
      "The next step is reliable correlation across build telemetry, followed by an assistant that can investigate failed builds.",
    tags: ["Grafana", "Prometheus", "Loki", "Tempo", "Alloy", "OpenTelemetry"],
  },
  {
    number: "02",
    eyebrow: "Security tooling",
    title: "Replacing a licensed security scanner with an in-house tool",
    description:
      "Built an in-house Python security-scanning framework that kept the required checks and fit the team's existing workflow.",
    outcome:
      "Removed approximately USD 12,000 in annual licensing cost.",
    tags: ["Python", "Security", "Automation"],
  },
  {
    number: "03",
    eyebrow: "Data engineering",
    title: "Calculation pipelines and reporting",
    description:
      "Implemented performance and attribution calculation logic in Spark data pipelines and contributed to data-lake schema work. Superset was used for dashboards after an initial Looker and LookML proof of concept.",
    outcome:
      "The work covered calculation logic, storage design and reporting.",
    tags: ["Spark", "Data lake", "Superset", "LookML"],
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
          <p className="kicker"><span className="status-dot" /> Open to senior backend, platform, DevOps and SRE roles</p>
          <h1>I build platforms that are easier to <em>run, debug and change.</em></h1>
          <p className="hero-summary">
            Platform and DevOps engineer with 5+ years of software engineering experience across backend systems, CI/CD, Kubernetes, cloud infrastructure and observability.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">Explore selected work <span aria-hidden="true">↘</span></a>
            <a className="button button-secondary" href="https://www.linkedin.com/in/milind-y-27b8a5b6" target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
          </div>
        </div>

        <div className="system-card" aria-label="A simplified view of Milind's engineering focus">
          <div className="system-card-header">
            <span>current focus / build-observability</span>
            <span className="live-label">IN PROGRESS</span>
          </div>
          <div className="system-flow">
            <div className="flow-node"><span>01</span><strong>Job evidence</strong><small>logs · metrics · traces</small></div>
            <div className="flow-line"><i /></div>
            <div className="flow-node active"><span>02</span><strong>System context</strong><small>controller · agent · machine</small></div>
            <div className="flow-line"><i /></div>
            <div className="flow-node"><span>03</span><strong>Investigation</strong><small>correlate · explain · fix</small></div>
          </div>
          <p className="system-note"><span>→</span> A failed build should come with enough evidence to understand what happened.</p>
        </div>
      </section>

      <section className="capability-strip" aria-label="Areas of expertise">
        {capabilities.map((item) => <span key={item}>{item}</span>)}
      </section>

      <section className="section" id="work">
        <div className="section-heading">
          <div>
            <p className="section-index">01 / Selected work</p>
            <h2>A few things I have built or am building.</h2>
          </div>
          <p>I have kept the descriptions general where the implementation is proprietary.</p>
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
          <h2>Most of my work sits where code, delivery systems and infrastructure meet.</h2>
          <p>
            I have worked in backend development, system software validation and DevOps and infrastructure roles. That path has made me comfortable moving between application code, pipelines, cloud services, Kubernetes and the machines underneath them.
          </p>
          <p>
            I like problems where a failure crosses layers. I prefer to look at the evidence first, understand the failing path and then change the smallest part that actually solves the problem.
          </p>
        </div>
        <div className="principles">
          <div><span>01</span><strong>Start with evidence</strong><p>Reproduce the issue and understand the failing path.</p></div>
          <div><span>02</span><strong>Automate repeated work</strong><p>If a team keeps doing it by hand, I look for a safe way to automate it.</p></div>
          <div><span>03</span><strong>Make systems easier to own</strong><p>Write down the reasoning and leave the next person a clearer path.</p></div>
        </div>
      </section>

      <section className="reading section" id="reading">
        <div className="reading-intro">
          <p className="section-index">03 / Notes from the margin</p>
          <h2>Books I argue with, underline and return to.</h2>
          <p>
            I read to sharpen how I think about systems. These are my own paraphrased
            notes, not quotations from the books.
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
          <h2>Tools I use regularly.</h2>
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
        <h2>I am open to senior backend, platform, DevOps and SRE roles.</h2>
        <p>If my experience fits what your team is building, please get in touch.</p>
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
