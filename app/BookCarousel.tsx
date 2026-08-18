"use client";

import { useState } from "react";

const books = [
  {
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    note: "Reliability starts by assuming that parts of the system will fail. The useful question is not whether failure happens, but whether the design makes it understandable and recoverable.",
    shelf: "Distributed systems",
    mark: "DDIA",
  },
  {
    title: "A Philosophy of Software Design",
    author: "John Ousterhout",
    note: "Complexity hides in dependencies and unclear intent. A strong module earns its place by concealing difficult decisions behind a small, coherent interface.",
    shelf: "Software design",
    mark: "APSD",
  },
  {
    title: "The Staff Engineer's Path",
    author: "Tanya Reilly",
    note: "Senior technical work is not simply solving a harder ticket. It is creating context, improving decisions and helping several teams move in the same direction.",
    shelf: "Technical leadership",
    mark: "STAFF",
  },
  {
    title: "Operating Systems: Three Easy Pieces",
    author: "Remzi & Andrea Arpaci-Dusseau",
    note: "Every clean abstraction is supported by real mechanisms and trade-offs underneath. Understanding both layers makes debugging far less mysterious.",
    shelf: "Systems",
    mark: "OSTEP",
  },
  {
    title: "Observability Engineering",
    author: "Charity Majors, Liz Fong-Jones & George Miranda",
    note: "Useful telemetry lets you investigate questions nobody predicted before deployment. That changes observability from a dashboard collection into a way of understanding production.",
    shelf: "Observability",
    mark: "OBS",
  },
  {
    title: "Computer Architecture: A Quantitative Approach",
    author: "John Hennessy & David Patterson",
    note: "Measure first. Optimisation becomes meaningful when it is tied to the common case, explicit constraints and the actual behaviour of the complete system.",
    shelf: "Computer architecture",
    mark: "CAQA",
  },
];

export default function BookCarousel() {
  const [active, setActive] = useState(0);
  const book = books[active];

  const move = (direction: number) => {
    setActive((current) => (current + direction + books.length) % books.length);
  };

  return (
    <div
      className="book-carousel"
      aria-label="Reading notes carousel"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") move(-1);
        if (event.key === "ArrowRight") move(1);
      }}
    >
      <div className="book-card" aria-live="polite">
        <div className="book-spine">
          <span>{book.mark}</span>
          <small>{String(active + 1).padStart(2, "0")}</small>
        </div>
        <div className="book-note">
          <p className="book-shelf">{book.shelf}</p>
          <h3>{book.title}</h3>
          <p className="book-author">by {book.author}</p>
          <div className="pencil-line" />
          <p className="margin-label">What stayed with me</p>
          <p className="takeaway">{book.note}</p>
        </div>
      </div>

      <div className="carousel-controls">
        <div className="carousel-buttons">
          <button type="button" onClick={() => move(-1)} aria-label="Previous book">←</button>
          <button type="button" onClick={() => move(1)} aria-label="Next book">→</button>
        </div>
        <div className="carousel-dots" aria-label={"Book " + (active + 1) + " of " + books.length}>
          {books.map((item, index) => (
            <button
              type="button"
              key={item.title}
              className={index === active ? "active" : ""}
              aria-label={"Show " + item.title}
              aria-current={index === active ? "true" : undefined}
              onClick={() => setActive(index)}
            />
          ))}
        </div>
        <span className="carousel-count">{active + 1} / {books.length}</span>
      </div>
    </div>
  );
}
