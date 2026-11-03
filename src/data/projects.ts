export interface Project {
  title: string;
  description: string;
  tags: string[];
  links: { label: string; href: string }[];
}
export const projects: Project[] = [
  {
    title: "渲染 / Rendering",
    description: "占位 / Placeholder — 待填写",
    tags: ["Rendering"],
    links: [],
  },
  {
    title: "三维建模 / 3D Modeling",
    description: "占位 / Placeholder — 待填写",
    tags: ["3D Modeling"],
    links: [],
  },
  {
    title: "地理信息 / GIS",
    description: "占位 / Placeholder — 待填写",
    tags: ["GIS", "Web Mapping"],
    links: [],
  },
];
