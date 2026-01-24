import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Service from '@/models/Service';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET: Fetch all active services (public)
export async function GET() {
    try {
        await connectDB();

        const services = await Service.find({ isActive: true }).sort({ createdAt: -1 });

        return NextResponse.json({ services });
    } catch (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: Create service (admin only)
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
        }

        const body = await req.json();
        const service = await Service.create(body);

        return NextResponse.json({ service }, { status: 201 });
    } catch (error: unknown) {
        console.error('Error creating service:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
    }
}

// PUT: Update service (admin only)
export async function PUT(req: NextRequest) {
    try {
        await connectDB();

        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
        }

        const body = await req.json();
        const { id, ...updateData } = body;

        const service = await Service.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!service) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        return NextResponse.json({ service });
    } catch (error: unknown) {
        console.error('Error updating service:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE: Delete service (admin only)
export async function DELETE(req: NextRequest) {
    try {
        await connectDB();

        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Service ID required' }, { status: 400 });
        }

        await Service.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
