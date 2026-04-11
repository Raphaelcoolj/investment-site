import fs from 'fs';
import path from 'path';
import DocClientLayout from '@/components/DocClientLayout';

export default async function DocPage() {
  const getFileContent = (filepath: string) => {
    try {
      const fullPath = path.join(process.cwd(), filepath);
      return fs.readFileSync(fullPath, 'utf-8');
    } catch (e) {
      return '';
    }
  };

  const filesToRead = [
    {
      id: 'src-auth',
      category: 'cat-auth',
      filename: 'src/auth.ts',
      description: 'Core NextAuth configuration payload.',
      details: 'Defines the standard JWT methodology for next-auth. Uses bcryptjs to compare credentials.'
    },
    {
      id: 'src-api-auth',
      category: 'cat-auth',
      filename: 'src/app/api/auth/[...nextauth]/route.ts',
      description: 'NextAuth Dynamic Handlers',
      details: 'Proxies Next.js requests into the standard NextAuth adapter.'
    },
    {
      id: 'src-login',
      category: 'cat-auth',
      filename: 'src/app/auth/login/page.tsx',
      description: 'Client login UI interface',
      details: 'Provides the visual login form. Dispatches signIn API handlers locally.'
    },
    {
      id: 'src-invest-model',
      category: 'cat-invest',
      filename: 'src/models/Investment.ts',
      description: 'Investment Mongoose Schema',
      details: 'Structurally assigns an Investment to a User ObjectId. Tracks: productName, amountInvested, totalProfit.'
    },
    {
      id: 'src-transaction-model',
      category: 'cat-invest',
      filename: 'src/models/Transaction.ts',
      description: 'Universal Ledger Schema',
      details: 'Provides chronological accounting tracking every balance change via ENUMs.'
    },
    {
      id: 'src-api-invest',
      category: 'cat-invest',
      filename: 'src/app/api/invest/route.ts',
      description: 'Investment Booking Engine',
      details: 'Safely decrements MongoDB User Balance and spawns Investment + Transaction documents concurrently.'
    },
    {
      id: 'src-api-deposit',
      category: 'cat-invest',
      filename: 'src/app/api/deposit/route.ts',
      description: 'Deposit Tracking Initiation',
      details: 'Spawns pending Transaction records when a user deposits.'
    },
    {
      id: 'src-user-model',
      category: 'cat-users',
      filename: 'src/models/User.ts',
      description: 'User Mongoose Profile Interface',
      details: 'Stores fundamental identifiers, security hashes, and active wallet balances.'
    },
    {
      id: 'src-api-profile',
      category: 'cat-users',
      filename: 'src/app/api/user/profile/route.ts',
      description: 'Profile Resolution & Auto-Compound Engine',
      details: 'Computes elapsed days since last login and artificially increments User Balance if enabled.'
    },
    {
      id: 'src-api-upload',
      category: 'cat-users',
      filename: 'src/app/api/upload/route.ts',
      description: 'Cloudinary Transport Gateway',
      details: 'Takes multipart/form-data via POST, transforms the byte payload into an arrayBuffer() & securely delegates stream pipes directly to Cloudinary v2 SDK\'s upload_stream with strict credentials pulled from environment definitions.'
    },
    {
      id: 'src-dashboard-profile',
      category: 'cat-users',
      filename: 'src/app/dashboard/profile/page.tsx',
      description: 'Profile & DP Upload Controller (Bug Fixes)',
      details: 'Houses the newly fixed \'Logout\' architecture routing hard to the NextAuth handler and includes the asynchronous inline DP uploader triggering FormData processing to our Cloudinary adapter.'
    },
    {
      id: 'src-api-admin-user',
      category: 'cat-admin',
      filename: 'src/app/api/admin/users/[id]/route.ts',
      description: 'Master User Controller',
      details: 'Administrative endpoint for modifying (PATCH) or destroying (DELETE) specific accounts.'
    },
    {
      id: 'src-admin-user-page',
      category: 'cat-admin',
      filename: 'src/app/admin/users/[id]/page.tsx',
      description: 'Admin Editing Workspace',
      details: 'Allows form modifications to arbitrarily override wallet values and contains cascading User Deletion trigger workflows.'
    },
    {
      id: 'src-admin-investments',
      category: 'cat-admin',
      filename: 'src/app/admin/investments/page.tsx',
      description: 'Global Investment Monitor',
      details: 'Complete table registry for tracking investments system-wide.'
    },
    {
      id: 'src-admin-user-investments',
      category: 'cat-admin',
      filename: 'src/app/admin/users/[id]/investments/page.tsx',
      description: 'User-Specific Investment Ledger (New Feature)',
      details: 'An isolated administrative view that queries the global investment pool and filters strictly for investments matching the exact parameter ID, allowing admins to track individual user financial activity cleanly.'
    },
    {
      id: 'src-db',
      category: 'cat-core',
      filename: 'src/lib/db.ts',
      description: 'Persistent Mongoose Connection Pooling',
      details: 'MongoDB initiation scripts storing established promises globally.'
    },
    {
      id: 'src-mermaid',
      category: 'cat-core',
      filename: 'src/components/MermaidChart.tsx',
      description: 'Safe Document Rendering',
      details: 'Client side container for Mermaid.js resolving hydration mismatch errors securely.'
    }
  ];

  const fileData = filesToRead.map(item => ({
    ...item,
    code: getFileContent(item.filename)
  }));

  return <DocClientLayout fileData={fileData} />;
}
