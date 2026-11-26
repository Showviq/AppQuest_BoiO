"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Audience, Post } from "@/lib/mock/social";

// Posts the signed-in user writes. Mockup phase (D-011): kept in this browser only.
const KEY = "boio-my-posts";
const EVENT = "boio-my-posts";
const EMPTY: Post[] = [];

let cache: { raw: string | null; posts: Post[] } = { raw: null, posts: EMPTY };

function read(): Post[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {}
  if (raw === cache.raw) return cache.posts;
  let posts: Post[] = EMPTY;
  try {
    posts = raw ? (JSON.parse(raw) as Post[]) : EMPTY;
  } catch {}
  cache = { raw, posts };
  return posts;
}

function write(posts: Post[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(posts));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useMyPosts() {
  const posts = useSyncExternalStore(subscribe, read, () => EMPTY);
  const add = useCallback((p: Omit<Post, "id" | "user" | "handle" | "likes" | "comments" | "ago" | "feeds" | "mine" | "ts">) => {
    const post: Post = {
      ...p,
      id: `my-${Date.now()}`,
      user: "You",
      handle: "me",
      likes: 0,
      comments: 0,
      ago: "now",
      feeds: [],
      mine: true,
      ts: Date.now(),
    };
    write([post, ...read()]);
    return post;
  }, []);
  const remove = useCallback((id: string) => write(read().filter((p) => p.id !== id)), []);
  return { posts, add, remove };
}

/** Where a post shows up, by audience. One source of truth for the UI and the docs. */
export const reach: Record<Audience, string[]> = {
  public: ["Followers' feeds", "Latest", "Your profile", "Book page"],
  followers: ["Followers' feeds", "Your profile (followers only)"],
  community: ["That community only"],
};
