import { useEffect, useRef } from "react";
import "./index.css";

export default function CeaseFire() {
  const bannerRef = useRef(null);

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;
    banner.classList.add("animate-in");
  }, []);

  return (
    <div className="banner animate-in" ref={bannerRef}>
      <a href="https://ceasefiretoday.com/" target="_blank" rel="noreferrer" referrerPolicy="no-referrer">
        # CeasefireNow!{" "}
        <span role="img" aria-label="palestine emoji">
          🇵🇸
        </span>
      </a>
    </div>
  );
}
