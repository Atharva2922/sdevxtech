import mongoose, { Schema, model, models } from "mongoose";

export interface IOtpToken extends mongoose.Document {
    email: string;
    code: string;
    expiresAt: Date;
}

const OtpTokenSchema = new Schema<IOtpToken>(
    {
        email: { type: String, required: true, lowercase: true, trim: true },
        code: { type: String, required: true },
        expiresAt: { type: Date, required: true },
    },
    { timestamps: true },
);

// TTL Index: Automatically delete document when expiresAt is reached
OtpTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
OtpTokenSchema.index({ email: 1 }, { unique: true });

const OtpToken = models.OtpToken || model<IOtpToken>("OtpToken", OtpTokenSchema);

export default OtpToken;
