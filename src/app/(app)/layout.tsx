import { AudioProvider } from "@/components/audio/audio-store";
import { AudioSpacer, MiniPlayer } from "@/components/audio/player";
import { LibraryProvider } from "@/components/library-store";
import { BottomNav, SideNav } from "@/components/nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <LibraryProvider>
      <AudioProvider>
        <div className="mx-auto flex max-w-6xl">
          <SideNav />
          <main className="min-h-dvh w-full max-w-2xl px-4 pb-28 pt-4 lg:border-x lg:border-line lg:px-8 lg:pb-12">
            {children}
            <AudioSpacer />
          </main>
        </div>
        <MiniPlayer />
        <BottomNav />
      </AudioProvider>
    </LibraryProvider>
  );
}
