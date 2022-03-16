import { Job } from "bull";
import nodemailer from "nodemailer";

export const emailProcess = async (job: Job) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            secure: false,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        const info = await transporter.sendMail({
            from: process.env.MAIL_USERNAME,
            to: process.env.MAIL_USERNAME,
            subject: "Created data",
            text: JSON.stringify(job.data),
            html: `<h1>${JSON.stringify(job.data)}</h1>`,
        });

        console.log("Message sent: %s", info.messageId);

        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.log(error);
    }
};
