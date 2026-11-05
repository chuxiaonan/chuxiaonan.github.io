# 楚骁男 · Chu Xiaonan

仿真项目负责人 / Simulation Lead · 阿里巴巴 · 高德地图数据中心（Amap / AutoNavi）

https://chuxiaonan.github.io

Astro + TypeScript + Canvas 2D globe（中文为主）

足迹点 = 去过的城市；飞线只保留精选/当前选中。

Chinese-first personal site. Footprint dots are cities visited; flight arcs stay on the featured set, or the city you select.

## 维护

Node 22+。

```sh
npm install
npm run dev
npm run check
npm run build
npm run preview
```

- 文章：`src/content/blog/`
- 工作与早期实验：`src/data/projects.ts`
- 个人资料：`src/data/site.ts`，首页 `src/pages/index.astro`，关于页 `src/pages/about.astro`

推送到 `main` 后，GitHub Actions 会发布到 GitHub Pages。Pages 的 Source 选择 GitHub Actions。
