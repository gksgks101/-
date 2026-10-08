export const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-strong';

export const primaryButton = `inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-violet px-7 text-base font-semibold text-ink transition hover:bg-violet-strong disabled:pointer-events-none disabled:opacity-40 ${focusRing}`;

export const secondaryButton = `inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-surface px-6 text-sm font-semibold text-foreground transition hover:bg-raised disabled:pointer-events-none disabled:opacity-40 ${focusRing}`;

export const textLink = `inline-flex min-h-12 items-center text-sm font-semibold text-foreground underline decoration-line underline-offset-4 hover:text-violet ${focusRing}`;
