import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/svelte';
import { Button, Input, Card } from '../src/lib/index.js';

afterEach(cleanup);
describe('components', () => {
 it('forwards the click and disabled state to a native button', async () => {
  let calls = 0;
  render(Button, { props: { 'aria-label': 'Save', onclick: () => calls++ } });
  const button = screen.getByRole('button', { name: 'Save' });
  await fireEvent.click(button);
  expect(calls).toBe(1);
  expect(button.getAttribute('type')).toBe('button');
 });
 it('preserves input accessible name and value', async () => {
  render(Input, { props: { 'aria-label': 'Contact name', value: 'Ada' } });
  const input = screen.getByRole('textbox', { name: 'Contact name' }) as HTMLInputElement;
  expect(input.value).toBe('Ada');
  await fireEvent.input(input, { target: { value: 'Grace' } });
  expect(input.value).toBe('Grace');
 });
 it('keeps the card action accessible and out of native form submission by default', async () => {
  let calls = 0;
  render(Card.Action, { props: { 'aria-label': 'Remove contact', onclick: () => calls++ } });
  const action = screen.getByRole('button', { name: 'Remove contact' }) as HTMLButtonElement;
  expect(action.type).toBe('button');
  await fireEvent.click(action);
  expect(calls).toBe(1);
 });
 it('sets disabled on a button', () => {
  render(Button, { props: { 'aria-label': 'Unavailable', disabled: true } });
  expect((screen.getByRole('button', { name: 'Unavailable' }) as HTMLButtonElement).disabled).toBe(true);
 });
});

it('preserves consumer gesture handlers and suppresses return motion while disabled', async () => {
 const down = vi.fn();
 const { rerender } = render(Button, { props: { 'aria-label':'Gesture button', onpointerdown:down } });
 const button=screen.getByRole('button',{name:'Gesture button'});
 await fireEvent.pointerDown(button);
 expect(down).toHaveBeenCalledTimes(1);
 await fireEvent.pointerUp(button);
 expect(button.getAttribute('data-press-transition')).toBe('true');
 await rerender({ 'aria-label':'Gesture button', disabled:true });
 expect(button.hasAttribute('data-press-transition')).toBe(false);
 await fireEvent.blur(button);
 await rerender({ 'aria-label':'Gesture button', disabled:false });
 expect(button.hasAttribute('data-press-transition')).toBe(false);
});
it('forwards keyboard handlers while preserving native activation semantics', async () => {
 const keydown=vi.fn(), keyup=vi.fn();
 render(Button,{props:{'aria-label':'Keyboard button',onkeydown:keydown,onkeyup:keyup}});
 const button=screen.getByRole('button',{name:'Keyboard button'});
 await fireEvent.keyDown(button,{key:' '});
 expect(keydown).toHaveBeenCalledTimes(1);
 await fireEvent.keyUp(button,{key:' '});
 expect(button.getAttribute('data-press-transition')).toBe('true');
 expect(keyup).toHaveBeenCalledTimes(1);
 await fireEvent.blur(button);
 expect(button.hasAttribute('data-press-transition')).toBe(false);
});
