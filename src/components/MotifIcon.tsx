import type { ReactNode } from "react";
import type { ThemeId } from "@/lib/interpret/themes";

const PATH: Record<ThemeId, ReactNode> = {
  character: (
    <>
      <path d="M20 44c8-18 12-28 12-36 0 8 4 18 12 36" fill="none" stroke="#2f6b3a" strokeWidth="2.4" />
      <path d="M20 28h24" stroke="#2f6b3a" strokeWidth="2" />
      <circle cx="32" cy="14" r="4" fill="#2f6b3a" />
    </>
  ),
  love: (
    <>
      <path d="M16 28c0-6 5-10 10-10 3 0 6 2 6 6 0-4 3-6 6-6 5 0 10 4 10 10 0 10-16 20-16 20S16 38 16 28z" fill="#c43c28" />
      <circle cx="24" cy="20" r="2" fill="#f3efe6" />
    </>
  ),
  wealth: (
    <>
      <ellipse cx="32" cy="36" rx="14" ry="6" fill="#d4a017" />
      <path d="M18 36V22c8-8 20-8 28 0v14" fill="none" stroke="#d4a017" strokeWidth="2.2" />
      <circle cx="32" cy="20" r="5" fill="#c43c28" />
    </>
  ),
  career: (
    <>
      <path d="M12 40l20-28 20 28z" fill="none" stroke="#1d4e89" strokeWidth="2.2" />
      <path d="M24 40c4-10 12-10 16 0" fill="none" stroke="#1d4e89" strokeWidth="2" />
      <circle cx="32" cy="22" r="3" fill="#c43c28" />
    </>
  ),
  health: (
    <>
      <circle cx="32" cy="28" r="12" fill="none" stroke="#2f6b3a" strokeWidth="2.2" />
      <path d="M32 16c8 8 10 14 0 24C22 30 24 24 32 16z" fill="#2f6b3a" />
    </>
  ),
  year: (
    <>
      <circle cx="32" cy="26" r="10" fill="#c43c28" />
      <path d="M12 42c8-8 32-8 40 0" fill="none" stroke="#1d4e89" strokeWidth="2.2" />
      <path d="M18 38c6-4 22-4 28 0" fill="none" stroke="#e8e0d0" strokeWidth="1.6" />
    </>
  ),
};

export function MotifIcon({ id }: { id: ThemeId }) {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10" aria-hidden>
      <rect x="4" y="4" width="56" height="56" rx="8" fill="#1a140e" stroke="#c4a574" strokeWidth="1.5" />
      <rect x="10" y="10" width="44" height="44" rx="4" fill="none" stroke="#8c1c12" strokeWidth="1" />
      {PATH[id]}
    </svg>
  );
}

export function ElementGlyph({ element }: { element: "wood" | "fire" | "earth" | "metal" | "water" }) {
  if (element === "wood") {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8">
        <path d="M24 8c0 10 6 14 6 22H18c0-8 6-12 6-22z" fill="#2f6b3a" />
        <rect x="22" y="28" width="4" height="12" fill="#3d2a1a" />
      </svg>
    );
  }
  if (element === "fire") {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8">
        <path d="M24 8c8 10 12 16 12 24a12 12 0 1 1-24 0c0-8 4-14 12-24z" fill="#c43c28" />
        <path d="M24 22c4 4 6 7 6 12a6 6 0 1 1-12 0c0-5 2-8 6-12z" fill="#d4a017" />
      </svg>
    );
  }
  if (element === "earth") {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8">
        <path d="M8 34l16-20 16 20z" fill="#d4a017" />
        <rect x="10" y="34" width="28" height="6" fill="#8c7349" />
      </svg>
    );
  }
  if (element === "metal") {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8">
        <circle cx="24" cy="24" r="12" fill="#e8e0d0" stroke="#8c7349" strokeWidth="2" />
        <circle cx="24" cy="24" r="5" fill="#c4a574" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" className="h-8 w-8">
      <path d="M6 30c6-8 10-8 16 0s10 8 16 0 10-8 16 0" fill="none" stroke="#1d4e89" strokeWidth="3" />
      <path d="M6 38c6-8 10-8 16 0s10 8 16 0 10-8 16 0" fill="none" stroke="#6b8498" strokeWidth="2" />
    </svg>
  );
}
