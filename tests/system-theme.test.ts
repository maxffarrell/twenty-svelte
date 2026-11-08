import { expect, it } from 'vitest';
import { watchSystemTheme } from '../src/demo/system-theme';
it('follows initial system appearance and live changes, then unsubscribes', () => {
 const media = Object.assign(new EventTarget(), { matches: true });
 const root = document.createElement('div');
 root.className = 'light';
 const stop = watchSystemTheme(media as MediaQueryList, root);
 expect(root.className).toBe('dark');
 expect(root.style.colorScheme).toBe('dark');
 media.matches = false;
 media.dispatchEvent(new Event('change'));
 expect(root.className).toBe('light');
 expect(root.style.colorScheme).toBe('light');
 stop();
 media.matches = true;
 media.dispatchEvent(new Event('change'));
 expect(root.className).toBe('light');
});
