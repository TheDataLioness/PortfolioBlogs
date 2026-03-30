const CONFIG = {
  // profile setting (required)
  profile: {
    name: "Damy op den Kamp",
    image: "/ThisIsMe.svg", // If you want to create your own notion avatar, check out https://notion-avatar.vercel.app
    role: "Technical Designer",
    bio: "I create game experiences.",
    email: "d.opdkamp@gmail.com",
    linkedin: "damyodk",
    github: "",
    instagram: "",
  },
  projects: [
    {
      name: `PortfolioWebsite`,
      href: "https://thedatalioness.github.io",
    }
  ],
  // blog setting (required)
  blog: {
    title: "Portfolio Blogs",
    description: "Welcome to my portfolio blog website!",
    scheme: "light", // 'light' | 'dark' | 'system'
  },

  // CONFIG configration (required)
  link: "https://blogs.damyodk.com",
  since: 2022, // If leave this empty, current year will be used.
  lang: "en-US", // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES', 'ko-KR']
  ogImageGenerateURL: "https://og-image-korean.vercel.app", // The link to generate OG image, don't end with a slash

  // notion configuration (required)
  notionConfig: {
    pageId: '1a65c12abe088053af87c0b63587e8f0',
  },

  // plugin configuration (optional)
  googleAnalytics: {
    enable: false,
    config: {
      measurementId: process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID || "",
    },
  },
  googleSearchConsole: {
    enable: false,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    },
  },
  naverSearchAdvisor: {
    enable: false,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "",
    },
  },
  utterances: {
    enable: true,
    config: {
      repo: process.env.NEXT_PUBLIC_UTTERANCES_REPO || "",
      "issue-term": "og:title",
      label: "💬 Utterances",
    },
  },
  cusdis: {
    enable: false,
    config: {
      host: "https://cusdis.com",
      appid: "", // Embed Code -> data-app-id value
    },
  },
  isProd: process.env.VERCEL_ENV === "production", // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
  revalidateTime: 600, // revalidate time for [slug], index
}

module.exports = { CONFIG }
