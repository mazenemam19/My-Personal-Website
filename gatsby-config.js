module.exports = {
  siteMetadata: {
    title: `Mazen Emam`,
    description: `Mazen Emam is a software engineer based in Egypt, He is proficient in developing user interfaces with React and other frontend web technologies. He has a good understanding of web development principles, including HTML, CSS, JavaScript, and related frameworks, and is experienced in building interactive, visually appealing web applications. He is also able to efficiently debug and optimize web applications, utilizing debugging tools and performance optimization techniques to ensure a smooth user experience.`,
    author: `Mazen Emam`,
    siteUrl: `https://mazenemam19.vercel.app`,
  },
  plugins: [
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-robots-txt`,
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: ["G-ZNP2T1GXDP"],
        pluginConfig: {
          head: true,
        },
      },
    },
    {
      resolve: "gatsby-theme-portfolio-minimal",
      options: {
        siteUrl: "https://mazenemam19.vercel.app/", // Used for sitemap generation
        manifestSettings: {
          favicon: "./content/images/favicon.png", // Path is relative to the root
          siteName: "Mazen Emam", // Used in manifest.json
          shortName: "Mazen Emam", // Used in manifest.json
          startUrl: "/", // Used in manifest.json
          backgroundColor: "#FFFFFF", // Used in manifest.json
          themeColor: "#000000", // Used in manifest.json
          display: "minimal-ui", // Used in manifest.json
        },
        contentDirectory: "./content",
        blogSettings: {
          path: "/blog", // Defines the slug for the blog listing page
          usePathPrefixForArticles: true, // Default true (i.e. path will be /blog/first-article)
        },
      },
    },
  ],
};
