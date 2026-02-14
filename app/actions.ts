"use server";

import z from "zod";
import { postSchema } from "./schemas/blog";
import { fetchAuthMutation } from "@/lib/auth-server";
import { api } from "../convex/_generated/api";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { commentSchema } from "./schemas/comment";

export async function createBlogAction(values: z.infer<typeof postSchema>) {
  const parsed = postSchema.safeParse(values);

  if (!parsed.success) {
    throw new Error("invalid values something went wrong");
  }

  try {
    const imageUrl = await fetchAuthMutation(
      api.posts.generateImageUpLoadUrl,
      {},
    );
    const uploadResult = await fetch(imageUrl, {
      method: "POST",
      headers: {
        "Content-Type": parsed.data.image.type,
      },
      body: parsed.data.image,
    });

    if (!uploadResult.ok) {
      return {
        error: "Failed to upload image",
      };
    }

    const { storageId } = await uploadResult.json();

    await fetchAuthMutation(api.posts.createPost, {
      body: parsed.data.content,
      title: parsed.data.title,
      imageStorageId: storageId,
    });
  } catch {
    return {
      error: "Failed to create post",
    };
  }
  revalidatePath("/blog");
  return redirect("/blog");
}

export async function createCommentAction(
  values: z.infer<typeof commentSchema>,
) {
  const parsed = commentSchema.safeParse(values);

  if (!parsed.success) {
    throw new Error("invalid values something went wrong");
  }
  const comment = await fetchAuthMutation(api.comments.createComment, {
    body: parsed.data.body,
    postId: parsed.data.postId,
  });
  return comment;
}
