import React from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Banner from "./src/components/banners/ceasefire";

export const wrapPageElement = ({ element, props }) => {
  const pathname = props?.path
  const isBlogPage =
    pathname?.startsWith('/blog') && pathname !== '/blog';

  return (
    <>
      <Banner />
      <div className={isBlogPage ? 'markdown' : ''}>
        {element}
      </div>
      <SpeedInsights />
    </>
  );
};
