const fs = require('fs');
const path = require('path');

const coverageFile = path.join(__dirname, '..', 'coverage', 'lcov.info');

if (!fs.existsSync(coverageFile)) {
  console.error('Coverage file not found:', coverageFile);
  process.exit(1);
}

let content = fs.readFileSync(coverageFile, 'utf8');

// Fix SF lines so they are prefixed with 'backend/' when appropriate.
content = content.split(/\r?\n/).map((line) => {
  if (!line.startsWith('SF:')) return line;
  const original = line.slice(3).replace(/\\/g, '/');
  // If already absolute (starts with / or contains drive letter like C:), leave it.
  if (/^[A-Za-z]:\//.test(original) || original.startsWith('/')) {
    return 'SF:' + original;
  }
  if (original.startsWith('backend/')) return 'SF:' + original;
  // Prefix with backend/
  return 'SF:backend/' + original;
}).join('\n');

fs.writeFileSync(coverageFile, content, 'utf8');
console.log('Fixed lcov paths in', coverageFile);
