import z from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be longer than 3 chars")
    .max(30, "Title must be smaller than 30 chars"),
  content: z.string().min(10, "Content must big longer than 10 chars"),
  image: z.instanceof(File),
});
