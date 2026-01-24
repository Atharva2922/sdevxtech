import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import Transaction from '@/models/Transaction';
import { createLog } from '@/lib/logger';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keySecret) {
            throw new Error('Razorpay secret not found');
        }

        // 1. Verify Signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            await createLog({
                action: 'Payment Failed',
                details: `Signature verification failed for order ${razorpay_order_id}`,
                type: 'error',
                user: 'System',
                source: 'Payment'
            });

            // Mark transaction as failed
            await Transaction.updateOne(
                { razorpayOrderId: razorpay_order_id },
                { status: 'Failed', razorpayPaymentId: razorpay_payment_id }
            );

            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // 2. Update Transaction Status
        const transaction = await Transaction.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            {
                status: 'Success',
                razorpayPaymentId: razorpay_payment_id
            },
            { new: true }
        ).populate('user', 'name email');

        if (transaction) {
            await createLog({
                action: 'Payment Successful',
                details: `Payment ${razorpay_payment_id} verified for order ${razorpay_order_id}`,
                type: 'success',
                user: transaction.user?.email || 'Unknown',
                source: 'Payment'
            });
        }

        return NextResponse.json({ success: true, message: 'Payment verified' });

    } catch (error: unknown) {
        console.error('Payment Verification Error:', error);
        return NextResponse.json(
            { error: 'Verification failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
