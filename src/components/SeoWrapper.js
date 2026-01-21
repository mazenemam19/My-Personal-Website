import React from "react";
import { Seo } from "gatsby-theme-portfolio-minimal";
import { Helmet } from "react-helmet";

const SeoWrapper = ({ title, description, useTitleTemplate }) => {
    const schemaOrgJSONLD = [
        {
            "@context": "http://schema.org",
            "@type": "WebSite",
            "url": "https://mazenemam19.vercel.app/",
            "name": "Mazen Emam | Software Engineer",
            "alternateName": "Mazen Emam Portfolio",
        },
        {
            "@context": "http://schema.org",
            "@type": "Person",
            "name": "Mazen Emam",
            "url": "https://mazenemam19.vercel.app/",
            "sameAs": [
                "https://github.com/mazenemam19",
                "https://www.linkedin.com/in/mazenemam19/",
                "https://mazenemam19.medium.com",
            ],
            "jobTitle": "Software Engineer",
            "worksFor": {
                "@type": "Organization",
                "name": "Freelance / Self-Employed",
            },
            "description": "Software Engineer specializing in frontend development with 4+ years of experience building scalable web applications.",
        },
    ];

    return (
        <>
            <Seo title={title} description={description} useTitleTemplate={useTitleTemplate} />
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(schemaOrgJSONLD)}
                </script>
            </Helmet>
        </>
    );
};

export default SeoWrapper;
