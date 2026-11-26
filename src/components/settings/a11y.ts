// Accessibility prefs: stored in localStorage, applied as data-* attributes on <html>.
// The pre-paint script in app/layout.tsx applies the same keys before hydration.

export type TextSize = "sm" | "md" | "lg" | "xl";
export type A11y = { font: boolean; contrast: boolean; text: TextSize; motion: boolean };

export const A11Y_KEY = "boio-a11y";
export const a11yDefaults: A11y = { font: false, contrast: false, text: "md", motion: false };

export function loadA11y(): A11y {
  try {
    return { ...a11yDefaults, ...JSON.parse(localStorage.getItem(A11Y_KEY) || "{}") };
  } catch {
    return a11yDefaults;
  }
}

export function applyA11y(p: A11y) {
  const d = document.documentElement.dataset;
  if (p.font) d.font = "dyslexic";
  else delete d.font;
  if (p.contrast) d.contrast = "high";
  else delete d.contrast;
  if (p.text !== "md") d.text = p.text;
  else delete d.text;
  if (p.motion) d.motion = "reduce";
  else delete d.motion;
  try {
    localStorage.setItem(A11Y_KEY, JSON.stringify(p));
  } catch {}
}
