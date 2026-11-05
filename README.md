# 楚骁男 · Chu Xiaonan

以中文为主、英文为辅的个人技术网站。Astro 静态生成、严格 TypeScript、Markdown / MDX、手写 Canvas 2D 地球，原生 CSS。站点地址：https://chuxiaonan.github.io（无 base 路径）。

## 本地开发

使用 Node.js 22.23.4+（或更高版本；建议当前 LTS）和 npm。

```sh
npm install
npm run dev
npm run check     # 等同于 npx astro check
npm run build
npm run preview
```

`package-lock.json` 已生成，应纳入版本控制；CI 使用 npm 安装依赖。构建产物位于 `dist/`。

## 添加文章

在 `src/content/blog/` 中添加 `.md` 或 `.mdx` 文件。文件路径决定 URL，例如 `rendering/first-note.md` 对应 `/blog/rendering/first-note/`。

```yaml
---
title: "文章标题"
description: "简短摘要"
pubDate: 2026-11-03
updatedDate: 2026-11-04 # 可选
tags: ["Rendering", "GIS"] # 可选
draft: true # 可选，默认 false
lang: zh-CN # 可选，zh-CN 或 en，默认 zh-CN
---
```

`draft: true` 的文章在本地开发时可见，在生产构建、列表、首页、RSS 和 sitemap 中均不生成。发布日期用于倒序排列；未来日期不会自动隐藏文章，需要隐藏时请使用 draft。本站介绍见 `src/content/blog/about-this-site.md`。内容结构在 `src/content.config.ts` 中定义。MDX 支持导入 Astro 组件；普通文章使用 Markdown 即可。代码块使用 Shiki 的 github-dark 主题。

## 修改项目

编辑 `src/data/projects.ts`：每项含 `title`、`description`、`descriptionEn`、可选的 `year`、`stack`、`home` 和 `links`。`home: true` 的条目出现在首页「本站源码」；其余只在工作页的早期实验里。链接为 `{ label: 'GitHub', href: 'https://...' }`。

## 修改个人信息与页面

- `src/data/site.ts`：姓名、职位、组织、所在地、GitHub 与默认 SEO 简介。
- `src/pages/index.astro`：首页简介、技术方向。
- `src/pages/about.astro`：教育与个人资料。调整事实时请同步首页简介。
- `src/styles/global.css`：配色、字体、布局；默认深色主题，也可通过导航栏按钮切换并保存到 localStorage。
- `src/components/Hero.astro` / `src/scripts/globe.ts`：静态 SVG 与按需加载的 Canvas 2D 渲染器。北京是地理视觉锚点，其他点与弧线仅为抽象装饰，不代表项目或工作地点。

地球支持拖动（触屏保留纵向滚动），限制像素比到 2，小屏降低细节，离屏 / 后台暂停；卸载时释放资源。支持减少动态效果偏好；Canvas 不可用时保留静态 SVG。文本无需 JavaScript 即可阅读。

## 部署

`.github/workflows/deploy.yml` 在推送到 `main` 或手动触发时运行检查、构建并发布 GitHub Pages。使用官方 `withastro/action@v6` 和 `actions/deploy-pages@v5`，Node 22，具有 Pages 权限与部署并发限制。

在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。之后自行提交并推送源码和 lockfile 即可；无需提交 `dist/`。站点的 sitemap、robots.txt、RSS 均使用正式域名，更换域名时需同步 `astro.config.mjs` 与 `public/robots.txt`。

## English

A static, Chinese-first bilingual technical personal site built with Astro, TypeScript, MDX and Canvas 2D. Run `npm install`, `npm run dev`, `npm run check`, and `npm run build`; preview with `npm run preview`. Add posts in `src/content/blog/`, edit projects in `src/data/projects.ts`, and update profile data in `src/data/site.ts` plus the home/about pages. Drafts are excluded from production. Enable GitHub Actions as the Pages source, then push to `main` to deploy.
