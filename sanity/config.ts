import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";

const singletons = new Set(["slideshow", "backstory", "gallery", "socialLinks"]);

export default defineConfig({
  name: "marcus-diary",
  title: "Marcus Diary",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem().title("Slideshow").child(
              S.document().schemaType("slideshow").documentId("slideshow")
            ),
            S.listItem().title("Backstory").child(
              S.document().schemaType("backstory").documentId("backstory")
            ),
            S.listItem().title("Gallery").child(
              S.document().schemaType("gallery").documentId("gallery")
            ),
            S.listItem().title("Social Links").child(
              S.document().schemaType("socialLinks").documentId("socialLinks")
            ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => !singletons.has(item.getId() ?? "")
            ),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
});
