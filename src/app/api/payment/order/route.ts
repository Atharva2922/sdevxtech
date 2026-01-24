import { NextRequest, NextResponse } from 'next/server';
import razorpay from '@/lib/razorpay';
import connectDB from '@/lib/db';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { createLog } from '@/lib/logger';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // 1. Authenticate
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
        }

        const { amount, description } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        // 2. Create Razorpay Order
        const options = {
            amount: Math.round(amount * 100), // Convert to paise (integers)
            currency: 'INR',
            receipt: `receipt_${Date.now()}_${payload.userId.substring(0, 5)}`,
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            throw new Error('Razorpay order creation failed');
        }

        // 3. Create Transaction Record (Pending)
        const transaction = await Transaction.create({
            user: payload.userId,
            amount: amount,
            currency: 'INR',
            status: 'Pending',
            razorpayOrderId: order.id,
            description: description || 'Payment'
        });

        // 4. Log
        await createLog({
            action: 'Payment Initiated',
            details: `Order ${order.id} created for amount ₹${amount}`,
            type: 'info',
            user: payload.email,
            source: 'Payment'
        });

        return NextResponse.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            description: transaction.description
        });

    } catch (error: any) {
        console.error('Payment Init Error:', JSON.stringify(error, null, 2));
        return NextResponse.json(
            { error: 'Failed to initiate payment', details: error.error?.description || error.message },
            { status: 500 }
        );
    }
}
