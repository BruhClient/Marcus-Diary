import { defineType, defineField } from "sanity";

export const galleryItem = defineType({
  name: "gallery",
  title: "Gallery",
  type: "document",
  fields: [
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "year",
              title: "Year",
              type: "number",
            }),
          ],
        },
      ],
    }),
  ],
});
