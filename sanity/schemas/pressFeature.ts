import { defineType, defineField } from "sanity";

export const pressFeature = defineType({
  name: "pressFeature",
  title: "Press Feature",
  type: "document",
  fields: [
    defineField({
      name: "publication",
      title: "Publication",
      type: "string",
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
    }),
    defineField({
      name: "chinese",
      title: "Chinese Text",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "english",
      title: "English Text",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
  ],
});
