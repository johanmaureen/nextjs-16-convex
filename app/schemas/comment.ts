import { Id } from "@/convex/_generated/dataModel";
import z from "zod";

export const commentSchema = z.object({
  body: z.string().min(3, "Comment must be longer than 3 chars"),
  postId: z.custom<Id<"posts">>(),
});
