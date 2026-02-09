import mongoose, { Schema, model, models, Document } from 'mongoose';

interface IUser extends Document {
    username: string;
    email: string;
    password?: string; // Password might not be selected in some queries
    role: 'user' | 'admin';
    walletAddress?: string;
    profileImage?: string;
    balance: number;
    dailyIncrement: number;
    isIncrementing: boolean;
    lastIncrementDate: Date;
    resetPasswordToken?: string;
    resetPasswordExpiry?: Date;
}

const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    walletAddress: {
        type: String,
        default: '', 
    },
    profileImage: {
        type: String,
        default: '', // Cloudinary URL
    },
    balance: {
        type: Number,
        default: 0.00,
    },
    dailyIncrement: {
        type: Number,
        default: 0,
    },
    isIncrementing: {
        type: Boolean,
        default: false,
    },
    lastIncrementDate: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
}, { timestamps: true });

const User = (models.User || model<IUser>('User', UserSchema)) as mongoose.Model<IUser>;

export default User;
