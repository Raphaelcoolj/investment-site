import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IInvestment extends Document {
    userId: mongoose.Types.ObjectId;
    productId: string;
    productName: string;
    category: 'commodity' | 'stock' | 'real-estate';
    amountInvested: number;
    units?: number; // For real estate % or units
    totalProfit: number;
    status: 'active' | 'completed';
    lastPayoutDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const InvestmentSchema = new Schema<IInvestment>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['commodity', 'stock', 'real-estate'],
        required: true,
    },
    amountInvested: {
        type: Number,
        required: true,
    },
    units: {
        type: Number,
    },
    totalProfit: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active',
    },
    lastPayoutDate: {
        type: Date,
    },
}, { timestamps: true });

const Investment = models.Investment || model<IInvestment>('Investment', InvestmentSchema);

export default Investment;
