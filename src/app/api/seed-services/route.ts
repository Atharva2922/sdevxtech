import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Service from '@/models/Service';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // Check if services already exist
        const existingServices = await Service.countDocuments();
        if (existingServices > 0) {
            return NextResponse.json(
                { message: 'Services already seeded', count: existingServices },
                { status: 200 }
            );
        }

        // Seed initial services
        const services = [
            {
                name: 'Web Design',
                description: 'Custom website design with modern UI/UX',
                icon: 'Palette',
                color: '#667eea',
                features: ['Responsive Design', 'UI/UX', 'Prototyping'],
                price: 'Starting at $2,999',
                isActive: true
            },
            {
                name: 'Web Development',
                description: 'Full-stack development with latest technologies',
                icon: 'Code',
                color: '#10b981',
                features: ['React/Next.js', 'Node.js', 'Database'],
                price: 'Starting at $4,999',
                isActive: true
            },
            {
                name: 'SEO Optimization',
                description: 'Improve your search engine rankings',
                icon: 'Search',
                color: '#f59e0b',
                features: ['On-page SEO', 'Content', 'Analytics'],
                price: 'Starting at $999/mo',
                isActive: true
            },
            {
                name: 'Mobile Apps',
                description: 'iOS and Android app development',
                icon: 'Smartphone',
                color: '#3b82f6',
                features: ['Native Apps', 'Cross-platform', 'App Store'],
                price: 'Starting at $7,999',
                isActive: true
            },
            {
                name: 'Digital Marketing',
                description: 'Grow your business online',
                icon: 'TrendingUp',
                color: '#ec4899',
                features: ['Social Media', 'Ads', 'Email Marketing'],
                price: 'Starting at $1,499/mo',
                isActive: true
            },
            {
                name: 'Security & Maintenance',
                description: 'Keep your website secure and updated',
                icon: 'Shield',
                color: '#8b5cf6',
                features: ['SSL', 'Backups', '24/7 Monitoring'],
                price: 'Starting at $299/mo',
                isActive: true
            }
        ];

        const createdServices = await Service.insertMany(services);

        return NextResponse.json(
            {
                message: 'Services seeded successfully',
                count: createdServices.length,
                services: createdServices
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Error seeding services:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
