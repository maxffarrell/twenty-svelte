/** Preserve the source's 100ms return transition without easing instant hover entry. */
export function createPressMotion(setTransition: (enabled: boolean) => void) {
 let pressed = false;
 let timer: ReturnType<typeof setTimeout> | undefined;
 const clear = () => { if (timer !== undefined) clearTimeout(timer); timer = undefined; };
 return {
  press() { clear(); pressed = true; setTransition(false); },
  release() {
   if (!pressed) return;
   pressed = false;
   clear();
   setTransition(true);
   timer = setTimeout(() => { timer = undefined; setTransition(false); }, 100);
  },
  cancel() { clear(); pressed = false; setTransition(false); }
 };
}
