import {
  AboutSection,
  ArticlesSection,
  HeroSection,
  InterestsSection,
  Page,
  ProjectsSection,
  Seo,
} from "gatsby-theme-portfolio-minimal";
import React, { useEffect } from "react";
import Banner from "../components/banners/ceasefire";
import Testimonials from "../components/testimonials";

import "./index.css";

// Animated scroll indicator
const ScrollIndicator = () => (
  <div className="scroll-indicator">
    <span className="scroll-dot" />
  </div>
);

export default function IndexPage() {
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
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Seo title="Mazen Emam" />
      <Banner />
      <ScrollIndicator />
      <Page useSplashScreenAnimation>
        <HeroSection sectionId="hero" />
        <ArticlesSection
          sectionId="articles"
          heading="Latest Articles"
          sources={["Medium"]}
        />
        <AboutSection sectionId="about" heading="About Me" />
        <InterestsSection sectionId="skills" heading="Skills" />
        <ProjectsSection sectionId="projects" heading="My Side Projects" />
        <Testimonials />
      </Page>
    </>
  );
}
