module.exports = {
    ArticleTemplateQuery: `
        query ArticleTemplateQuery {
            allArticle(sort: {date: DESC}) {
                articles: nodes {
                    banner {
                        alt
                        caption
                        src {
                            childImageSharp {
                                gatsbyImageData(width: 1920, quality: 90, placeholder: BLURRED)
                            }
                        }
                    }
                    body
                    categories
                    date(formatString: "MMMM DD, YYYY")
                    description
                    id
                    keywords
                    slug
                    title
                    readingTime {
                        text
                      }
                }
            }
        }
    `,
};
