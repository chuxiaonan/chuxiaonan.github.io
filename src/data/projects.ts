export interface Project {
  title: string;
  description: string;
  descriptionEn: string;
  year?: string;
  stack?: string[];
  links: { label: string; href: string }[];
}
export const projects: Project[] = [
  {
    "title": "chuxiaonan.github.io",
    "description": "本站源码：基于 Astro 的个人技术网站，首页地球由手写 Canvas 渲染器绘制，经 GitHub Actions 部署到 GitHub Pages。",
    "descriptionEn": "Source of this site: an Astro personal site with a hand-written canvas globe, deployed to GitHub Pages via GitHub Actions.",
    "year": "2026",
    "stack": [
      "Astro",
      "TypeScript",
      "Canvas"
    ],
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/chuxiaonan/chuxiaonan.github.io"
      }
    ]
  },
  {
    "title": "Highlight Promotion Links of Baidu Search Results",
    "description": "油猴用户脚本：为百度搜索结果中的推广链接加上醒目标记，点击前翻转卡片二次确认。",
    "descriptionEn": "Userscript that highlights promoted links in Baidu search results and asks for confirmation via a flip card before opening them.",
    "year": "2016",
    "stack": [
      "JavaScript",
      "Userscript",
      "CSS"
    ],
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/chuxiaonan/Highlight-promotion-links-of-Baidu-search-results"
      }
    ]
  },
  {
    "title": "Baidu Index Transcribe Style",
    "description": "油猴用户脚本：在使用背景皮肤的百度首页上把导航等文字改为白色以提升可读性，并移除右上角的“更多产品”入口。",
    "descriptionEn": "Userscript that recolors Baidu homepage text to white for readability on skinned backgrounds and removes the “More products” link.",
    "year": "2015",
    "stack": [
      "JavaScript",
      "Userscript"
    ],
    "links": [
      {
        "label": "GitHub",
        "href": "https://github.com/chuxiaonan/Baidu-index-transcribe-style"
      }
    ]
  }
];
