import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('No credentials provided.');
        }

        const { email, username, password } = credentials;

        // Basic validation
        if (!password) {
          throw new Error('Password is required.');
        }
        if (!email && !username) {
          throw new Error('Email or username is required.');
        }

        // Hardcoded Admin Check
        const isAdminEmail = email === 'Admin' || email === 'admin@novavault.com';
        const isAdminUsername = username === 'Admin';
        const isAdminPassword = password === 'oghenerurie@123';

        if ((isAdminEmail || isAdminUsername) && isAdminPassword) {
          return {
            id: 'admin-super-user',
            name: 'Admin',
            email: 'admin@novavault.com',
            role: 'admin',
            image: '',
            username: 'Admin',
          };
        }

        try {
          await connectToDatabase();

          let user;
          if (email) {
            user = await User.findOne({ email });
          } else if (username) {
            user = await User.findOne({ username });
          }

          if (!user) {
            throw new Error('Invalid credentials.');
          }

          if (!user.password) {
            throw new Error('User password not found in database.');
          }

          const passwordsMatch = await bcrypt.compare(password as string, user.password);
          if (passwordsMatch) {
            return {
              id: user._id.toString(),
              name: user.username,
              email: user.email,
              role: user.role,
              username: user.username,
            };
          } else {
            throw new Error('Invalid credentials.');
          }
        } catch (e: any) {
          console.error('Authorization error:', e.message);
          throw new Error(e.message || 'Something went wrong during authorization.');
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
});

export { handler as GET, handler as POST };
