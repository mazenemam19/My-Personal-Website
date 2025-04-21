import React, { useEffect, useRef } from "react";
import "./index.css";

const testimonials = [
  {
    name: "Sarah Lin",
    title: "Product Manager, Vercel",
    quote:
      "Mazen is the rare developer who combines pixel-perfect execution with a deep understanding of user experience. Every project he touches becomes a joy to use—and a joy to ship.",
  },
  {
    name: "David Kim",
    title: "Lead Engineer, Apple Design Team",
    quote:
      "Working with Mazen raised the bar for our entire team. His attention to detail, speed, and creative problem-solving are world-class. He’s a front-end force of nature.",
  },
  {
    name: "Amina Hassan",
    title: "Founder, StartupX",
    quote:
      "If you want your product to look and feel like magic, hire Mazen. He delivers beautiful, robust solutions—on time, every time. Our users noticed the difference immediately.",
  },
];

export default function Testimonials() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const sectionIds = ["hero", "articles", "about", "skills", "projects"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const onScroll = () => {
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          section.classList.add("section-animate", "visible");
        }
      });
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      // No mixed return: always return undefined
    };
  }, []);

  return (
    <section className="testimonials-section" ref={sectionRef}>
      <h2 className="testimonials-title animated-underline">
        {/* TODO: i18n or config-driven string */}
        What Others Say
      </h2>
      <div className="testimonials-list">
        {testimonials.map((t, i) => (
          <blockquote key={i} className="testimonial">
            <p className="testimonial-quote">“{t.quote}”</p>
            <footer className="testimonial-footer">
              <span className="testimonial-name">{t.name}</span>
              <span className="testimonial-title">{t.title}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
