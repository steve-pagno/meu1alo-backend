// src/services/EmailService.ts
import nodemailer from 'nodemailer';

export class EmailService {
    private static transporter = nodemailer.createTransport({
        host: "smtp.mailersend.net",
        port: 2525, // ou 587/8025
        auth: {
            user: process.env.SMTP_USER || "MS_XppYOM@meuprimeiroalo.com.br",
            pass: process.env.SMTP_PASS || "mssp.94xxlkn.jpzkmgqev71g059v.db2FAZl"
        }
    });

    static async sendNewPassword(email: string, newPass: string) {
        try {
            await this.transporter.sendMail({
                from: '"Meu Primeiro Alô" <noreply@meuprimeiroalo.com.br>',
                to: email,
                subject: "Recuperação de Senha - Meu Primeiro Alô",
                html: `
                    <h3>Sua senha foi redefinida</h3>
                    <p>Olá,</p>
                    <p>Recebemos uma solicitação para redefinir sua senha.</p>
                    <p>Sua nova senha temporária é: <b>${newPass}</b></p>
                    <p>Por favor, faça login e altere-a imediatamente.</p>
                `
            });
            return true;
        } catch (error) {
            console.error("Erro ao enviar email:", error);
            return false;
        }
    }
}