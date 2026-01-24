import React from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Banner from "./src/components/banners/ceasefire";
import './gatsby-browser.css'
export const wrapPageElement = ({ element, props }) => {
  const pathname = props?.path
  const isBlogPage =
    pathname?.startsWith('/blog') && pathname !== '/blog';
  console.log('isBlogPage', isBlogPage)

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
