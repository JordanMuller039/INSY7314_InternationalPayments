const patterns = require('../utils/regex');

describe('regex patterns', () => {
  test('name pattern', () => {
    expect(patterns.name.test('John Doe')).toBe(true);
    expect(patterns.name.test("O'Connor")).toBe(true);
    expect(patterns.name.test('123')).toBe(false);
  });

  test('email pattern', () => {
    expect(patterns.email.test('user@example.com')).toBe(true);
    expect(patterns.email.test('invalid-email')).toBe(false);
  });

  test('accountNumber pattern', () => {
    expect(patterns.accountNumber.test('12345678')).toBe(true);
    expect(patterns.accountNumber.test('1234567')).toBe(false);
  });

  test('currency and amount', () => {
    expect(patterns.currency.test('USD')).toBe(true);
    expect(patterns.amount.test('123.45')).toBe(true);
    expect(patterns.amount.test('123.456')).toBe(false);
  });
});
