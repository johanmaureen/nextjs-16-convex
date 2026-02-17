import { Loader2, Search } from "lucide-react";
import { Input } from "../ui/input";
import React, { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";

export default function SearchInput() {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);

  const results = useQuery(
    api.posts.searchPosts,
    term.length >= 2 ? { limit: 5, term: term } : "skip",
  );

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTerm(e.target.value);
    setOpen(true);
  }
  return (
    <div className="relative w-full max-w-sm">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search Posts..."
          className="w-full pl-8 bg-background"
          value={term}
          onChange={handleInputChange}
        />
      </div>
      {open && term.length > 2 && (
        <div className="absolute top-full mt-2 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
          {results === undefined ? (
            <div>
              <Loader2 className="" />
              Searching...
            </div>
          ) : results.length === 0 ? (
            <p>No results found!</p>
          ) : (
            <div className="py-4">
              {results.map((post) => (
                <Link key={post._id} href={`/blog/${post._id}`}>
                  <p>{post.title}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
