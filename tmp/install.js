const { execSync } = require('child_process');
console.log('Installing dependencies...');
try {
  execSync('npm install --no-fund --no-audit', { stdio: 'inherit', shell: true });
  console.log('Installation complete.');
} catch (e) {
  console.error('Failed', e);
}
