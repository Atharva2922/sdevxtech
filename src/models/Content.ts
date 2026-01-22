import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
    settings: { type: mongoose.Schema.Types.Mixed, default: {} },
    header: { type: mongoose.Schema.Types.Mixed, default: {} },
    hero: { type: mongoose.Schema.Types.Mixed, default: {} },
    services: { type: mongoose.Schema.Types.Mixed, default: {} },
    about: { type: mongoose.Schema.Types.Mixed, default: {} },
    contact: { type: mongoose.Schema.Types.Mixed, default: {} },
    footer: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true, strict: false });

// Prevent overwrite model error in development
export default mongoose.models.Content || mongoose.model('Content', ContentSchema);
