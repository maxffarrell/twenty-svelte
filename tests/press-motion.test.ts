import { afterEach, expect, it, vi } from 'vitest';
import { createPressMotion } from '../src/lib/components/button/press-motion';
afterEach(() => vi.useRealTimers());
it('keeps return motion for 100ms after release, without animating unrelated releases', () => {
 vi.useFakeTimers();
 const update=vi.fn();
 const motion=createPressMotion(update);
 motion.release();
 expect(update).not.toHaveBeenCalled();
 motion.press(); motion.release();
 vi.advanceTimersByTime(99);
 expect(update.mock.calls).toEqual([[false],[true]]);
 vi.advanceTimersByTime(1);
 expect(update.mock.calls).toEqual([[false],[true],[false]]);
});
it('a second press cancels the earlier release timer', () => {
 vi.useFakeTimers();
 const update=vi.fn();
 const motion=createPressMotion(update);
 motion.press(); motion.release(); vi.advanceTimersByTime(50); motion.press(); vi.advanceTimersByTime(100);
 expect(update.mock.calls).toEqual([[false],[true],[false]]);
 motion.release(); vi.advanceTimersByTime(100);
 expect(update).toHaveBeenLastCalledWith(false);
});
it('cancel clears pending return motion during blur, disabling, or teardown', () => {
 vi.useFakeTimers();
 const update=vi.fn();
 const motion=createPressMotion(update);
 motion.press(); motion.release(); motion.cancel(); vi.advanceTimersByTime(100);
 expect(update.mock.calls).toEqual([[false],[true],[false]]);
});
