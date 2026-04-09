import { defineType, defineField } from "sanity";

export const artwork = defineType({
  name: "artwork",
  title: "Artwork",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "price",
      title: "Price (SGD)",
      type: "number",
      validation: (R) => R.required().min(0),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "images",
      title: "Images",
      description: "At least 1 image, maximum 5. First image is the hero.",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (R) => R.required().min(1).max(5),
    }),
    defineField({
      name: "sold",
      title: "Sold",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
