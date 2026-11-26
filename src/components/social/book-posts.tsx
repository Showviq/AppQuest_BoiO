"use client";

import { useMyPosts } from "@/components/social/my-posts";
import { PostCard } from "@/components/social/post-card";
import { posts } from "@/lib/mock/social";

/** Public posts that mention this book (followers-only and community posts never show here). */
export function BookPosts({ bookId }: { bookId: string }) {
  const { posts: mine } = useMyPosts();
  const list = [
    ...mine.filter((p) => p.bookId === bookId && p.audience === "public"),
    ...posts.filter((p) => p.bookId === bookId && p.kind !== "community"),
  ];
  if (!list.length) return null;
  return (
    <section className="reveal mt-8" aria-label="Posts">
      <h2 className="text-lg font-semibold">Posts</h2>
      <ul className="flex flex-col divide-y divide-line">
        {list.map((p) => (
          <li key={p.id}>
            <PostCard post={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
