import { POST as depositPOST } from '@/app/api/deposit/route';
import { PATCH as adminUserPATCH } from '@/app/api/admin/users/[id]/route';
import Transaction from '@/models/Transaction';
import User from '@/models/User';
import { getServerSession } from 'next-auth';

jest.mock('@/lib/db');
jest.mock('@/models/User');
jest.mock('@/models/Transaction');
jest.mock('next-auth');

describe('Transaction APIs', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Deposit API', () => {
        it('should create a pending transaction', async () => {
            (getServerSession as jest.Mock).mockResolvedValue({ user: { id: 'user123' } });
            (User.findById as jest.Mock).mockResolvedValue({ _id: 'user123' });
            
            const req = new Request('http://localhost/api/deposit', {
                method: 'POST',
                body: JSON.stringify({ amount: 100, method: 'BTC', details: 'test payment' }),
            });

            const res = await depositPOST(req);
            
            expect(res.status).toBe(200);
            expect(Transaction.create).toHaveBeenCalledWith(expect.objectContaining({
                userId: 'user123',
                amount: 100,
                coin: 'BTC',
                type: 'deposit',
                status: 'pending'
            }));
        });
    });

    describe('Admin Transaction Approval', () => {
        it('should approve a pending deposit when balance increases', async () => {
            const mockUser = {
                _id: 'user123',
                balance: 100,
                save: jest.fn().mockResolvedValue(true),
            };
            (User.findById as jest.Mock).mockResolvedValue(mockUser);
            
            const mockPendingDeposit = {
                status: 'pending',
                save: jest.fn().mockResolvedValue(true),
            };
            (Transaction.findOne as jest.Mock).mockResolvedValue(mockPendingDeposit);

            const req = new Request('http://localhost/api/admin/users/user123', {
                method: 'PATCH',
                body: JSON.stringify({ balance: 200 }),
            });

            // Mock params for Next.js 13+ dynamic routes
            const params = { id: 'user123' };
            const res = await adminUserPATCH(req, { params });

            expect(res.status).toBe(200);
            expect(mockPendingDeposit.status).toBe('success');
            expect(mockPendingDeposit.save).toHaveBeenCalled();
        });

        it('should create a withdrawal record when balance decreases', async () => {
            const mockUser = {
                _id: 'user123',
                balance: 200,
                save: jest.fn().mockResolvedValue(true),
            };
            (User.findById as jest.Mock).mockResolvedValue(mockUser);

            const req = new Request('http://localhost/api/admin/users/user123', {
                method: 'PATCH',
                body: JSON.stringify({ balance: 50 }),
            });

            const params = { id: 'user123' };
            const res = await adminUserPATCH(req, { params });

            expect(res.status).toBe(200);
            expect(Transaction.create).toHaveBeenCalledWith(expect.objectContaining({
                userId: 'user123',
                amount: 150,
                type: 'withdrawal',
                status: 'success'
            }));
        });
    });
});
