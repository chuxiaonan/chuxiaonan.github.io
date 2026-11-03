import { getCollection } from "astro:content";
export async function getPosts() {
  return (
    await getCollection(
      "blog",
      ({ data }) => !import.meta.env.PROD || !data.draft,
    )
  ).sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}
export const formatDate = (date: Date) =>
  date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  });
