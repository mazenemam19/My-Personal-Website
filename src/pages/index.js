import React from "react";
import {
  AboutSection,
  ArticlesSection,
  HeroSection,
  InterestsSection,
  Page,
  ProjectsSection,
} from "gatsby-theme-portfolio-minimal";
import SeoWrapper from "../components/SeoWrapper";

import "./index.css"

export default function IndexPage() {
  return (
    <>
      <SeoWrapper title="Mazen Emam" />
      <Page useSplashScreenAnimation>
        <HeroSection sectionId="hero" />
        <ArticlesSection sectionId='articles' heading='Latest Articles' sources={["Blog"]} />
        <AboutSection sectionId='about' heading='About Me' />
        <InterestsSection sectionId='skills' heading='Skills' />
        <ProjectsSection sectionId='projects' heading='My Side Projects' />
      </Page>
    </>
  );
}
