import type {Tone} from '@/content/types';

const tones: Record<Tone, string> = {
  violet: 'bg-[#2a2148] text-[#f4eeff]',
  iris: 'bg-[#312455] text-[#f7f3ff]',
  lilac: 'bg-[#1c243c] text-[#eef3ff]',
};

const sizes = {
  sm: 'h-11 w-11 text-xs',
  md: 'h-14 w-14 text-sm',
  lg: 'h-16 w-16 text-base',
};

export function Monogram({
  letters,
  tone = 'violet',
  size = 'md',
}: {
  letters: string;
  tone?: Tone;
  size?: keyof typeof sizes;
}) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl font-display font-semibold tracking-wide ${tones[tone]} ${sizes[size]}`}
    >
      <span className="absolute -right-2 -top-3 h-8 w-8 rotate-45 rounded-sm bg-white/10" />
      {letters}
    </span>
  );
}
