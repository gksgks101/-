import {Link} from '@/i18n/navigation';

export function Logo({className = ''}: {className?: string}) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 rounded-full font-display text-xl font-semibold tracking-tight text-foreground ${className}`}
    >
      <span
        aria-hidden="true"
        className="inline-block h-2.5 w-2.5 rotate-45 rounded-[2px] bg-violet"
      />
      Kaleid
    </Link>
  );
}
