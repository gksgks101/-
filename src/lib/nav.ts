export const primaryNav = [
  {href: '/', labelKey: 'home'},
  {href: '/tournaments', labelKey: 'worldCup'},
  {href: '/quizzes/personality-match', labelKey: 'personality'},
  {href: '/quizzes/ideal-match', labelKey: 'compatibility'},
] as const;

export const footerNav = [
  {href: '/about', labelKey: 'about'},
  {href: '/privacy', labelKey: 'privacy'},
  {href: '/contact', labelKey: 'contact'},
] as const;

export function isActivePath(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
