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
            subject : 'Please verify your BACKEND2 COMMERCE user' ,
            html : `
                <html>
                    <body>
                        <h2>Welcome to BACKEND2 COMMERCE!</h2>
                        <p>Thank you for signing up. Please verify your email address to complete your registration.</p>
                        <p>Your verification code is: <strong>${verificationCode}</strong></p>
                        <p>If you did not request this, please ignore this email.</p>
                        <p>Best regards,</p>
                        <p>The BACKEND2 COMMERCE Team</p>
                    </body>
                </html>
            `
        })
    } catch (error) {
        throw error;
    }
}


export {sendVerificationEmail}