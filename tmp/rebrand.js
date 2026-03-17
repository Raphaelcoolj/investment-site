const fs = require('fs');
const path = require('path');

const replacements = [
  { file: './src/app/api/auth/forgot-password/route.ts', replaces: [ { from: 'NovaVault', to: 'Merrick Investments PLC.' } ] },
  { file: './src/app/page.tsx', replaces: [ { from: 'NovaVault', to: 'Merrick', all: true } ] },
  { file: './src/app/layout.tsx', replaces: [ { from: 'NovaVault', to: 'Merrick Investments PLC.' } ] },
  { file: './src/app/dashboard/layout.tsx', replaces: [ { from: 'NovaVault', to: 'Merrick' } ] },
  { file: './src/app/api/auth/[...nextauth]/route.ts', replaces: [ { from: 'novavault.com', to: 'merrickinvestments.com', all: true } ] },
  { file: './src/auth.ts', replaces: [ { from: 'novavault.com', to: 'merrickinvestments.com', all: true } ] },
  { file: './src/app/auth/register/page.tsx', replaces: [ { from: 'NovaVault', to: 'Merrick Investments PLC.' } ] },
  { file: './src/app/auth/login/page.tsx', replaces: [ { from: 'NovaVault', to: 'Merrick Investments PLC.' } ] },
  { file: './README.md', replaces: [ { from: 'NovaVault', to: 'Merrick Investments PLC.', all: true } ] },
  { file: './src/app/admin/layout.tsx', replaces: [ { from: 'NovaVault', to: 'Merrick' } ] },
  { file: './src/components/Footer.tsx', replaces: [ { from: 'NovaVault', to: 'Merrick Investments PLC.' } ] },
  { file: './src/components/Sidebar.tsx', replaces: [ { from: 'NovaVault', to: 'Merrick' } ] },
  { file: './src/components/TransactionReceipt.tsx', replaces: [ { from: 'NovaVault', to: 'Merrick Investments PLC.' } ] }
];

replacements.forEach(({ file, replaces }) => {
  const absolutePath = path.resolve(__dirname, '..', file); // from tmp/ back to root
  if (fs.existsSync(absolutePath)) {
    let content = fs.readFileSync(absolutePath, 'utf8');
    replaces.forEach(({ from, to, all }) => {
      if (all) {
        content = content.replace(new RegExp(from, 'gi'), to);
      } else {
        content = content.replace(new RegExp(from, 'i'), to);
      }
    });
    fs.writeFileSync(absolutePath, content);
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file} at ${absolutePath}`);
  }
});
