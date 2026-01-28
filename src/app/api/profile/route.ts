import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

// GET - Fetch current user's profile
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        // Get token from cookie
        const token = req.cookies.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Verify token
        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

        // Fetch user from database
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone || '',
                company: user.company || '',
                address: user.address || '',
                department: user.department || '',
                image: user.image || '',
                createdAt: user.createdAt
            }
        });
    } catch (error: unknown) {
        console.error('Profile fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch profile', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

// PUT - Update current user's profile
export async function PUT(req: NextRequest) {
    try {
        await connectDB();

        // Get token from cookie
        const token = req.cookies.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Verify token
        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

        // Get update data from request
        const body = await req.json();
        const { name, email, phone, company, address, department, image } = body;

        console.log('PUT /api/profile - Received update:', { userId: decoded.userId, hasImage: !!image, imageLength: image?.length, bodyImage: body.image });

        // Validate name (required)
        if (!name || name.trim() === '') {
            return NextResponse.json(
                { error: 'Name is required' },
                { status: 400 }
            );
        }

        // Update user in database
        const updatedUser = await User.findByIdAndUpdate(
            decoded.userId,
            {
                name: name.trim(),
                email: email?.trim() || undefined, // Allow email update
                phone: phone?.trim() || '',
                company: company?.trim() || '',
                address: address?.trim() || '',
                department: department?.trim() || '',
                image: image || ''
            },
            { new: true, runValidators: true }
        ).select('-password');

        console.log('PUT /api/profile - Updated user:', { id: updatedUser._id, savedImage: updatedUser.image });

        if (!updatedUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone || '',
                company: updatedUser.company || '',
                address: updatedUser.address || '',
                department: updatedUser.department || '',
                image: updatedUser.image || '',
                createdAt: updatedUser.createdAt
            }
        });
    } catch (error: any) {
        console.error('Profile update error:', error);

        // Handle duplicate key error (most likely email)
        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'Email already currently in use by another account.' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to update profile', details: error.message || 'Unknown error' },
            { status: 500 }
        );
    }
}
