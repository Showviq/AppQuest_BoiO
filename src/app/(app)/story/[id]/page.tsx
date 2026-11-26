"use client";

import { ChevronLeft, ChevronRight, Settings2 } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/components/play/motion";
import { SceneArt } from "@/components/play/scene-art";
import { Sheet } from "@/components/sheet";
import { BackButton, Button, Progress, Switch } from "@/components/ui";
import { getBook } from "@/lib/mock-data";
import { stories } from "@/lib/mock/fandom";

const sizes = ["text-base", "text-lg", "text-xl", "text-2xl"];

/** Soft generated rain: filtered noise, no audio files. */
function useAmbient(on: boolean) {
  const ctx = useRef<AudioContext | null>(null);
  useEffect(() => {
    if (!on) return;
    const ac = new AudioContext();
    ctx.current = ac;
    const buf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02; // brown-ish noise
      data[i] = last * 3.5;
    }
    const src = ac.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1200;
    const gain = ac.createGain();
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(0.35, ac.currentTime + 1.5);
    src.connect(filter).connect(gain).connect(ac.destination);
    src.start();
    return () => {
      src.stop();
      ac.close();
      ctx.current = null;
    };
  }, [on]);
}

export default function Story() {
  const { id } = useParams<{ id: string }>();
  const story = stories[id];
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  const [art, setArt] = useState(true);
  const [anim, setAnim] = useState(true);
  const [sound, setSound] = useState(false);
  const [size, setSize] = useState(1);
  useAmbient(sound);
  if (!story) notFound();

  const book = getBook(story.bookId);
  const scene = story.scenes[i];
  const last = i === story.scenes.length - 1;

  return (
    <>
      <div className="flex items-center justify-between">
        <BackButton />
        <button
          onClick={() => setOpen(true)}
          aria-label="Reader settings"
          className="grid size-11 place-items-center rounded-full hover:bg-surface-2"
        >
          <Settings2 size={22} />
        </button>
      </div>

      <p className="text-sm text-ink-soft">{book?.title}</p>
      <h1 className="font-serif text-3xl">{story.title}</h1>
      <Progress value={((i + 1) / story.scenes.length) * 100} className="mt-3" />

      <article className="mt-5">
        {art && <SceneArt kind={scene.scene} animate={anim && !reduced} />}
        <p className={`mt-5 font-serif leading-relaxed ${sizes[size]}`}>{scene.text}</p>
      </article>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="outline" onClick={() => setI(i - 1)} disabled={i === 0} aria-label="Previous scene">
          <ChevronLeft size={18} />
        </Button>
        <span className="text-sm text-ink-soft">
          {i + 1} / {story.scenes.length}
        </span>
        {last ? (
          <Link href={`/book/${story.bookId}`} className="inline-flex min-h-11 items-center rounded-full bg-forest px-5 font-semibold text-on-forest">
            Read the book
          </Link>
        ) : (
          <Button onClick={() => setI(i + 1)} aria-label="Next scene">
            <ChevronRight size={18} />
          </Button>
        )}
      </div>

      <Sheet open={open} onClose={() => setOpen(false)} title="Reader">
        <Switch checked={art} onChange={setArt} label="Illustrations" />
        <Switch checked={anim && !reduced} onChange={setAnim} label={reduced ? "Animations (reduced motion on)" : "Animations"} />
        <Switch checked={sound} onChange={setSound} label="Ambient sound" />
        <div className="mt-3">
          <p className="mb-2 text-sm text-ink-soft">Text size</p>
          <div role="radiogroup" aria-label="Text size" className="grid grid-cols-4 gap-2">
            {sizes.map((s, n) => (
              <button
                key={s}
                role="radio"
                aria-checked={size === n}
                onClick={() => setSize(n)}
                className={`h-10 rounded-xl border font-serif ${s} ${size === n ? "border-forest bg-forest-soft text-forest" : "border-line"}`}
              >
                A
              </button>
            ))}
          </div>
        </div>
      </Sheet>
    </>
  );
}
