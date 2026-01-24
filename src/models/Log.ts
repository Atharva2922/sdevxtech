import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        trim: true
    },
    details: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['info', 'warning', 'error', 'success'],
        default: 'info'
    },
    user: {
        type: String, // Can be user name or "System"
        default: 'System'
    },
    source: {
        type: String, // e.g., 'Auth', 'API', 'Database'
        default: 'System'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.Log || mongoose.model('Log', LogSchema);
