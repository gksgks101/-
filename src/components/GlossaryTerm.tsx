"use client";

import { useState } from "react";

export function GlossaryTerm({ word, gloss }: { word: string; gloss: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block">
      <button
        type="button"
        className="underline decoration-[var(--dancheong)] decoration-2 underline-offset-4"
        aria-expanded={open}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        {word}
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute left-0 top-full z-20 mt-2 w-56 rounded-xl border border-[var(--line)] bg-[var(--paper)] p-3 text-left text-sm leading-6 text-[var(--ink)] shadow-lg"
        >
          {gloss}
        </span>
      )}
    </span>
  );
}
