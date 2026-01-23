import React from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Banner from "./src/components/banners/ceasefire";

export const wrapPageElement = ({ element, props }) => {
  return (
    <>
      <Banner />
      {element}
      <SpeedInsights />
    </>
  );
};
