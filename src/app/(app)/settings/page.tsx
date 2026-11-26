"use client";

import { Download, KeyRound, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useLibrary } from "@/components/library-store";
import { type A11y, type TextSize, a11yDefaults, applyA11y, loadA11y } from "@/components/settings/a11y";
import { Sheet } from "@/components/sheet";
import { useToast } from "@/components/toast";
import { Accordion, Avatar, BackButton, Button, PageTitle, Switch, field } from "@/components/ui";
import { blockedDemo } from "@/lib/mock/people";

type Theme = "system" | "light" | "dark";
type Privacy = { privateProfile: boolean; privateHistory: boolean; showActivity: boolean };
const PRIVACY_KEY = "boio-privacy";
const sizes: { id: TextSize; label: string }[] = [
  { id: "sm", label: "S" },
  { id: "md", label: "M" },
  { id: "lg", label: "L" },
  { id: "xl", label: "XL" },
];

function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((o) => (
        <button
          key={o.id}
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={`h-10 rounded-xl border text-sm capitalize ${
            value === o.id ? "border-forest bg-forest-soft font-semibold text-forest" : "border-line"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function Settings() {
  const toast = useToast();
  const { library } = useLibrary();
  const [privacy, setPrivacy] = useState<Privacy>({ privateProfile: false, privateHistory: false, showActivity: true });
  const [a11y, setA11y] = useState<A11y>(a11yDefaults);
  const [theme, setTheme] = useState<Theme>("system");
  const [blocked, setBlocked] = useState(blockedDemo);
  const [pwOpen, setPwOpen] = useState(false);

  useEffect(() => {
    setA11y(loadA11y());
    try {
      setTheme((localStorage.getItem("boio-theme") as Theme) || "system");
      const raw = localStorage.getItem(PRIVACY_KEY);
      if (raw) setPrivacy(JSON.parse(raw));
    } catch {}
  }, []);

  const updatePrivacy = (patch: Partial<Privacy>) => {
    const next = { ...privacy, ...patch };
    setPrivacy(next);
    try {
      localStorage.setItem(PRIVACY_KEY, JSON.stringify(next));
    } catch {}
  };

  const updateA11y = (patch: Partial<A11y>) => {
    const next = { ...a11y, ...patch };
    setA11y(next);
    applyA11y(next);
  };

  const applyTheme = (t: Theme) => {
    setTheme(t);
    try {
      if (t === "system") {
        localStorage.removeItem("boio-theme");
        delete document.documentElement.dataset.theme;
      } else {
        localStorage.setItem("boio-theme", t);
        document.documentElement.dataset.theme = t;
      }
    } catch {}
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ exported: new Date().toISOString(), library, privacy }, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "boio-my-data.json";
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Export downloaded");
  };

  const signOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    toast("Signed out");
  };

  return (
    <>
      <BackButton />
      <PageTitle>Settings</PageTitle>

      <div className="rounded-2xl border border-line bg-surface px-4">
        <Accordion title="Privacy" defaultOpen>
          <div className="text-ink">
            <Switch label="Private profile" checked={privacy.privateProfile} onChange={(v) => updatePrivacy({ privateProfile: v })} />
            <Switch
              label="Private reading history"
              checked={privacy.privateHistory}
              onChange={(v) => updatePrivacy({ privateHistory: v })}
            />
            <Switch label="Show activity in feed" checked={privacy.showActivity} onChange={(v) => updatePrivacy({ showActivity: v })} />
          </div>
        </Accordion>

        <Accordion title="Blocked users" meta={blocked.length || undefined}>
          {blocked.length === 0 ? (
            <p>No one blocked.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {blocked.map((u) => (
                <li key={u.handle} className="flex items-center gap-3 text-ink">
                  <Avatar name={u.name} size="sm" />
                  <span className="flex-1">
                    <span className="block font-medium">{u.name}</span>
                    <span className="text-sm text-ink-soft">@{u.handle}</span>
                  </span>
                  <Button
                    variant="outline"
                    className="min-h-9 px-4 text-sm"
                    onClick={() => {
                      setBlocked(blocked.filter((x) => x.handle !== u.handle));
                      toast(`Unblocked ${u.name}`);
                    }}
                  >
                    Unblock
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Accordion>

        <Accordion title="Accessibility">
          <div className="flex flex-col gap-1 text-ink">
            <p className="mb-2 text-sm text-ink-soft">Text size</p>
            <Segmented options={sizes} value={a11y.text} onChange={(text) => updateA11y({ text })} label="Text size" />
            <div className="mt-2">
              <Switch label="Dyslexia-friendly font" checked={a11y.font} onChange={(font) => updateA11y({ font })} />
              <Switch label="High contrast" checked={a11y.contrast} onChange={(contrast) => updateA11y({ contrast })} />
              <Switch label="Reduce motion" checked={a11y.motion} onChange={(motion) => updateA11y({ motion })} />
            </div>
            <p className="mb-2 mt-2 text-sm text-ink-soft">Theme</p>
            <Segmented
              options={[
                { id: "system", label: "system" },
                { id: "light", label: "light" },
                { id: "dark", label: "dark" },
              ]}
              value={theme}
              onChange={applyTheme}
              label="Theme"
            />
          </div>
        </Accordion>

        <Accordion title="Your data">
          <Button variant="outline" onClick={exportData}>
            <Download size={18} /> Export my data
          </Button>
        </Accordion>

        <Accordion title="Account">
          <div className="flex flex-col items-start">
            <Button variant="ghost" className="-ml-3 text-ink" onClick={() => setPwOpen(true)}>
              <KeyRound size={18} /> Change password
            </Button>
            <Button variant="ghost" className="-ml-3 text-danger" onClick={signOut}>
              <LogOut size={18} /> Sign out
            </Button>
          </div>
        </Accordion>
      </div>

      <Sheet open={pwOpen} onClose={() => setPwOpen(false)} title="Change password">
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            setPwOpen(false);
            toast("Password updated");
          }}
        >
          <input type="password" autoComplete="current-password" placeholder="Current password" className={field} required />
          <input type="password" autoComplete="new-password" placeholder="New password" minLength={8} className={field} required />
          <Button type="submit" className="mt-2 w-full">
            Save
          </Button>
        </form>
      </Sheet>
    </>
  );
}
