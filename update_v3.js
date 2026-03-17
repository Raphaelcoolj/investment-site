const fs = require('fs');
console.log('Starting script...');
try {
  const map = {
    './src/app/api/auth/forgot-password/route.ts': [ [/NovaVault/gi, 'Merrick Investments PLC.'] ],
    './src/app/page.tsx': [ [/NovaVault/g, 'Merrick'] ],
    './src/app/layout.tsx': [ [/NovaVault/gi, 'Merrick Investments PLC.'] ],
    './src/app/dashboard/layout.tsx': [ [/NovaVault/gi, 'Merrick'] ],
    './src/app/api/auth/[...nextauth]/route.ts': [ [/novavault\.com/gi, 'merrickinvestments.com'] ],
    './src/auth.ts': [ [/novavault\.com/gi, 'merrickinvestments.com'], [/NovaVault/gi, 'Merrick Investments PLC.'] ],
    './src/app/auth/register/page.tsx': [ [/NovaVault/gi, 'Merrick Investments PLC.'] ],
    './src/app/auth/login/page.tsx': [ [/NovaVault/gi, 'Merrick Investments PLC.'] ],
    './README.md': [ [/NovaVault/gi, 'Merrick Investments PLC.'] ],
    './src/app/admin/layout.tsx': [ [/NovaVault/gi, 'Merrick'] ],
    './src/components/Footer.tsx': [ [/NovaVault/gi, 'Merrick Investments PLC.'] ],
    './src/components/Sidebar.tsx': [ [/NovaVault/gi, 'Merrick'] ],
    './src/components/TransactionReceipt.tsx': [ [/NovaVault/gi, 'Merrick Investments PLC.'] ]
  };

  for (const [file, replaces] of Object.entries(map)) {
    let content = fs.readFileSync(file, 'utf8');
    for (const [from, to] of replaces) {
      content = content.replace(from, to);
    }
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
} catch(e) { console.error('Error during execution:', e); }
console.log('Finished script execution.');
