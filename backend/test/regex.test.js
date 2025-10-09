const test = require('node:test');
const assert = require('node:assert');

// Test regex patterns
const patterns = require('../utils/regex');

test('Regex patterns validation', (t) => {
  // Test name pattern
  assert.ok(patterns.name.test('John Doe'), 'Valid name should pass');
  assert.ok(patterns.name.test("O'Connor"), 'Name with apostrophe should pass');
  assert.ok(!patterns.name.test('123'), 'Numbers only should fail');
  assert.ok(!patterns.name.test(''), 'Empty string should fail');

  // Test email pattern
  assert.ok(patterns.email.test('user@example.com'), 'Valid email should pass');
  assert.ok(!patterns.email.test('invalid-email'), 'Invalid email should fail');

  // Test account number pattern
  assert.ok(patterns.accountNumber.test('12345678'), 'Valid account number should pass');
  assert.ok(patterns.accountNumber.test('12345678901234567890'), 'Long account number should pass');
  assert.ok(!patterns.accountNumber.test('1234567'), 'Short account number should fail');

  // Test currency pattern
  assert.ok(patterns.currency.test('USD'), 'Valid currency code should pass');
  assert.ok(patterns.currency.test('EUR'), 'Another valid currency should pass');
  assert.ok(!patterns.currency.test('usd'), 'Lowercase currency should fail');
  assert.ok(!patterns.currency.test('US'), 'Short currency should fail');

  // Test amount pattern
  assert.ok(patterns.amount.test('123.45'), 'Valid amount should pass');
  assert.ok(patterns.amount.test('1000'), 'Whole number amount should pass');
  assert.ok(!patterns.amount.test('123.456'), 'Too many decimals should fail');

  // Test SWIFT code pattern
  assert.ok(patterns.swiftCode.test('ABCDUS33XXX'), 'Valid 11-char SWIFT should pass');
  assert.ok(patterns.swiftCode.test('ABCDUS33'), 'Valid 8-char SWIFT should pass');
  assert.ok(!patterns.swiftCode.test('abcdus33'), 'Lowercase SWIFT should fail');
});

console.log('✅ All regex pattern tests passed!');
