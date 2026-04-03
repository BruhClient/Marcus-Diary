import { defineType, defineField } from "sanity";

export const backstory = defineType({
  name: "backstory",
  title: "Backstory",
  type: "document",
  fields: [
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
  ],
});
