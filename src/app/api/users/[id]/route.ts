import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { adminAuth } from '@/lib/firebase-admin';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// PUT: Update user (Admin only)
export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await connectDB();

        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const { id } = params;

        // Prevent admin from blocking themselves (optional safety check)
        if (id === payload.userId && body.status === 'Blocked') {
            return NextResponse.json({ error: 'Cannot block your own admin account' }, { status: 400 });
        }

        const { status, role, ...otherUpdates } = body;

        const updateData: any = { ...otherUpdates };
        if (role) updateData.role = role;

        // Map UI 'status' to DB 'isDisabled'
        if (status === 'Blocked') {
            updateData.isDisabled = true;
        } else if (status === 'Active') {
            updateData.isDisabled = false;
        } else if (typeof body.isDisabled === 'boolean') {
            updateData.isDisabled = body.isDisabled;
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Sync with Firebase Auth if status changed
        if (typeof updateData.isDisabled === 'boolean') {
            try {
                // We need to find the Firebase user by email since we don't strictly store the UID
                // (though for Google auth/Firebase users it matches but legacy/migrated might vary)
                if (adminAuth) {
                    const firebaseUser = await adminAuth.getUserByEmail(updatedUser.email);
                    if (firebaseUser) {
                        await adminAuth.updateUser(firebaseUser.uid, {
                            disabled: updateData.isDisabled
                        });
                        console.log(`Synced Firebase user status for ${updatedUser.email}: disabled=${updateData.isDisabled}`);
                    }
                } else {
                    console.warn('Firebase Admin not initialized, cannot sync user status');
                }
            } catch (firebaseError: any) {
                // If user not found in Firebase (e.g. legacy local only?), just log it
                if (firebaseError.code !== 'auth/user-not-found') {
                    console.error('Error syncing Firebase status:', firebaseError);
                }
            }
        }

        return NextResponse.json({ user: updatedUser });
    } catch (error: unknown) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE: Delete user (Admin only)
export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await connectDB();

        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id } = params;

        if (id === payload.userId) {
            return NextResponse.json({ error: 'Cannot delete your own admin account' }, { status: 400 });
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error: unknown) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
    }
}
