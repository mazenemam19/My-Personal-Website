import React from "react";
import {
  AboutSection,
  ArticlesSection,
  ContactSection,
  HeroSection,
  InterestsSection,
  Page,
  ProjectsSection,
} from "gatsby-theme-portfolio-minimal";
import SeoWrapper from "../components/SeoWrapper";
import { TestimonialsSection } from "../components/TestimonialsSection";
import testimonialsData from "../../content/sections/testimonials/testimonials.json";

import "./index.css"

export default function IndexPage() {
  return (
    <>
      <SeoWrapper title="Mazen Emam" />
      <Page useSplashScreenAnimation>
        <HeroSection sectionId="hero" />
        <ArticlesSection sectionId='articles' heading='Latest Articles' sources={["Blog"]} />
        <AboutSection sectionId='about' heading='About Me' />
        <TestimonialsSection sectionId="testimonials" heading="Recommendations" testimonials={testimonialsData} />
        <InterestsSection sectionId='skills' heading='Skills' />
        <ProjectsSection sectionId='projects' heading='My Side Projects' />
        <ContactSection sectionId="contact" heading="Contact" />
      </Page>
    </>
  );
}
