import { defineType, defineField } from "sanity";

export const socialLinks = defineType({
  name: "socialLinks",
  title: "Social Links",
  type: "document",
  fields: [
    defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
    defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
    defineField({ name: "youtube", title: "YouTube URL", type: "url" }),
    defineField({ name: "x", title: "X (Twitter) URL", type: "url" }),
  ],
});
