import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ServiceRequest from '@/models/ServiceRequest';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// POST: Create a new service request
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
        }

        const body = await req.json();
        const { serviceId, serviceName, details } = body;

        if (!serviceId || !details) {
            return NextResponse.json(
                { error: 'Service details and ID are required' },
                { status: 400 }
            );
        }

        const newRequest = await ServiceRequest.create({
            userId: payload.userId,
            serviceId,
            serviceName,
            status: 'Pending',
            details
        });

        return NextResponse.json({
            message: 'Service requested successfully',
            request: newRequest
        });

    } catch (error: any) {
        console.error('Service Request Error:', error);
        return NextResponse.json(
            { error: 'Failed to request service', details: error.message },
            { status: 500 }
        );
    }
}
