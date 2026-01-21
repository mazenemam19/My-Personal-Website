module.exports = {
  siteMetadata: {
    title: `Mazen Emam`,
    description: `Mazen Emam is a software engineer based in Egypt, He is proficient in developing user interfaces with React and other frontend web technologies. He has a good understanding of web development principles, including HTML, CSS, JavaScript, and related frameworks, and is experienced in building interactive, visually appealing web applications. He is also able to efficiently debug and optimize web applications, utilizing debugging tools and performance optimization techniques to ensure a smooth user experience.`,
    author: `Mazen Emam`,
    siteUrl: `https://mazenemam19.vercel.app`,
  },
  plugins: [
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        host: 'https://mazenemam19.vercel.app',
        sitemap: 'https://mazenemam19.vercel.app/sitemap-index.xml',
        policy: [
          { userAgent: '*', allow: '/' },
          { userAgent: 'GPTBot', allow: '/' },
          { userAgent: 'Claude-bot', allow: '/' },
        ]
      }
    },
    {
      resolve: `gatsby-source-rss-feed`,
      options: {
        url: `https://medium.com/feed/@mazenemam19`,
        name: `Medium`,
      }
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allFeedMedium } }) => {
              return allFeedMedium.edges.map(edge => {
                return Object.assign({}, edge.node, {
                  description: edge.node.title, // Fallback as contentSnippet is missing
                  date: edge.node.isoDate,
                  url: edge.node.link,
                  guid: edge.node.guid,
                  custom_elements: [
                    { "content:encoded": edge.node.content.encoded },
                    { "author": edge.node.creator }
                  ],
                })
              })
            },
            query: `
              {
                allFeedMedium(
                  sort: { order: DESC, fields: [isoDate] },
                ) {
                  edges {
                    node {
                      title
                      link
                      content {
                        encoded
                      }
                      isoDate
                      creator
                      guid
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Mazen Emam's RSS Feed",
          },
        ],
      },
    },
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
