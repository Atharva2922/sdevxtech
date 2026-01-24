import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Project from '@/models/Project';
import Log from '@/models/Log';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();

        // Auth Check
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 1. User Stats
        const totalUsers = await User.countDocuments({ role: 'user' });

        // Users created in last 6 months buckets
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const userGrowthRaw = await User.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Map aggregated data to array [Jan, Feb, ...] 
        // Note: simplified for demo, ideally map 1-12 to Month Names

        // 2. Project Stats
        const totalProjects = await Project.countDocuments();
        const projectStats = await Project.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // 3. Activity / Logs Stats
        const totalLogs = await Log.countDocuments();

        // Most Active Users (by log count in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const activeUsersRaw = await Log.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo }, user: { $ne: 'System' } } },
            {
                $group: {
                    _id: "$user",
                    count: { $sum: 1 },
                    lastActive: { $max: "$createdAt" }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Format active users
        const activeUsers = activeUsersRaw.map(u => ({
            name: u._id,
            visits: u.count,
            lastActive: u.lastActive
        }));

        return NextResponse.json({
            users: {
                total: totalUsers,
                growth: userGrowthRaw
            },
            projects: {
                total: totalProjects,
                breakdown: projectStats
            },
            logs: {
                total: totalLogs,
                activeUsers
            }
        });

    } catch (error: unknown) {
        console.error('Analytics error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
