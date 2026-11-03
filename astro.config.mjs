import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
export default defineConfig({
  site: "https://chuxiaonan.github.io",
  output: "static",
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [
      {
        name: "compact-three-shaders",
        apply: "build",
        transform(code, id) {
          if (!/\/three\/src\/renderers\/shaders\/.*\.glsl\.js$/.test(id))
            return;
          // JS minifiers cannot compact GLSL inside strings. Preserve newlines
          // for preprocessor directives and token boundaries for shader semantics.
          return code.replace(/`([^`]*)`/g, (_, shader) => {
            const compact = shader
              .replace(/\/\*[\s\S]*?\*\//g, " ")
              .replace(/\/\/[^\n]*/g, "")
              .split("\n")
              .map((line) => line.trim().replace(/[ \t]+/g, " "))
              .filter(Boolean)
              .map((line) =>
                line.startsWith("#")
                  ? `\n${line}\n`
                  : line.replace(/\s*([{}();,=*<>])\s*/g, "$1"),
              )
              .join(" ")
              .replace(/\n+/g, "\n");
            return JSON.stringify(`\n${compact}\n`);
          });
        },
      },
    ],
  },
  markdown: { shikiConfig: { theme: "github-dark" } },
});
