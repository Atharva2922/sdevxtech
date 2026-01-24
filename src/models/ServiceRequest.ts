import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    serviceName: {
        type: String, // Store snapshot of name
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    details: {
        type: String, // User's message/requirements
        required: true
    }
}, {
    timestamps: true
});

// Index for quicker lookups by user
serviceRequestSchema.index({ userId: 1, status: 1 });

export default mongoose.models.ServiceRequest || mongoose.model('ServiceRequest', serviceRequestSchema);
