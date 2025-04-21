import { useEffect, useRef } from "react";
import "./index.css";
import testimonialsData from "../../../content/sections/testimonials/testimonials.json";
const testimonials = testimonialsData.testimonials;

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
        {
          testimonialsData.heading
        }
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
