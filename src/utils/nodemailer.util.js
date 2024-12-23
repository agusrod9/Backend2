import {createTransport} from 'nodemailer';
import envUtil from './env.util.js';

const {GOOGLE_MAIL, GOOGLE_PASS} = envUtil;

const transport = createTransport({
    host : 'smtp.gmail.com',
    port : 465,
    secure : true,
    auth : { user: GOOGLE_MAIL, pass: GOOGLE_PASS}
});

const sendVerificationEmail = async(to, verificationCode)=>{
    try {
        await transport.verify(); //método propio de transport, verifica la correcta creación
        await transport.sendMail({
            from : GOOGLE_MAIL,
            to,
            subject : 'Please verify your e-mail - BACKEND2 COMMERCE',
            html : `
                <html>
                    <body>
                        <h2>Welcome to BACKEND2 COMMERCE!</h2>
                        <p>Thank you for signing up. Please verify your email address to complete your registration.</p>
                        <p>Your verification code is: <strong>${verificationCode}</strong></p>
                        <p>If you did not request this, please ignore this email.</p>
                        <br>
                        <p>Best regards,</p>
                        <p>The BACKEND2 COMMERCE Team</p>
                    </body>
                </html>
            `
        })
    } catch (error) {
        throw error;
    }
};

const sendResetPasswordEmail = async(to, url)=>{
    try {
        await transport.verify();
        await transport.sendMail({
            from : GOOGLE_MAIL,
            to,
            subject : 'Password Reset - BACKEND2 COMMERCE',
            html : `
                <html>
                    <body>
                        <h1>Need a new password?</h1>
                        <h2>No problem!</h2>
                        <p>Click in the link below to choose a new one.</p>
                        <a href="${url}">Choose my new password.</a>
                        <br>
                        <p>If you did not request this, please ignore this email.</p>
                        <br>
                        <p>Best regards,</p>
                        <p>The BACKEND2 COMMERCE Team</p>
                    </body>
                </html>
            `
        })
    } catch (error) {
        throw error
    }
}


export {sendVerificationEmail, sendResetPasswordEmail}