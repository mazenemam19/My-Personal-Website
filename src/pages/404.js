import React from "react";
import "./404.css";

export default function NotFoundPage() {
  return (
    <main className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <h2 className="notfound-subtitle">
        {/* TODO: i18n or config-driven string */}
        Lost in the code?
      </h2>
      <p className="notfound-message">
        {/* TODO: i18n or config-driven string */}
        This page doesn’t exist—but a great developer always finds their way back.
      </p>
      <a className="notfound-home-btn" href="/">
        {/* TODO: i18n or config-driven string */}
        Back to Home
      </a>
      <a
        className="notfound-resume-btn"
        href="/Mazen_Emam_Mid_Senior_Frontend_Engineer.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* TODO: i18n or config-driven string */}
        Download Resume
      </a>
    </main>
  );
}
