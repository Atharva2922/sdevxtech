import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: [true, 'Project name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Project description is required']
    },
    status: {
        type: String,
        enum: ['Planning', 'In Progress', 'Review', 'Completed'],
        default: 'Planning'
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required']
    },
    team: {
        type: String,
        default: 'Unassigned'
    },
    deliverables: [{
        type: String
    }]
}, {
    timestamps: true
});

// Index for faster queries
projectSchema.index({ userId: 1, status: 1 });

export default mongoose.models.Project || mongoose.model('Project', projectSchema);
