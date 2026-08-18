"use client";

import { useState } from "react";

const books = [
  {
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    note: "The most useful shift for me was treating failure as normal. A good design makes failures easier to understand, contain and recover from.",
    shelf: "Distributed systems",
    mark: "DDIA",
  },
  {
    title: "A Philosophy of Software Design",
    author: "John Ousterhout",
    note: "I now judge a module partly by what it lets the rest of the system ignore. A small interface is valuable when it hides a genuinely difficult decision.",
    shelf: "Software design",
    mark: "APSD",
  },
  {
    title: "The Staff Engineer's Path",
    author: "Tanya Reilly",
    note: "This book made senior technical work feel less like a bigger task list. Much of the job is creating context and helping several teams make better decisions.",
    shelf: "Technical leadership",
    mark: "STAFF",
  },
  {
    title: "Operating Systems: Three Easy Pieces",
    author: "Remzi & Andrea Arpaci-Dusseau",
    note: "It keeps pulling me below familiar abstractions. Understanding the mechanism underneath makes operating-system behaviour much easier to reason about.",
    shelf: "Systems",
    mark: "OSTEP",
  },
  {
    title: "Observability Engineering",
    author: "Charity Majors, Liz Fong-Jones & George Miranda",
    note: "The idea I keep returning to is that telemetry should support questions we did not predict before deployment. That is more useful than collecting a fixed set of dashboards.",
    shelf: "Observability",
    mark: "OBS",
  },
  {
    title: "Computer Architecture: A Quantitative Approach",
    author: "John Hennessy & David Patterson",
    note: "It reinforces a habit I value: measure first. An optimisation matters only when it improves the common case under the system's real constraints.",
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
