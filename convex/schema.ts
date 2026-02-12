import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  numbers: defineTable({
    value: v.number(),
  }),
  posts: defineTable({
    title: v.string(),
    body: v.string(),
    authorId: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  })
    .searchIndex("search_title", {
      searchField: "title",
    })
    .searchIndex("search_body", {
      searchField: "body",
    }),
});
