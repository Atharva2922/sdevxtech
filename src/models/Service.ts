import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Service name is required'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Service description is required']
    },
    icon: {
        type: String,
        default: 'Code'
    },
    color: {
        type: String,
        default: '#667eea'
    },
    features: [{
        type: String
    }],
    price: {
        type: String,
        required: [true, 'Price is required']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for active services
serviceSchema.index({ isActive: 1 });

export default mongoose.models.Service || mongoose.model('Service', serviceSchema);
