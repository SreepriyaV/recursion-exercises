import assert from 'assert';
import equal from 'deep-equal';
import fibonacci from './';

// Fibonacci sequence https://en.wikipedia.org/wiki/Fibonacci_number

describe('fibonacci(n)', () => {

  it('should produce a sequence of Fibonacci numbers', () => {

    assert.ok(equal([0, 1, 1, 2, 3], fibonacci(5)));
  });
});
