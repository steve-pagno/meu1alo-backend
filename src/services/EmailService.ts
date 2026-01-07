import nodemailer from 'nodemailer';

export class EmailService {
    private static transporter = nodemailer.createTransport({
        host: "smtp.mailersend.net",
        port: 2525,
        auth: {
            // Lembre-se de usar variáveis de ambiente em produção!
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    static async sendRecoveryEmail(email: string, newPass: string) {
        try {
            await this.transporter.sendMail({
                from: '"Meu Primeiro Alô" <noreply@meuprimeiroalo.com.br>',
                to: email,
                subject: "Recuperação de Senha - Meu Primeiro Alô",
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333;">
                        <h2 style="color: #4CAF50;">Recuperação de Senha</h2>
                        <p>Olá,</p>
                        <p>Recebemos uma solicitação para redefinir sua senha no <b>Meu Primeiro Alô</b>.</p>
                        <p>Sua nova senha temporária é:</p>
                        <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 2px;">
                            ${newPass}
                        </div>
                        <p>Por favor, faça login e altere esta senha imediatamente na área "Minha Conta".</p>
                    </div>
                `
            });
            console.log(`Email de recuperação enviado para ${email}`);
            return true;
        } catch (error) {
            console.error("Erro ao enviar email:", error);
            return false;
        }
    }

    static async sendWelcomeEmail(email: string, name: string) {
        try {
            await this.transporter.sendMail({
                from: '"Meu Primeiro Alô" <noreply@meuprimeiroalo.com.br>',
                to: email,
                subject: "Bem-vindo ao Meu Primeiro Alô! 🎉",
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
                        <div style="background-color: #4CAF50; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="color: white; margin: 0;">Bem-vindo!</h1>
                        </div>
                        <div style="padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
                            <p style="font-size: 16px;">Olá <strong>${name}</strong>,</p>
                            
                            <p>Estamos muito felizes em ter você conosco no <b>Meu Primeiro Alô</b>.</p>
                            
                            <p>Seu cadastro foi realizado com sucesso. Agora você pode acessar a plataforma para gerenciar triagens, acompanhar resultados e muito mais.</p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="http://localhost:3000/login" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Acessar Minha Conta</a>
                            </div>

                            <p style="font-size: 14px; color: #777;">Se tiver qualquer dúvida, nossa equipe está à disposição.</p>
                        </div>
                    </div>
                `
            });
            console.log(`Email de boas-vindas enviado para ${name}`);
            return true;
        } catch (error) {
            console.error("Erro ao enviar email de boas-vindas:", error);
            return false;
        }
    }
}