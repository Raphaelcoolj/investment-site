import mongoose, { Schema, model, models } from 'mongoose';

const SiteSettingsSchema = new Schema({
    notificationEmail: {
        type: String,
        required: true,
    },
    paymentMethods: {
        btc: { type: String, default: '' },
        eth: { type: String, default: '' },
        usdt: { type: String, default: '' },
        sol: { type: String, default: '' },
        cashapp: { type: String, default: '' },
        paypal: { type: String, default: '' },
        applePay: { type: String, default: '' },
    }
}, { timestamps: true });

const SiteSettings = models.SiteSettings || model('SiteSettings', SiteSettingsSchema);

export default SiteSettings;
