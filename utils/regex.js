// Whitelist regex patterns for input validation
const patterns = {
  // Names: Letters, spaces, hyphens, apostrophes (2-50 chars)
  name: /^[a-zA-Z\s\-\']{2,50}$/,
  
  // Email: Standard email pattern
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  
  // Account numbers: 8-20 digits
  accountNumber: /^[0-9]{8,20}$/,
  
  // Currency codes: ISO 4217 (3 uppercase letters)
  currency: /^[A-Z]{3}$/,
  
  // Amount: Up to 2 decimal places, max 15 digits total
  amount: /^\d{1,13}(\.\d{1,2})?$/,
  
  // SWIFT/BIC codes: 8 or 11 characters
  swiftCode: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
  
  // ID numbers: Alphanumeric, 5-20 characters
  idNumber: /^[A-Za-z0-9]{5,20}$/,
  
  // Phone numbers: International format
  phone: /^\+?[1-9]\d{1,14}$/,
  
  // Addresses: Letters, numbers, spaces, common punctuation
  address: /^[a-zA-Z0-9\s\.\,\-\#]{5,200}$/,
  
  // Reference numbers: Alphanumeric with hyphens/underscores
  reference: /^[A-Za-z0-9\-_]{3,50}$/
};

module.exports = patterns;
