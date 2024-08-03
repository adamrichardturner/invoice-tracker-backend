import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendConfirmationEmail = async (
    userEmail: string,
    confirmationToken: string,
) => {
    const url = `https://invoice-tracker.adamrichardturner.dev/auth/confirm-email?token=${confirmationToken}`;

    await resend.emails.send({
        from: "hello@adamrichardturner.dev",
        to: userEmail,
        subject: "Confirm your email",
        html: `Click <a href="${url}">here</a> to confirm your email.`,
    });
};
