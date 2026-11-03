import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts } from "../data/posts";
import { site } from "../data/site";
export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: "楚骁男 Chu Xiaonan · Blog",
    description: site.description,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
    })),
    customData: "<language>zh-CN</language>",
  });
}
