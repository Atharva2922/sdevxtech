import nodemailer, { Transporter } from "nodemailer";

type MailPayload = {
    to: string;
    subject: string;
    html: string;
    text?: string;
};

let cachedTransport: Transporter | null = null;

const getTransport = () => {
    if (cachedTransport) return cachedTransport;

    const host = process.env.MAIL_HOST;
    const user = process.env.MAIL_USER;
    const pass = process.env.MAIL_PASS;
    const port = Number(process.env.MAIL_PORT ?? 465);

    if (!host || !user || !pass) {
        throw new Error("SMTP credentials are not configured.");
    }

    cachedTransport = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for other ports
        auth: {
            user,
            pass,
        },
    });

    return cachedTransport;
};

export async function sendMail(payload: MailPayload) {
    const from = process.env.MAIL_FROM || process.env.MAIL_USER;
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const hasSmtpConfig = process.env.MAIL_HOST && process.env.MAIL_USER && process.env.MAIL_PASS;

    // Dev mode fallback to avoid spamming real emails
    // But allow override if credentials are provided
    if (isDevelopment && !hasSmtpConfig) {
        console.log(`[DEV] Email via Nodemailer to ${payload.to}: ${payload.html.replace(/<[^>]+>/g, "")}`);
        return;
    }

    const transporter = getTransport();
    await transporter.sendMail({
        from,
        ...payload,
    });
}
