/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://sitename.com",
    generateRobotsTxt: true,
    sitemapSize: 7000,
    exclude: ["/admin/*", "/api/*"],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin", "/api"],
            },
        ],
        // additionalSitemaps: [
        //     `${process.env.NEXT_PUBLIC_SITE_URL || "https://sitename.com"}/sitemap.xml`,
        // ],
    },
};
