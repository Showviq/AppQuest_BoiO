import type { SceneKind } from "@/lib/mock/fandom";

const css = `
@keyframes sa-twinkle { 0%,100% { opacity: .25 } 50% { opacity: 1 } }
@keyframes sa-rain { from { transform: translateY(-40px) } to { transform: translateY(240px) } }
@keyframes sa-wave { from { transform: translateX(0) } to { transform: translateX(-80px) } }
@keyframes sa-rise { from { transform: translateY(30px) } to { transform: translateY(0) } }
.sa-anim .sa-star { animation: sa-twinkle 3s ease-in-out infinite }
.sa-anim .sa-drop { animation: sa-rain 1.1s linear infinite }
.sa-anim .sa-wave { animation: sa-wave 6s linear infinite }
.sa-anim .sa-sun { animation: sa-rise 6s ease-out both }
`;

const skies: Record<SceneKind, [string, string]> = {
  night: ["#0f1a2b", "#24344d"],
  rain: ["#28323a", "#4a5862"],
  river: ["#2c5866", "#7fa6a0"],
  dawn: ["#f0b46a", "#f6dfb1"],
};

/** Illustrated scene panel (pure SVG). Animations only run when `animate` is true. */
export function SceneArt({ kind, animate }: { kind: SceneKind; animate: boolean }) {
  const [top, bottom] = skies[kind];
  return (
    <div className={`overflow-hidden rounded-2xl ${animate ? "sa-anim" : ""}`}>
      <style>{css}</style>
      <svg viewBox="0 0 320 200" className="block h-auto w-full" role="img" aria-label={`${kind} scene`}>
        <defs>
          <linearGradient id={`sky-${kind}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={top} />
            <stop offset="1" stopColor={bottom} />
          </linearGradient>
        </defs>
        <rect width="320" height="200" fill={`url(#sky-${kind})`} />

        {kind === "night" && (
          <>
            <circle cx="250" cy="45" r="18" fill="#f3eedd" />
            <circle cx="257" cy="40" r="16" fill={top} />
            {[[30, 30], [80, 55], [130, 25], [180, 60], [210, 20], [60, 90], [290, 85]].map(([x, y], i) => (
              <circle key={i} className="sa-star" cx={x} cy={y} r="1.6" fill="#f3eedd" style={{ animationDelay: `${i * 0.4}s` }} />
            ))}
          </>
        )}

        {kind === "dawn" && <circle className="sa-sun" cx="160" cy="140" r="34" fill="#fff1c9" />}

        {/* skyline / horizon */}
        {kind !== "river" && (
          <path
            d="M0 150 h30 v-30 h20 v15 h25 v-45 h30 v40 h20 v-20 h35 v35 h25 v-55 h30 v50 h20 v-25 h30 v30 h55 v50 H0z"
            fill={kind === "dawn" ? "#7a5a3a" : "#0b1119"}
            opacity={kind === "dawn" ? 0.75 : 0.9}
          />
        )}

        {kind === "river" && (
          <>
            <path d="M0 120 Q80 100 160 118 T320 112 V200 H0z" fill="#1d4250" />
            {[135, 155, 175].map((y, i) => (
              <path
                key={y}
                className="sa-wave"
                d={`M0 ${y} q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0`}
                stroke="#cfe3dc"
                strokeWidth="1.5"
                fill="none"
                opacity={0.5 - i * 0.12}
                style={{ animationDuration: `${6 + i * 2}s` }}
              />
            ))}
          </>
        )}

        {/* the walker, yellow panjabi */}
        <g transform="translate(150 132)">
          <circle cx="0" cy="-22" r="5" fill="#2a1f0a" />
          <path d="M-7 -16 h14 l3 22 h-20z" fill="#e2b33c" />
          <path d="M-4 6 l-2 12 M4 6 l2 12" stroke="#2a1f0a" strokeWidth="2.5" />
        </g>

        {kind === "rain" &&
          Array.from({ length: 28 }, (_, i) => (
            <line
              key={i}
              className="sa-drop"
              x1={(i * 37) % 320}
              y1={(i * 53) % 200}
              x2={((i * 37) % 320) - 4}
              y2={((i * 53) % 200) + 12}
              stroke="#cfd8de"
              strokeWidth="1.2"
              opacity=".7"
              style={{ animationDelay: `${(i % 7) * 0.15}s` }}
            />
          ))}
      </svg>
    </div>
  );
}
