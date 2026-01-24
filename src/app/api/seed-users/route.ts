import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST() {
    try {
        await connectDB();

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@test.com' });
        if (existingAdmin) {
            return NextResponse.json(
                {
                    message: 'Admin user already exists!',
                    credentials: {
                        email: 'admin@test.com',
                        password: 'admin123',
                        role: 'admin'
                    }
                },
                { status: 200 }
            );
        }

        // Create admin user
        const hashedAdminPassword = await bcrypt.hash('admin123', 10);
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@test.com',
            password: hashedAdminPassword,
            role: 'admin'
        });

        // Create regular user
        const hashedUserPassword = await bcrypt.hash('user123', 10);
        const regularUser = await User.create({
            name: 'Regular User',
            email: 'user@test.com',
            password: hashedUserPassword,
            role: 'user'
        });

        return NextResponse.json(
            {
                message: 'Dummy users created successfully!',
                users: [
                    {
                        email: 'admin@test.com',
                        password: 'admin123',
                        role: 'admin'
                    },
                    {
                        email: 'user@test.com',
                        password: 'user123',
                        role: 'user'
                    }
                ]
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error('Error creating dummy users:', error);
        return NextResponse.json(
            { error: 'Failed to create users', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
