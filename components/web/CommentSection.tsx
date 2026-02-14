"use client";
import { Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema } from "@/app/schemas/comment";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { createCommentAction } from "@/app/actions";
import z from "zod";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

export function CommentSection() {
  const params = useParams<{ postId: Id<"posts"> }>();
  const data = useQuery(api.comments.getCommentsByPostId, {
    postId: params.postId,
  });
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(commentSchema as any),
    defaultValues: {
      body: "",
      postId: params.postId,
    },
  });

  function onSubmit(values: z.infer<typeof commentSchema>) {
    startTransition(async () => {
      await createCommentAction(values);
      form.reset();
      //void addNewPost({ title: values.title, body: values.content });
      toast.success("Comment was successly added");
      //router.push("/");
    });
  }
  if (data === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <Card>
      <CardHeader className="fle flex-row items-center gap-2 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-xl font-bold">5 Comments</h2>
      </CardHeader>
      <CardContent className="space-y-8">
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Comment</FieldLabel>
                <Textarea
                  aria-invalid={fieldState.invalid}
                  placeholder="Share your thought"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <span>Post Comment</span>
            )}
          </Button>
        </form>
        {data?.length > 0 && <Separator className="" />}
        <section className="space-y-6">
          {data?.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar className="size-10 shrink-0">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${comment.authorName}`}
                  alt={comment.authorName}
                />
                <AvatarFallback>
                  {comment.authorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{comment.authorName}</p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(comment._creationTime).toLocaleDateString()}{" "}
                  </p>
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {comment.body}
                </p>
              </div>
            </div>
          ))}
        </section>
      </CardContent>
    </Card>
  );
}
