import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: function (this: any) {
            // Password only required for local auth
            return this.authProvider === 'local';
        },
        minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    phone: {
        type: String,
        default: '',
        trim: true
    },
    company: {
        type: String,
        default: '',
        trim: true
    },
    address: {
        type: String,
        default: '',
        trim: true
    },
    department: {
        type: String,
        default: '',
        trim: true
    },
    image: {
        type: String,
        default: ''
    },
    // OAuth and OTP fields
    authProvider: {
        type: String,
        enum: ['local', 'google', 'otp', 'firebase'],
        default: 'local'
    },
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    otp: {
        type: String,
        select: false // Don't return OTP in queries by default
    },
    otpExpires: {
        type: Date,
        select: false
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
