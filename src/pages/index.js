import React from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import {
  AboutSection,
  ArticlesSection,
  HeroSection,
  InterestsSection,
  Page,
  ProjectsSection,
} from "gatsby-theme-portfolio-minimal";
import SeoWrapper from "../components/SeoWrapper";
import Banner from '../components/banners/ceasefire'

import "./index.css"

export default function IndexPage() {
  return (
    <>
      <SeoWrapper title="Mazen Emam" />
      <Banner />
      <SpeedInsights />
      <Page useSplashScreenAnimation>
        <HeroSection sectionId='hero' />
        <ArticlesSection sectionId='articles' heading='Latest Articles' sources={["Medium"]} />
        <AboutSection sectionId='about' heading='About Me' />
        <InterestsSection sectionId='skills' heading='Skills' />
        <ProjectsSection sectionId='projects' heading='My Side Projects' />
      </Page>
    </>
  );
}
