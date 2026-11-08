/** Keep appearance in sync with the operating system, with no stored override. */
export function watchSystemTheme(preference: MediaQueryList, root: HTMLElement) {
 const update = () => {
  root.classList.toggle('dark', preference.matches);
  root.classList.toggle('light', !preference.matches);
  root.style.colorScheme = preference.matches ? 'dark' : 'light';
 };
 update();
 preference.addEventListener('change', update);
 return () => preference.removeEventListener('change', update);
}
