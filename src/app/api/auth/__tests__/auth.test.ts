import { POST as forgotPasswordPOST } from '@/app/api/auth/forgot-password/route';
import { POST as resetPasswordPOST } from '@/app/api/auth/reset-password/route';
import { POST as registerPOST } from '@/app/api/auth/register/route';
import User from '@/models/User';
import connectToDatabase from '@/lib/db';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

jest.mock('@/lib/db');
jest.mock('@/models/User');
jest.mock('nodemailer');
jest.mock('@/models/SiteSettings', () => ({
  findOne: jest.fn().mockResolvedValue({}),
}));

describe('Authentication APIs', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Register API', () => {
        it('should create a new user successfully', async () => {
            (User.findOne as jest.Mock).mockResolvedValue(null);
            (User.create as jest.Mock).mockResolvedValue({ username: 'testuser' });

            const req = new Request('http://localhost/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username: 'testuser', email: 'test@example.com', password: 'password123' }),
            });

            const res = await registerPOST(req);
            const data = await res.json();

            expect(res.status).toBe(201);
            expect(data.message).toContain('created successfully');
            expect(User.create).toHaveBeenCalled();
        });

        it('should fail if user already exists', async () => {
            (User.findOne as jest.Mock).mockResolvedValue({ email: 'test@example.com' });

            const req = new Request('http://localhost/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username: 'testuser', email: 'test@example.com', password: 'password123' }),
            });

            const res = await registerPOST(req);
            const data = await res.json();

            expect(res.status).toBe(400);
            expect(data.message).toContain('already exists');
        });
    });

    describe('Forgot Password API', () => {
        it('should return a success message even if user does not exist', async () => {
            (User.findOne as jest.Mock).mockResolvedValue(null);
            
            const req = new Request('http://localhost/api/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email: 'nonexistent@example.com' }),
            });

            const res = await forgotPasswordPOST(req);
            const data = await res.json();

            expect(res.status).toBe(200);
            expect(data.message).toContain('reset link will be sent');
        });

        it('should generate a token and "send" an email if user exists', async () => {
            const mockUser = {
                email: 'test@example.com',
                save: jest.fn().mockResolvedValue(true),
            };
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            const req = new Request('http://localhost/api/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email: 'test@example.com' }),
            });

            const res = await forgotPasswordPOST(req);
            const data = await res.json();

            expect(res.status).toBe(200);
            expect(mockUser.save).toHaveBeenCalled();
            expect(data.message).toContain('reset link will be sent');
        });
    });

    describe('Reset Password API', () => {
        it('should reset password with a valid token', async () => {
            const mockUser = {
                password: 'oldpassword',
                resetPasswordToken: 'hashedtoken',
                resetPasswordExpiry: new Date(Date.now() + 3600000),
                save: jest.fn().mockResolvedValue(true),
            };
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            const req = new Request('http://localhost/api/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({ token: 'validtoken', password: 'newpassword' }),
            });

            const res = await resetPasswordPOST(req);
            const data = await res.json();

            expect(res.status).toBe(200);
            expect(mockUser.save).toHaveBeenCalled();
            expect(data.message).toContain('successfully');
        });

        it('should fail with an invalid or expired token', async () => {
            (User.findOne as jest.Mock).mockResolvedValue(null);

            const req = new Request('http://localhost/api/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({ token: 'invalid', password: 'newpassword' }),
            });

            const res = await resetPasswordPOST(req);
            const data = await res.json();

            expect(res.status).toBe(400);
            expect(data.message).toContain('Invalid or expired');
        });
    });
});
