window.PORTFOLIO_DATA = {
  person: {
    name: "陈以安",
    role: "视觉设计师 / UI Designer",
    location: "Shanghai, China",
    email: "hello@chenyian.design",
    portrait: "assets/profile-placeholder.png",
  },
  nav: [
    { label: "首页", target: "#home" },
    { label: "关于", target: "#about" },
    { label: "经历", target: "#experience" },
    { label: "能力", target: "#skills" },
    { label: "作品", target: "#works" },
    { label: "联系", target: "#contact" },
  ],
  hero: {
    eyebrow: "01 / PORTFOLIO",
    title: "陈以安",
    subtitle: "以设计的思维，打造清晰而有力量的视觉体验。",
    intro:
      "专注品牌视觉、产品界面与动态体验，将叙事、秩序与情绪结合，建立可以被记住的数字作品。",
    primaryAction: { label: "查看作品", target: "#works" },
    secondaryAction: { label: "开始合作", target: "#contact" },
  },
  about: {
    eyebrow: "02 / PROFILE",
    title: "把视觉语言做得克制、锋利，也足够动人。",
    paragraphs: [
      "我关注从品牌识别到产品界面的完整体验，擅长在复杂信息里建立清晰层级，并用动态与细节提升作品的记忆点。",
      "作品通常从策略和情绪开始，经过网格、字体、色彩与动效的反复推敲，最终形成能稳定延展的视觉系统。",
    ],
    facts: [
      ["方向", "Brand / UI / Motion"],
      ["经验", "5+ Years"],
      ["状态", "Available for freelance"],
      ["语言", "中文 / English"],
    ],
  },
  experience: [
    {
      year: "2022 - Now",
      title: "独立视觉设计师",
      summary: "为科技品牌、内容团队与初创产品建立网站视觉、产品界面和发布物料系统。",
    },
    {
      year: "2020 - 2022",
      title: "高级 UI 设计师",
      summary: "负责 SaaS 产品核心界面、设计系统与关键运营页面，提升交互一致性与转化效率。",
    },
    {
      year: "2018 - 2020",
      title: "品牌视觉设计师",
      summary: "参与品牌升级、活动视觉、海报系统与社交媒体模板，形成可持续扩展的视觉规范。",
    },
  ],
  education: [
    {
      year: "2014 - 2018",
      title: "江南大学",
      summary: "视觉传达设计 / 本科",
    },
  ],
  skillGroups: [
    {
      name: "Design",
      skills: [
        { label: "UI Design", value: 95 },
        { label: "Branding", value: 92 },
        { label: "Motion", value: 86 },
        { label: "3D Visual", value: 78 },
      ],
    },
    {
      name: "Workflow",
      skills: [
        { label: "Figma", value: 96 },
        { label: "Photoshop", value: 90 },
        { label: "Illustrator", value: 88 },
        { label: "After Effects", value: 82 },
      ],
    },
  ],
  tools: ["Figma", "Photoshop", "Illustrator", "After Effects", "Blender", "Notion", "Principle", "Spline"],
  stats: [
    ["50+", "Selected Works"],
    ["18", "Brand Systems"],
    ["32", "Product Screens"],
    ["90%", "Repeat Clients"],
  ],
  works: Array.from({ length: 50 }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    const types = ["Brand Identity", "UI System", "Motion Key Visual", "Product Landing", "Editorial Design"];
    return {
      title: `Selected Work ${number}`,
      type: types[index % types.length],
      year: 2026 - (index % 5),
      image: `assets/works/work-${number}.png`,
      description: "视觉系统、界面结构与动态氛围的组合实验，可替换为真实项目说明。",
    };
  }),
  contact: {
    eyebrow: "06 / CONTACT",
    title: "让作品与体验共同发布。",
    intro:
      "如果你正在准备品牌升级、产品官网、作品集或数字发布体验，可以把项目背景发给我，我们一起把它做得更完整。",
    action: { label: "发送邮件", href: "mailto:hello@chenyian.design" },
  },
  socials: [
    { label: "Behance", href: "https://www.behance.net/" },
    { label: "Dribbble", href: "https://dribbble.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Instagram", href: "https://www.instagram.com/" },
  ],
};
