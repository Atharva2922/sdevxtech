import Log from '@/models/Log';
import connectDB from '@/lib/db';

interface LogEntry {
    action: string;
    details: string;
    type?: 'info' | 'warning' | 'error' | 'success';
    user?: string;
    source?: string;
}

export async function createLog(entry: LogEntry) {
    try {
        await connectDB();
        await Log.create(entry);
    } catch (error) {
        console.error('Failed to create log:', error);
        // We don't want to fail the main request if logging fails, so we just catch it.
    }
}
