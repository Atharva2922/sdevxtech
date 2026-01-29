import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import { generateOtp, hashOtp } from "@/lib/otp";
import OtpToken from "@/models/OtpToken";
// import User from "@/models/User"; // Optional: Check if user exists

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();
        if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

        await connectDB();

        // Optional: Check if user exists before sending OTP
        // const user = await User.findOne({ email });
        // if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const code = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // Dev Helper: Write to file in dev mode
        if (process.env.NODE_ENV !== 'production') {
            try {
                const fs = await import('fs');
                const path = await import('path');
                // Write to a temp file in the root directory
                fs.writeFileSync(path.join(process.cwd(), 'otp_temp.txt'), `${email}: ${code}\n`, { flag: 'a' });
            } catch (e) {
                console.error("Failed to write dev OTP file:", e);
            }
        }

        // Upsert OTP token
        await OtpToken.findOneAndUpdate(
            { email },
            { code: hashOtp(code), expiresAt },
            { upsert: true, new: true }
        );

        await sendMail({
            to: email,
            subject: "Your Login Code",
            html: `<p>Your login code is: <strong>${code}</strong></p>
                   <p>This code expires in 10 minutes.</p>`
        });

        return NextResponse.json({ success: true, message: "OTP sent" });
    } catch (error) {
        console.error("Request OTP Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
