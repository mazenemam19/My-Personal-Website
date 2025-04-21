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
    const section = sectionRef.current;
    if (!section) return;
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        section.classList.add("animate-in");
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="testimonials-section" ref={sectionRef}>
      <h2 className="testimonials-title animated-underline">What Others Say</h2>
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
