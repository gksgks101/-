import {Link} from '@/i18n/navigation';
import {Container} from '@/components/ui/container';
import {primaryButton} from '@/components/ui/styles';

export function UnavailableResult({
  title,
  body,
  href,
  label,
}: {
  title: string;
  body: string;
  href: string;
  label: string;
}) {
  return (
    <article className="py-16 md:py-24">
      <Container>
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{title}</h1>
          <p className="mt-4 text-lg leading-8 text-muted">{body}</p>
          <Link href={href} className={`mt-8 ${primaryButton}`}>
            {label}
          </Link>
        </div>
      </Container>
    </article>
  );
}
