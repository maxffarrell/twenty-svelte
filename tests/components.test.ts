import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/svelte';
import { Button, Input } from '../src/lib/index.js';

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
 it('sets disabled on a button', () => {
  render(Button, { props: { 'aria-label': 'Unavailable', disabled: true } });
  expect((screen.getByRole('button', { name: 'Unavailable' }) as HTMLButtonElement).disabled).toBe(true);
 });
});
