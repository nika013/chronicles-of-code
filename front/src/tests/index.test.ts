// math.test.ts
import { sum } from './math';

// Test case 1: Test the sum function with positive numbers
test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

// Test case 2: Test the sum function with negative numbers
test('adds -1 + -2 to equal -3', () => {
  expect(sum(-1, -2)).toBe(-3);
});

// Test case 3: Test the sum function with zero
test('adds 0 + 0 to equal 0', () => {
  expect(sum(0, 0)).toBe(0);
});
