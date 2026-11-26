"use client";

import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Comments } from "@/components/social/comments";
import { useMyPosts } from "@/components/social/my-posts";
import { PostCard } from "@/components/social/post-card";
import { BackButton } from "@/components/ui";
import { comments, defaultComments, posts } from "@/lib/mock/social";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const { posts: mine } = useMyPosts();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const post = posts.find((p) => p.id === id) ?? mine.find((p) => p.id === id);

  if (!post) {
    // Your own posts live in this browser; wait for it before 404-ing.
    if (id.startsWith("my-") && !mounted) return <div className="skeleton mt-24 h-24 rounded-2xl" aria-label="Loading" />;
    notFound();
  }

  return (
    <>
      <BackButton />
      <div className="border-b border-line">
        <PostCard post={post} detail />
      </div>
      <h2 className="mb-3 mt-5 font-semibold">Comments</h2>
      <Comments initial={post.mine ? [] : (comments[post.id] ?? defaultComments)} />
    </>
  );
}
