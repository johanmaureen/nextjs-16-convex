import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "@/components/web/CommentSection";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PostIdRouteProps {
  params: Promise<{
    postId: Id<"posts">;
  }>;
}

export default async function PostIdRoute({ params }: PostIdRouteProps) {
  const { postId } = await params;
  const post = await fetchQuery(api.posts.getPostById, { postId: postId });

  if (!post) {
    return (
      <div>
        <h1 className="text-6xl font-extrabold text-red-600">No post found</h1>
      </div>
    );
  }
  return (
    <div className="max-w-3xl mz-auto py-8 px-4 animate-in fade-in duration-500 relative">
      <Link
        href="/blog"
        className={buttonVariants({ variant: "outline", className: "mb-4" })}
      >
        <ArrowLeft className="size-4" />
        Back to blog
      </Link>
      <div className="relative w-full h-100 mb-8 rounded-xl overflow-hidden shadow-sm ">
        <Image
          alt="blog image"
          src={
            post.imageUrl ??
            "https://images.unsplash.com/photo-1526779259212-939e64788e3c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D"
          }
          fill
          className="rounded-t-lg object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="space-y-4 flex flex-col">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {post.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          Posted on: {new Date(post._creationTime).toLocaleDateString()}
        </p>
      </div>
      <Separator className="my-8" />
      <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
        {post.body}
      </p>
      <Separator className="my-8" />
      <CommentSection />
    </div>
  );
}
