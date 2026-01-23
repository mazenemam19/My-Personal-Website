import React from "react";
import { LegalSection, Page } from "gatsby-theme-portfolio-minimal";
import SeoWrapper from "../components/SeoWrapper";

export default function ImprintPage() {
  return (
    <>
      <SeoWrapper title="Imprint | Mazen Emam" noIndex={true} />
      <Page>
        <LegalSection sectionId="imprint" heading="Imprint" />
      </Page>
    </>
  );
}
