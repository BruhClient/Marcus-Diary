import { defineType, defineField } from "sanity";

export const merchandise = defineType({
  name: "merchandise",
  title: "Merchandise",
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
      name: "stock",
      title: "Stock",
      type: "number",
      initialValue: 0,
      validation: (R) => R.required().min(0),
    }),
    defineField({
      name: "images",
      title: "Images",
      description: "At least 1 image, maximum 5. First image is the hero.",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (R) => R.required().min(1).max(5),
    }),
  ],
});
