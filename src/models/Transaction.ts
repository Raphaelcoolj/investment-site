import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    amount: number;
    coin: string;
    type: 'deposit' | 'withdrawal' | 'increment' | 'investment' | 'payout';
    status: 'pending' | 'success' | 'failed';
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    coin: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['deposit', 'withdrawal', 'increment', 'investment', 'payout'],
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending',
    },
    description: {
        type: String,
        required: false,
    },
}, { timestamps: true });

// In Next.js, we need to handle HMR to avoid re-registering the model while allowing schema updates.
if (models.Transaction) {
    delete models.Transaction;
}
const Transaction = model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
